'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CategoriesPage() {
  const { data: incomeCategories, isLoading: loadingIncome } = useQuery({
    queryKey: ['categories', 'income'],
    queryFn: () => categoriesApi.getAll({ type: 'income' }),
  });

  const { data: expenseCategories, isLoading: loadingExpense } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: () => categoriesApi.getAll({ type: 'expense' }),
  });

  if (loadingIncome || loadingExpense) {
    return <CategoriesSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie suas categorias de receitas e despesas
          </p>
        </div>
        <Button asChild>
          <Link href="/categories/new">Nova Categoria</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-green-600">Receitas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomeCategories && incomeCategories.length > 0 ? (
              <div className="space-y-2">
                {incomeCategories.map((category: any) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/categories/${category.id}/edit`}>Editar</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma categoria de receita
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-600">Despesas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseCategories && expenseCategories.length > 0 ? (
              <div className="space-y-2">
                {expenseCategories.map((category: any) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/categories/${category.id}/edit`}>Editar</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma categoria de despesa
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}