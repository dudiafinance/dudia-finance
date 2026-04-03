# Skill: Criar Agente de IA

## Objetivo
Esta skill ensina o agente a criar agentes de IA usando Vercel AI SDK com OpenRouter.

## Quando Usar
Use esta skill quando precisar criar um novo agente de IA ou funcionalidade com IA.

## Estrutura Base

### Cliente OpenRouter
```typescript
// src/lib/ai/client.ts
import { createOpenRouter } from '@ai-sdk/openrouter';

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Modelos disponíveis
export const models = {
  chat: 'deepseek/deepseek-chat-v3-0324:free',
  reasoning: 'deepseek/deepseek-r1:free',
  context: 'qwen/qwen3.6-plus:free',
  complex: 'nvidia/nemotron-3-super-120b-a12b:free',
};
```

### API Route com Streaming
```typescript
// src/app/api/ai/[agent]/route.ts
import { streamText } from 'ai';
import { openrouter } from '@/lib/ai/client';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
    messages,
    system: 'Você é um assistente financeiro brasileiro...',
  });

  return result.toDataStreamResponse();
}
```

### API Route com Tool Use
```typescript
// src/app/api/ai/chat/route.ts
import { streamText } from 'ai';
import { openrouter } from '@/lib/ai/client';
import { z } from 'zod';
import { db } from '@/lib/db';
import { transactions } from '@/lib/db/schema';
import { and, desc, eq, gte, lte } from 'drizzle-orm';

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  const result = await streamText({
    model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
    messages,
    tools: {
      // Tool 1: Buscar transações
      getTransactions: {
        description: 'Buscar transações do usuário',
        parameters: z.object({
          startDate: z.string().optional().describe('Data início (ISO)'),
          endDate: z.string().optional().describe('Data fim (ISO)'),
          categoryId: z.string().optional().describe('ID da categoria'),
          type: z.enum(['income', 'expense']).optional().describe('Tipo'),
          limit: z.number().optional().describe('Limite de resultados'),
        }),
        execute: async ({ startDate, endDate, categoryId, type, limit = 10 }) => {
          const conditions = [];

          if (startDate) conditions.push(gte(transactions.date, new Date(startDate)));
          if (endDate) conditions.push(lte(transactions.date, new Date(endDate)));
          if (categoryId) conditions.push(eq(transactions.categoryId, categoryId));
          if (type) conditions.push(eq(transactions.type, type));

          const result = await db.query.transactions.findMany({
            where: and(...conditions),
            limit,
            orderBy: [desc(transactions.date)],
          });

          return result;
        },
      },

      // Tool 2: Resumo financeiro
      getSummary: {
        description: 'Obter resumo financeiro por período',
        parameters: z.object({
          startDate: z.string().describe('Data início (ISO)'),
          endDate: z.string().describe('Data fim (ISO)'),
        }),
        execute: async ({ startDate, endDate }) => {
          const income = await db
            .select({ total: sum(transactions.amount) })
            .from(transactions)
            .where(and(
              eq(transactions.type, 'income'),
              gte(transactions.date, new Date(startDate)),
              lte(transactions.date, new Date(endDate))
            ));

          const expenses = await db
            .select({ total: sum(transactions.amount) })
            .from(transactions)
            .where(and(
              eq(transactions.type, 'expense'),
              gte(transactions.date, new Date(startDate)),
              lte(transactions.date, new Date(endDate))
            ));

          return {
            income: income[0]?.total || 0,
            expenses: expenses[0]?.total || 0,
            balance: (income[0]?.total || 0) - (expenses[0]?.total || 0),
          };
        },
      },

      // Tool 3: Status do orçamento
      getBudgetStatus: {
        description: 'Verificar status do orçamento mensal',
        parameters: z.object({
          month: z.number().describe('Mês (1-12)'),
          year: z.number().describe('Ano'),
        }),
        execute: async ({ month, year }) => {
          // Implementar busca de budget status
          // ...
        },
      },

      // Tool 4: Breakdown por categoria
      getCategoryBreakdown: {
        description: 'Obter gastos por categoria',
        parameters: z.object({
          startDate: z.string().describe('Data início (ISO)'),
          endDate: z.string().describe('Data fim (ISO)'),
        }),
        execute: async ({ startDate, endDate }) => {
          const result = await db
            .select({
              categoryId: transactions.categoryId,
              total: sum(transactions.amount),
            })
            .from(transactions)
            .where(and(
              eq(transactions.type, 'expense'),
              gte(transactions.date, new Date(startDate)),
              lte(transactions.date, new Date(endDate))
            ))
            .groupBy(transactions.categoryId);

          return result;
        },
      },
    },
    system: `Você é o DUD.IA, um assistente financeiro brasileiro.

