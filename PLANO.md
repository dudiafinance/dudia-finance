# DUD.IA Finance — Plano de Implementação Completo

---

## PRÉ-REQUISITOS — Programas a Instalar (Windows)

Antes de qualquer coisa, instale os programas abaixo em ordem. Todos são gratuitos.

### 1. Node.js (inclui npm e npx)

Node.js é o motor que roda o Next.js e todos os pacotes do projeto.

1. Acesse `nodejs.org/en/download`
2. Baixe a versão **LTS** (recomendada, atualmente 22.x)
3. Execute o instalador `.msi` e clique em Next em tudo
4. Ao final, marque **"Automatically install the necessary tools"** se aparecer
5. Reinicie o computador após a instalação

**Verificar:**
```
node --version
npm --version
npx --version
```

---

### 2. Git (inclui Git Bash)

Git é necessário para versionar o código e enviar para o GitHub. O Git Bash é o terminal que usaremos (inclui `openssl` para gerar secrets).

1. Acesse `git-scm.com/download/win`
2. Baixe o instalador para Windows (64-bit)
3. Durante a instalação:
   - **Default editor**: Visual Studio Code ou Notepad
   - **Adjusting PATH**: selecione **"Git from the command line and also from 3rd-party software"**
   - **Line ending**: selecione **"Checkout Windows-style, commit Unix-style"**
   - O resto pode deixar padrão

**Verificar (no Git Bash):**
```bash
git --version
openssl version
```

---

### 3. Visual Studio Code

Editor para revisar os arquivos gerados pela IA.

1. Acesse `code.visualstudio.com`
2. Baixe e instale para Windows
3. Durante a instalação, marque **"Add to PATH"** e **"Open with Code"**

**Extensões recomendadas** (instalar após abrir o VS Code):
- `ESLint`
- `Tailwind CSS IntelliSense`
- `GitLens`
- `Prisma` (syntax highlight para schemas)

---

### 4. GitHub CLI

Ferramenta para interagir com o GitHub pelo terminal.

1. Acesse `cli.github.com`
2. Baixe o instalador `.msi` para Windows
3. Após instalar, autentique no Git Bash:
```bash
gh auth login
```
Escolha: GitHub.com → HTTPS → Login with a web browser

**Verificar:**
```bash
gh --version
```

---

### 5. OpenCode

O agente de IA que vai escrever todo o código do projeto.

Abra o **Git Bash** e execute:
```bash
npm install -g opencode
```

Se der erro de permissão, abra o **PowerShell como Administrador**:
```powershell
npm install -g opencode
```

**Verificar:**
```bash
opencode --version
```

---

### Resumo dos Programas

| Programa | Para que serve | Download |
|----------|---------------|----------|
| Node.js LTS | Roda npm, npx e Next.js | nodejs.org |
| Git + Git Bash | Versionar código + terminal com openssl | git-scm.com |
| VS Code | Revisar arquivos gerados | code.visualstudio.com |
| GitHub CLI | Interagir com GitHub pelo terminal | cli.github.com |
| OpenCode | Agente de IA que escreve o código | `npm install -g opencode` |

### Verificação Completa (rodar no Git Bash)

```bash
node --version && npm --version && git --version && gh --version && opencode --version && openssl version
```

Se todos os 6 mostrarem versões, o ambiente está pronto.

---

## CONTAS A CRIAR (em ordem)

### 1. GitHub — github.com
- Criar conta (se não tiver)
- Criar repositório: `dudia-finance` (público — GitHub Actions ilimitado)
- Branch padrão: `main`
- Criar branch `develop` para desenvolvimento diário
- Em **Settings > Secrets and variables > Actions**, adicionar os secrets listados na seção de variáveis de ambiente

### 2. OpenRouter — openrouter.ai
- Criar conta
- Em **Keys** → **Create Key** → nome: `dudia-finance-dev` → copiar a chave (`sk-or-v1-xxxx`)
- Em **Credits** → definir limite de **$0/mês** (garante uso apenas de modelos gratuitos)

