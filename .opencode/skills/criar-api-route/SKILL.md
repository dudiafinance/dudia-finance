# Skill: Criar API Route

## Objetivo
Esta skill ensina o agente a criar API routes seguindo o padrão do DUD.IA Finance.

## Quando Usar
Use esta skill quando precisar criar uma nova API route no Next.js App Router.

## Estrutura Base

### Arquivo
```
src/app/api/[recurso]/route.ts
```

### Template Completo
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { resourceName } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ============================================
// GET - Listar
// ============================================

export async function GET(request: NextRequest) {
  try {
    // 1. Autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validação de query params
    const { searchParams } = new URL(request.url);
    const { page, limit } = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    // 3. Query
    const data = await db.query.resourceName.findMany({
      where: eq(resourceName.userId, session.user.id),
      limit,
      offset: (page - 1) * limit,
      orderBy: [desc(resourceName.createdAt)],
    });

    // 4. Resposta
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Criar
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validação
    const body = await request.json();
    const validated = createSchema.parse(body);

    // 3. Inserção
    const [created] = await db.insert(resourceName)
      .values({
        ...validated,
        userId: session.user.id,
      })
      .returning();

    // 4. Resposta
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// Para rotas com [id], criar arquivo:
// src/app/api/[recurso]/[id]/route.ts
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const item = await db.query.resourceName.findFirst({
      where: and(
        eq(resourceName.id, params.id),
        eq(resourceName.userId, session.user.id)
      ),
    });

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateSchema.parse(body);

    const [updated] = await db.update(resourceName)
      .set({ ...validated, updatedAt: new Date() })
      .where(and(
        eq(resourceName.id, params.id),
        eq(resourceName.userId, session.user.id)
      ))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [deleted] = await db.delete(resourceName)
      .where(and(
        eq(resourceName.id, params.id),
        eq(resourceName.userId, session.user.id)
      ))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Checklist
- [ ] Autenticação com `auth()`
- [ ] Validação com Zod
- [ ] Tratamento de erros
- [ ] Códigos HTTP corretos
- [ ] Tipos TypeScript
- [ ] Soft delete (se aplicável)
- [ ] Paginação (se lista)
- [ ] Ordenação (se lista)

## Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 | Sucesso (GET, PUT) |
| 201 | Criado (POST) |
| 400 | Validação falhou |
| 401 | Não autenticado |
| 403 | Não autorizado |
| 404 | Não encontrado |
| 500 | Erro interno |