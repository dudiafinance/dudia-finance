# Skill: Criar Schema Drizzle

## Objetivo
Esta skill ensina o agente a criar schemas Drizzle ORM para PostgreSQL seguindo o padrão do DUD.IA Finance.

## Quando Usar
Use esta skill quando precisar criar uma nova tabela no banco de dados.

## Estrutura Base

### Template Completo
```typescript
// src/lib/db/schema.ts

import { pgTable, uuid, text, timestamp, numeric, boolean, integer, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// ============================================
// ENUMS
// ============================================

export const statusEnum = pgEnum('status', ['active', 'inactive', 'pending']);

// ============================================
// TABELAS
// ============================================

export const tableName = pgTable('table_name', {
  // ID (sempre UUID)
  id: uuid('id').defaultRandom().primaryKey(),

  // Foreign Keys
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  // Strings
  name: text('name').notNull(),
  description: text('description'),

  // Números
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  quantity: integer('quantity').default(0),

  // Booleanos
  isActive: boolean('is_active').default(true),

  // Enums
  status: statusEnum('status').default('active'),

  // Datas
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),

  // Índices únicos
}, (table) => ({
  // Índice único composto
  uniqueIdx: uniqueIndex('table_name_unique_idx').on(table.userId, table.name),
  
  // Índice para busca
  searchIdx: index('table_name_search_idx').on(table.userId, table.status),
}));

// ============================================
// RELAÇÕES
// ============================================

export const tableNameRelations = relations(tableName, ({ one, many }) => ({
  // Belongs to
  user: one(users, {
    fields: [tableName.userId],
    references: [users.id],
  }),

  // Has many
  items: many(otherTable),

  // Belongs to many (many-to-many)
  tags: many(tags, {
    relationName: 'table_name_tags',
  }),
}));

// ============================================
// ZOD SCHEMAS
// ============================================

export const insertTableSchema = createInsertSchema(tableName);
export const selectTableSchema = createSelectSchema(tableName);
export const updateTableSchema = insertTableSchema.partial();

// ============================================
// TIPOS
// ============================================

export type TableName = typeof tableName.$inferSelect;
export type NewTableName = typeof tableName.$inferInsert;
export type UpdateTableName = Partial<NewTableName>;
```

## Tipos de Coluna

### Strings
```typescript
text('name').notNull()
text('email').notNull().unique()
text('description')
varchar('short', { length: 50 })
```

### Números
```typescript
integer('count').default(0)
numeric('amount', { precision: 15, scale: 2 }).notNull()
real('price')
serial('id') // auto-increment
```

### Booleanos
```typescript
boolean('is_active').default(true)
boolean('is_published').default(false)
```

### Datas
```typescript
timestamp('created_at').defaultNow().notNull()
timestamp('updated_at').defaultNow().notNull()
timestamp('deleted_at') // soft delete
date('birth_date')
```

### UUID
```typescript
uuid('id').defaultRandom().primaryKey()
uuid('user_id').references(() => users.id).notNull()
```

### Enums
```typescript
// Opção 1: pgEnum
export const statusEnum = pgEnum('status', ['active', 'inactive']);
status: statusEnum('status').default('active')

// Opção 2: text com check
status: text('status', { enum: ['active', 'inactive'] }).notNull()
```

### JSON
```typescript
jsonb('metadata')
json('settings')
```

## Índices

### Simples
```typescript
}, (table) => ({
  userIdIdx: index('idx_user_id').on(table.userId),
}));
```

### Composto
```typescript
}, (table) => ({
  userDateIdx: index('idx_user_date').on(table.userId, table.date),
}));
```

### Único
```typescript
}, (table) => ({
  uniqueEmailIdx: uniqueIndex('idx_unique_email').on(table.email),
}));
```

### Único Composto
```typescript
}, (table) => ({
  uniqueUserDateIdx: uniqueIndex('idx_unique_user_date').on(table.userId, table.date),
}));
```

## Relações

### One-to-Many
```typescript
// Na tabela "pai"
export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

// Na tabela "filho"
export const postRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
```

### Many-to-Many
```typescript
// Tabela de junção
export const postTags = pgTable('post_tags', {
  postId: uuid('post_id').references(() => posts.id).notNull(),
  tagId: uuid('tag_id').references(() => tags.id).notNull(),
});

// Relações
export const postRelations = relations(posts, ({ many }) => ({
  tags: many(tags, {
    relationName: 'post_tags',
  }),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  posts: many(posts, {
    relationName: 'post_tags',
  }),
}));
```

## Comandos Drizzle

### Gerar Migration
```bash
npm run db:generate
```

### Aplicar Migration
```bash
npm run db:migrate
```

### Push Direto (dev)
```bash
npm run db:push
```

### Visualizar Studio
```bash
npm run db:studio
```

## Checklist
- [ ] ID como UUID
- [ ] Foreign keys com `onDelete: 'cascade'`
- [ ] `createdAt` e `updatedAt`
- [ ] Índices para queries frequentes
- [ ] Relações bidirecionais
- [ ] Zod schemas gerados
- [ ] Tipos exportados
- [ ] Migration gerada
- [ ] Migration testada

## Convenções
- Tabelas em **snake_case** no banco
- Colunas em **snake_case** no banco
- Variáveis em **camelCase** no TypeScript
- Sempre usar UUID para IDs
- Numeric para valores monetários
- Soft delete com `deletedAt`
- Índices para joins e filtros