### 3. Vercel — vercel.com
- Criar conta com SSO do GitHub
- **Add New Project** → importar repositório `dudia-finance`
- Framework: Next.js (detectado automaticamente)
- Anotar **Project ID** e **Org/Team ID** em Settings > General
- Em **Account Settings > Tokens** → criar token `github-actions` → salvar como `VERCEL_TOKEN`
- Em **Project Settings > Environment Variables** → adicionar todas as variáveis de ambiente

### 4. Neon — neon.tech
- Criar conta com SSO do GitHub
- Criar projeto: `dudia-finance`, região: **US East** (mais próximo disponível)
- Em **Connection Details**:
  - Copiar **pooled connection string** → `DATABASE_URL` (usar com `?sslmode=require`)
  - Copiar **direct connection string** → `DIRECT_DATABASE_URL` (para migrations)
- Criar duas branches no Neon:
  - `main` — banco de produção
  - `dev` — banco de desenvolvimento local

### 5. Resend — resend.com
- Criar conta
- Em **Domains** → adicionar domínio (ou usar `onboarding@resend.dev` para desenvolvimento)
- Em **API Keys** → criar chave → copiar como `RESEND_API_KEY`

### 6. Gerar Secrets (no Git Bash)
```bash
openssl rand -base64 32   # → NEXTAUTH_SECRET
openssl rand -hex 32      # → CRON_SECRET
```

---

## CONFIGURAR O OPENCODE

### Arquivo de configuração global

Criar o arquivo: `C:\Users\Igor Massaro\.config\opencode\opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openrouter": {
      "api_key": "sk-or-v1-COLOQUE_SUA_CHAVE_AQUI",
      "models": {
        "deepseek/deepseek-chat-v3-0324:free": {},
        "deepseek/deepseek-r1:free": {},
        "qwen/qwen3.6-plus:free": {},
        "nvidia/nemotron-3-super-120b-a12b:free": {},
        "minimax/minimax-m2.5:free": {},
        "openrouter/free": {}
      }
    }
  },
  "model": "openrouter/deepseek/deepseek-chat-v3-0324:free",
  "autoshare": false
}
```

---

## MODELOS GRATUITOS DO OPENROUTER

Todos com `:free` no ID — custo zero, sem cartão de crédito.

| Modelo | ID | Contexto | Uso |
|--------|----|----------|-----|
| DeepSeek V3 0324 | `deepseek/deepseek-chat-v3-0324:free` | 131.072 | Geração de código geral |
| DeepSeek R1 | `deepseek/deepseek-r1:free` | 163.840 | Raciocínio e arquitetura |
| Qwen3.6 Plus | `qwen/qwen3.6-plus:free` | 1.000.000 | Agentic coding, contexto enorme |
| NVIDIA Nemotron 3 | `nvidia/nemotron-3-super-120b-a12b:free` | 262.144 | Multi-agent, tasks complexas |
| MiniMax M2.5 | `minimax/minimax-m2.5:free` | 196.608 | Componentes UI |
| Free Router | `openrouter/free` | 200.000 | Fallback automático |
| Arcee Trinity | `arcee-ai/trinity-large-thinking:free` | 262.144 | Planejamento profundo |

**Estratégia**: Se um modelo atingir rate limit, o agente muda automaticamente para outro.

---

## STACK TÉCNICA (100% gratuita)

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Agente de coding | OpenCode | Escreve o código automaticamente |
| Modelos de IA | OpenRouter `:free` | Custo zero |
| Framework web | Next.js 15 (App Router) | Full-stack, roda no Vercel |
| Banco de dados | Neon PostgreSQL | Gratuito, serverless |
| ORM | Drizzle ORM | Type-safe, zero overhead |
| Auth | NextAuth.js v5 | Self-hosted, sem custo |
| UI | shadcn/ui + Tailwind CSS | Componentes prontos |
| Gráficos | Recharts | Leve, compatível com React |
| Estado servidor | TanStack Query | Cache + background refetch |
| Estado UI | Zustand | Simples e leve |
| Validação | Zod | Type-safe em runtime |
| IA no sistema | Vercel AI SDK + OpenRouter | Streaming nativo |
| Email | Resend + React Email | 3.000 emails/mês grátis |
| Hosting | Vercel | Free tier generoso |
| Código / CI/CD | GitHub + GitHub Actions | Gratuito em repos públicos |

