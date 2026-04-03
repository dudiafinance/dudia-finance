'use client';

import { useQuery } from '@tanstack/react-query';
import { budgetsApi } from '@/lib/api/budgets';
import { categoriesApi } from '@/lib/api/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function BudgetsPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: budgets, isLoading: loadingBudgets } = useQuery({
    queryKey: ['budgets', currentMonth, currentYear],
    queryFn: () => budgetsApi.getAll({ month: currentMonth, year: currentYear }),
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: () => categoriesApi.getAll({ type: 'expense' }),
  });

  if (loadingBudgets || loadingCategories) {
    return <BudgetsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground">
            Defina limites de gastos por categoria
          </p>
        </div>
        <Button asChild>
          <Link href="/budgets/new">Novo Orçamento</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets && budgets.length > 0 ? (
          budgets.map((budget: any) => {
            const category = categories?.find((c: any) => c.id === budget.categoryId);
            const percentage = 0; // TODO: calcular baseado nas transações

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {category?.name || 'Sem categoria'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Limite</span>
                      <span className="font-medium">
                        {formatCurrency(parseFloat(budget.amount))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gasto</span>
                      <span className="font-medium">
                        {formatCurrency(0)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={`/budgets/${budget.id}/edit`}>
                        Editar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhum orçamento definido para este mês
              </p>
              <Button asChild>
                <Link href="/budgets/new">Criar primeiro orçamento</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function BudgetsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-36 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-2 w-full bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}