REGRAS:
- Use as tools disponíveis para buscar dados reais do banco de dados
- Responda em português brasileiro
- Seja objetivo e amigável
- Forneça valores em Reais (R$)
- Dê conselhos práticos quando apropriado

CAPACIDADES:
- Buscar transações por período, categoria ou tipo
- Calcular resumo financeiro (receitas, despesas, saldo)
- Verificar status do orçamento
- Analisar gastos por categoria

PERGUNTAS QUE VOCÊ PODE RESPONDER:
- "Quanto gastei esse mês?"
- "Qual minha maior despesa?"
- "Estou dentro do orçamento?"
- "Compare meus gastos com o mês passado"
- "Quais categorias mais gastei?"
    `,
  });

  return result.toDataStreamResponse();
}
```

### Gerar Objeto Estruturado
```typescript
// src/lib/ai/agents/categorizer.ts
import { generateObject } from 'ai';
import { openrouter } from '@/lib/ai/client';
import { z } from 'zod';

const categorizationSchema = z.object({
  categoryId: z.string().uuid(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export async function categorizeTransaction(
  description: string,
  categories: Array<{ id: string; name: string }>
) {
  const { object } = await generateObject({
    model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
    schema: categorizationSchema,
    prompt: `
Você é um assistente financeiro que categoriza transações brasileiras.

Transação: "${description}"

Categorias disponíveis:
${categories.map(c => `- ${c.name} (${c.id})`).join('\n')}

Analise e retorne a categoria mais apropriada.
    `,
  });

  return object;
}
```

### Gerar Texto
```typescript
// src/lib/ai/agents/insights.ts
import { generateText } from 'ai';
import { openrouter } from '@/lib/ai/client';

export async function generateWeeklyInsights(transactions: any[]) {
  const { text } = await generateText({
    model: openrouter('qwen/qwen3.6-plus:free'),
    prompt: `
Você é um consultor financeiro brasileiro. Analise as transações da última semana:

${JSON.stringify(transactions, null, 2)}

Gere 3-5 insights financeiros em português brasileiro.
    `,
  });

  return text;
}
```

### Hook para Chat
```typescript
// src/hooks/use-chat-ai.ts
'use client';

import { useChat } from 'ai/react';

export function useChatAI() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Olá! Sou o DUD.IA, seu assistente financeiro. Como posso ajudar?',
      },
    ],
  });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}
```

### Componente de Chat
```typescript
// src/components/ai/chat.tsx
'use client';

import { useChatAI } from '@/hooks/use-chat-ai';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChatAI();

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Pergunte sobre suas finanças..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
```

## Checklist
- [ ] Cliente OpenRouter configurado
- [ ] Modelo gratuito selecionado
- [ ] System prompt definido
- [ ] Tools implementadas
- [ ] Zod schemas para tools
- [ ] Streaming configurado
- [ ] Tratamento de erros
- [ ] Prompt em português
- [ ] Rate limiting respeitado

## Modelos Gratuitos
- **deepseek/deepseek-chat-v3-0324:free** - Chat geral
- **deepseek/deepseek-r1:free** - Raciocínio
- **qwen/qwen3.6-plus:free** - Contexto grande
- **nvidia/nemotron-3-super-120b-a12b:free** - Complexo