---

## AGENTES ESPECIALISTAS (OpenCode)

Criar a pasta `.opencode/agents/` dentro do projeto com 6 agentes:

### Agente 1 — Arquiteto (Orquestrador)
- **Arquivo**: `.opencode/agents/arquiteto/AGENT.md`
- **Modelo**: `deepseek/deepseek-r1:free`
- **Papel**: Analisa pedidos, quebra em tarefas e delega para os subagentes corretos
- **Quando usar**: Para iniciar qualquer feature nova ou tarefa complexa

### Agente 2 — Backend
- **Arquivo**: `.opencode/agents/backend/AGENT.md`
- **Modelo**: `deepseek/deepseek-chat-v3-0324:free`
- **Papel**: Cria API routes, lógica de negócio, validações Zod, queries Drizzle

### Agente 3 — Frontend
- **Arquivo**: `.opencode/agents/frontend/AGENT.md`
- **Modelo**: `qwen/qwen3.6-plus:free` (contexto 1M — lê todos os arquivos de uma vez)
- **Papel**: Cria páginas React, componentes shadcn/ui, hooks, stores Zustand

### Agente 4 — Banco de Dados
- **Arquivo**: `.opencode/agents/banco-de-dados/AGENT.md`
- **Modelo**: `deepseek/deepseek-r1:free`
- **Papel**: Define schemas Drizzle, migrations, otimização de queries e índices

### Agente 5 — IA Financeira
- **Arquivo**: `.opencode/agents/ia-financeira/AGENT.md`
- **Modelo**: `nvidia/nemotron-3-super-120b-a12b:free`
- **Papel**: Implementa os 5 agentes de IA do sistema (categorizador, insights, anomalias, budget advisor, chat)

### Agente 6 — DevOps
- **Arquivo**: `.opencode/agents/devops/AGENT.md`
- **Modelo**: `deepseek/deepseek-chat-v3-0324:free`
- **Papel**: GitHub Actions, Vercel, variáveis de ambiente, cron jobs

---

## SKILLS REUTILIZÁVEIS (OpenCode)

Criar a pasta `.opencode/skills/` com 5 skills:

| Skill | Arquivo | O que ensina ao agente |
|-------|---------|----------------------|
| `criar-api-route` | `.opencode/skills/criar-api-route/SKILL.md` | Padrão de API route: Zod + auth + erros |
| `criar-componente` | `.opencode/skills/criar-componente/SKILL.md` | Padrão shadcn/ui + TanStack Query + Skeleton |
| `criar-schema` | `.opencode/skills/criar-schema/SKILL.md` | Padrão Drizzle: colunas, índices, relations |
| `criar-agente-ia` | `.opencode/skills/criar-agente-ia/SKILL.md` | Vercel AI SDK + OpenRouter + Zod output |
| `deploy` | `.opencode/skills/deploy/SKILL.md` | Checklist antes de commitar e fazer deploy |

---

## CONFIGURAÇÃO DO PROJETO (opencode.json)

