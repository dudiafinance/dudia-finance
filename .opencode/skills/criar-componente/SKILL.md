# Skill: Criar Componente

## Objetivo
Esta skill ensina o agente a criar componentes React seguindo o padrão do DUD.IA Finance com shadcn/ui, TanStack Query e TypeScript.

## Quando Usar
Use esta skill quando precisar criar um novo componente React.

## Estrutura Base

### Componente Simples
```typescript
// src/components/[pasta]/[nome-componente].tsx
'use client';

import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps extends ComponentProps<'div'> {
  title: string;
  description?: string;
}

export function MyComponent({
  title,
  description,
  className,
  ...props
}: MyComponentProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4',
        className
      )}
      {...props}
    >
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
```

### Com Data Fetching (TanStack Query)
```typescript
// src/components/[pasta]/[nome-componente].tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { resourceApi } from '@/lib/api/resource';
import { MyComponentSkeleton } from './my-component-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource'],
    queryFn: resourceApi.getAll,
  });

  if (isLoading) {
    return <MyComponentSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Erro ao carregar dados
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Componente</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </CardContent>
    </Card>
  );
}

// Componente Skeleton
export function MyComponentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
```

### Com Formulário
```typescript
// src/components/[pasta]/[nome-form].tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { resourceApi } from '@/lib/api/resource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
});

type FormData = z.infer<typeof formSchema>;

interface MyFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<FormData>;
}

export function MyForm({ onSuccess, defaultValues }: MyFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: resourceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource'] });
      onSuccess?.();
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
```

### Com Tabela
```typescript
// src/components/[pasta]/[nome-tabela].tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { resourceApi } from '@/lib/api/resource';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function MyTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['resource'],
    queryFn: resourceApi.getAll,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <Badge variant={item.active ? 'success' : 'secondary'}>
                {item.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Editar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Com Dialog/Modal
```typescript
// src/components/[pasta]/[nome-dialog].tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MyDialogProps {
  children: React.ReactNode;
  onConfirm?: () => void;
}

export function MyDialog({ children, onConfirm }: MyDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Ação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja continuar?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## shadcn/ui - Comandos de Instalação
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add badge
npx shadcn@latest add skeleton
```

## Checklist
- [ ] 'use client' no topo
- [ ] TypeScript interfaces
- [ ] Props documentadas
- [ ] Loading state (Skeleton)
- [ ] Error state
- [ ] Acessibilidade
- [ ] Dark mode
- [ ] Responsivo
- [ ] Export default

## Padrões
- Use `cn()` para classes condicionais
- Prefira composition pattern
- Use TanStack Query para data fetching
- Use React Hook Form + Zod para formulários
- Sempre tenha loading e error states