Criar na raiz do projeto `dudia_finance/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openrouter/deepseek/deepseek-chat-v3-0324:free",
  "agent": {
    "arquiteto": {
      "model": "openrouter/deepseek/deepseek-r1:free",
      "description": "Orquestrador principal. Analisa pedidos e delega para subagentes especialistas.",
      "permission": {
        "task": { "*": "allow" }
      }
    },
    "backend": {
      "model": "openrouter/deepseek/deepseek-chat-v3-0324:free",
      "description": "Especialista em Next.js API routes, Drizzle ORM e lógica de negócio."
    },
    "frontend": {
      "model": "openrouter/qwen/qwen3.6-plus:free",
      "description": "Especialista em React, shadcn/ui, Tailwind CSS e Recharts."
    },
    "banco-de-dados": {
      "model": "openrouter/deepseek/deepseek-r1:free",
      "description": "Especialista em PostgreSQL, schemas Drizzle e otimização de queries."
    },
    "ia-financeira": {
      "model": "openrouter/nvidia/nemotron-3-super-120b-a12b:free",
      "description": "Especialista em Vercel AI SDK, agentes de IA financeira e prompts."
    },
    "devops": {
      "model": "openrouter/deepseek/deepseek-chat-v3-0324:free",
      "description": "Especialista em GitHub Actions, Vercel deploy e infraestrutura."
    }
  },
  "permission": {
    "bash": {
      "npm install *": "allow",
      "npx *": "allow",
      "git *": "allow"
    },
    "skill": { "*": "allow" }
  }
}
```

---

## COMO USAR O OPENCODE

```bash
# 1. Abrir o Git Bash na pasta do projeto
cd "C:\Users\Igor Massaro\Documents\Projetos\dudia_finance"

# 2. Iniciar o OpenCode
opencode

# 3. Na interface:
#    - Tab: alterna entre Plan mode (só planeja) e Build mode (executa)
#    - Sempre revise no Plan mode antes de executar no Build mode
#    - @nome-do-agente para invocar um agente específico
```

---

## FASES DE DESENVOLVIMENTO (12 comandos)

Execute um por vez dentro do OpenCode. Aguarde terminar antes de ir para o próximo.

### Fase 1 — Inicializar o projeto
```
@arquiteto Inicialize o projeto DUD.IA Finance do zero usando Next.js 15 com App Router, TypeScript, Tailwind CSS e shadcn/ui. Configure Drizzle ORM com Neon PostgreSQL, NextAuth v5 e TanStack Query. Crie toda a estrutura de pastas do projeto.
```

### Fase 2 — Schema do banco de dados
```
@banco-de-dados Crie o schema completo em src/lib/db/schema.ts com as tabelas: users, accounts, sessions, verification_tokens, categories, transactions, recurring_rules, budgets, ai_insights, chat_sessions, chat_messages, notifications, user_preferences. Inclua todos os índices de performance.
```

### Fase 3 — Autenticação
```
@backend Implemente autenticação completa com NextAuth v5 e Drizzle Adapter. Crie as páginas de login e registro com validação Zod e feedback de erro. Configure proteção de rotas via middleware.
```

### Fase 4 — Layout do dashboard
```
@frontend Crie o layout completo do dashboard com sidebar, topbar, navegação mobile e user menu usando shadcn/ui. O sistema se chama DUD.IA Finance. Design moderno e profissional.
```

### Fase 5 — Categorias e transações
```
@arquiteto Implemente o módulo completo de categorias e transações: API routes, páginas, formulários, tabela com filtros e importação de CSV com deduplicação por hash.
```

### Fase 6 — Integração com IA
```
@ia-financeira Implemente os 5 agentes de IA usando Vercel AI SDK com OpenRouter: (1) categorizador automático de transações, (2) gerador de insights semanais em português, (3) detector de anomalias, (4) budget advisor, (5) chat em linguagem natural com tool use.
```

### Fase 7 — Dashboard com gráficos
```
@frontend Crie o dashboard completo com: cards de saldo, cards de resumo (receita/despesa/economia), gráfico de barras mensal, gráfico de pizza por categoria, gráfico de linha de poupança e lista de transações recentes. Use Recharts com dados reais da API.
```

### Fase 8 — Orçamentos e alertas
```
@arquiteto Implemente o módulo de orçamentos com: CRUD de budgets por categoria/mês, cálculo de utilização em tempo real, sistema de notificações in-app e envio de emails via Resend quando o orçamento for ultrapassado.
```

### Fase 9 — Relatórios
```
@frontend Crie as páginas de relatório mensal e anual com tabelas detalhadas, gráficos comparativos e botão de exportação para CSV/PDF.
```

### Fase 10 — Cron jobs e automações
```
@devops Configure o endpoint /api/webhooks/cron protegido por CRON_SECRET para processar: transações recorrentes vencidas, detecção de anomalias e insights semanais. Configure os 2 cron jobs no Vercel.
```

### Fase 11 — CI/CD
```
@devops Crie os 3 GitHub Actions workflows: ci.yml (typecheck + lint + testes em todo PR), deploy-preview.yml (preview no Vercel em PRs) e deploy-production.yml (migrations + deploy ao fazer merge na main).
```

### Fase 12 — Polimento e produção
```
@arquiteto Revise todo o sistema e adicione: loading skeletons, error boundaries, responsividade mobile completa, rate limiting nas rotas de auth e polimento visual. Prepare para lançamento v1.0.0.
```

---

## ESTRUTURA DE ARQUIVOS (gerada pelos agentes)

```
dudia_finance/
├── .opencode/
│   ├── agents/
│   │   ├── arquiteto/AGENT.md
│   │   ├── backend/AGENT.md
│   │   ├── frontend/AGENT.md
│   │   ├── banco-de-dados/AGENT.md
│   │   ├── ia-financeira/AGENT.md
│   │   └── devops/AGENT.md
│   └── skills/
│       ├── criar-api-route/SKILL.md
│       ├── criar-componente/SKILL.md
│       ├── criar-schema/SKILL.md
│       ├── criar-agente-ia/SKILL.md
│       └── deploy/SKILL.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-preview.yml
│       └── deploy-production.yml
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              ← Sidebar + Topbar
│   │   │   ├── page.tsx                ← Dashboard com gráficos
│   │   │   ├── transactions/
│   │   │   │   ├── page.tsx
│   │   │   │   └── import/page.tsx
│   │   │   ├── budgets/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   ├── ai-chat/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── transactions/route.ts
│   │       ├── transactions/[id]/route.ts
│   │       ├── transactions/import/route.ts
│   │       ├── transactions/recurring/route.ts
│   │       ├── categories/route.ts
│   │       ├── categories/[id]/route.ts
│   │       ├── budgets/route.ts
│   │       ├── budgets/status/route.ts
│   │       ├── reports/monthly/route.ts
│   │       ├── reports/annual/route.ts
│   │       ├── reports/cashflow/route.ts
│   │       ├── ai/chat/route.ts         ← Streaming
│   │       ├── ai/insights/route.ts
│   │       ├── ai/anomalies/route.ts
│   │       ├── notifications/route.ts
│   │       └── webhooks/cron/route.ts   ← Protegido por CRON_SECRET
│   ├── components/
│   │   ├── ui/                          ← shadcn/ui (gerado via CLI)
│   │   ├── layout/                      ← Sidebar, Topbar, MobileNav
│   │   ├── dashboard/                   ← Cards, gráficos, resumos
│   │   ├── transactions/                ← Tabela, formulários, CSV
│   │   ├── budgets/                     ← Cards, formulário de budget
│   │   ├── categories/                  ← Grid, formulário
│   │   ├── reports/                     ← Relatórios, exportação
│   │   └── ai/                          ← Chat, insights, anomalias
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts                 ← Neon + Drizzle client
│   │   │   ├── schema.ts                ← 13 tabelas
│   │   │   └── migrations/
│   │   ├── auth/
│   │   │   ├── config.ts                ← NextAuth + Drizzle Adapter
│   │   │   └── session.ts
│   │   ├── ai/
│   │   │   ├── client.ts                ← OpenRouter via Vercel AI SDK
│   │   │   ├── agents/                  ← 5 agentes financeiros
│   │   │   └── prompts/                 ← Prompts isolados por agente
│   │   ├── email/
│   │   │   ├── client.ts                ← Resend client
│   │   │   └── templates/               ← React Email templates
│   │   ├── validations/                 ← Zod schemas
│   │   └── utils/                       ← currency, date, csv-parser
│   ├── hooks/                           ← TanStack Query hooks
│   ├── store/                           ← Zustand stores
│   └── types/                           ← TypeScript types
├── opencode.json                        ← Config do OpenCode
├── .env.example
├── .env.local                           ← Nunca commitado
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
└── package.json
```

---

## BANCO DE DADOS — 13 TABELAS

| Tabela | Propósito |
|--------|-----------|
| `users` | Usuários com moeda, locale e timezone |
| `accounts` | Contas OAuth (NextAuth) |
| `sessions` | Sessões autenticadas (NextAuth) |
| `verification_tokens` | Tokens de verificação (NextAuth) |
| `categories` | Globais (userId=null) e personalizadas |
| `transactions` | Todas as transações com campos de IA e deduplicação |
| `recurring_rules` | Regras de transações recorrentes |
| `budgets` | Orçamentos por categoria/mês/ano |
| `ai_insights` | Insights gerados pela IA (persistidos) |
| `chat_sessions` | Sessões do chat com IA |
| `chat_messages` | Mensagens individuais (user/assistant/system) |
| `notifications` | Notificações in-app e email |
| `user_preferences` | Configurações de notificação e tema |

**Campos especiais em `transactions`:**
- `ai_categorized` — indica categorização automática pela IA
- `ai_confidence` — confiança 0.0–1.0
- `import_hash` — hash para deduplicação em importação CSV
- `deleted_at` — soft delete

**Índices de performance:**
```sql
-- Busca mais comum: transações por usuário + data
CREATE INDEX transactions_user_date_idx ON transactions(user_id, date);

-- Deduplicação de CSV
CREATE UNIQUE INDEX transactions_import_hash_idx ON transactions(user_id, import_hash);

-- Notificações não lidas
CREATE INDEX notifications_unread_idx ON notifications(user_id, is_read);

-- Recorrentes para o cron
CREATE INDEX recurring_rules_next_due_idx ON recurring_rules(next_due_date, is_active);
```

---

## AGENTES DE IA DENTRO DO SISTEMA (5 agentes financeiros)

Estes são os agentes que o **DUD.IA Finance** usará internamente após ser construído:

| Agente | Modelo | Função |
|--------|--------|--------|
| Categorizador | `deepseek/deepseek-chat-v3-0324:free` | Categoriza transações ao criar |
| Insights Semanais | `qwen/qwen3.6-plus:free` | 3-5 insights financeiros todo domingo |
| Detector de Anomalias | `deepseek/deepseek-r1:free` | Detecta gastos anômalos diariamente |
| Budget Advisor | `nvidia/nemotron-3-super-120b-a12b:free` | Sugere valores de orçamento |
| Chat Financeiro | `deepseek/deepseek-chat-v3-0324:free` | Perguntas em linguagem natural com tool use |

**Tools do Chat Financeiro:**
- `getTransactions(startDate, endDate, categoryId, type, limit)`
- `getSummary(startDate, endDate)`
- `getBudgetStatus(month, year)`
- `getCategoryBreakdown(startDate, endDate)`

**Exemplos de perguntas que o chat responde:**
- "Quanto gastei com alimentação esse mês?"
- "Estou dentro do orçamento?"
- "Qual foi meu maior gasto em março?"
- "Compare meus gastos deste ano com o ano passado"

---

## VARIÁVEIS DE AMBIENTE

```bash
# .env.example

# ── Banco de dados (Neon) ────────────────────────────────────────────
DATABASE_URL="postgresql://...?sslmode=require"      # pooled (runtime)
DIRECT_DATABASE_URL="postgresql://..."               # direct (migrations)

# ── Auth (NextAuth v5) ───────────────────────────────────────────────
NEXTAUTH_URL="https://dudia-finance.vercel.app"
NEXTAUTH_SECRET=""     # openssl rand -base64 32

# ── IA (OpenRouter) ──────────────────────────────────────────────────
OPENROUTER_API_KEY="sk-or-v1-xxxx"

# ── Email (Resend) ───────────────────────────────────────────────────
RESEND_API_KEY="re_xxxx"
RESEND_FROM_EMAIL="DUD.IA Finance <noreply@seudominio.com>"

# ── Segurança do Cron (Vercel) ───────────────────────────────────────
CRON_SECRET=""         # openssl rand -hex 32

# ── App ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://dudia-finance.vercel.app"
NEXT_PUBLIC_APP_NAME="DUD.IA Finance"

# ── GitHub Actions (adicionar nos Secrets do repositório) ────────────
VERCEL_TOKEN=""
VERCEL_ORG_ID=""
VERCEL_PROJECT_ID=""
NEON_DATABASE_URL=""
```

---

## CI/CD — 3 WORKFLOWS GITHUB ACTIONS

### `ci.yml` — Em todo PR
1. TypeScript typecheck (`tsc --noEmit`)
2. ESLint
3. Prettier format check
4. Testes unitários
5. `npm audit --audit-level=high`

### `deploy-preview.yml` — Em todo PR
1. Build do Next.js
2. Deploy preview no Vercel (URL única por PR para revisão)

### `deploy-production.yml` — Em push para `main`
1. `npx drizzle-kit migrate` — aplica migrations no banco de produção
2. Build do Next.js
3. Deploy `--prod` no Vercel

---

## CONFIGURAÇÃO VERCEL — CRON JOBS

Após o primeiro deploy, configurar em **Project Settings > Cron Jobs**:

| Rota | Schedule | Função |
|------|----------|--------|
| `POST /api/webhooks/cron` | `0 8 * * 0` | Domingo 8h UTC — insights semanais |
| `POST /api/webhooks/cron` | `0 2 * * *` | Diário 2h UTC — recorrentes + anomalias |

O Vercel injeta automaticamente `Authorization: Bearer <CRON_SECRET>` nessas chamadas.

---

## LIMITES DOS PLANOS GRATUITOS

| Serviço | Limite | Impacto |
|---------|--------|---------|
| Neon | 512 MB storage | Suficiente para uso pessoal |
| Vercel | 6.000 invocações de função/dia | Chat IA = 1 invocação por mensagem |
| OpenRouter free | 20–200 req/min por modelo | Agentes alternam automaticamente |
| Resend | 3.000 emails/mês, 100/dia | 100 usuários × digest = ~400/mês |
| GitHub Actions | Ilimitado em repo público | Usar repositório público |

---

## ORDEM DE EXECUÇÃO COMPLETA

```
1. Instalar programas: Node.js → Git → VS Code → GitHub CLI → OpenCode
2. Criar contas: OpenRouter → GitHub → Vercel → Neon → Resend
3. Gerar secrets: openssl rand -base64 32 e openssl rand -hex 32
4. Configurar OpenCode global: ~/.config/opencode/opencode.json
5. Criar repositório no GitHub e clonar na pasta dudia_finance
6. Criar opencode.json na raiz do projeto
7. Criar estrutura .opencode/ com agentes e skills
8. Abrir terminal na pasta → executar: opencode
9. Executar as 12 fases (uma por vez) com os comandos @agente
10. Após cada fase: revisar no Plan mode → confirmar no Build mode
11. Commit + push → GitHub Actions faz deploy automático
12. Configurar Cron Jobs no Vercel
13. Adicionar variáveis de ambiente no Vercel
14. Sistema em produção ✓
```

---

## VERIFICAÇÃO FINAL

| Teste | O que verificar |
|-------|----------------|
| Auth | Registrar e logar → sessão persistida no Neon |
| IA | Criar transação → `ai_categorized=true` no banco |
| CSV | Re-importar mesmo arquivo → sem duplicatas |
| Budget | Gastar além do limite → notificação criada + email enviado |
| Cron | Chamar endpoint com `Authorization: Bearer <CRON_SECRET>` → insights gerados |
| Chat | "Quanto gastei esse mês?" → resposta com dados reais |
| CI/CD | PR aberto → preview URL; merge em main → deploy automático |
