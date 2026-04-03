'use client';

import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transactionsApi } from '@/lib/api/transactions';
import { categoriesApi } from '@/lib/api/categories';
import type { Transaction } from '@/lib/api/transactions';
import type { Category } from '@/lib/api/categories';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF6B6B',
];

export function CategoryChart() {
  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll({ limit: 100 }),
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: () => categoriesApi.getAll({ type: 'expense' }),
  });

  if (loadingTransactions || loadingCategories) {
    return <ChartSkeleton />;
  }

  const chartData = getCategoryData(transactions || [], categories || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px] bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function getCategoryData(transactions: Transaction[], categories: Category[]) {
  const categoryMap = new Map<string, { name: string; value: number }>();

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const categoryId = t.categoryId;
      const amount = parseFloat(t.amount);
      const category = categories.find((c) => c.id === categoryId);
      const categoryName = category?.name || 'Outros';

      if (categoryMap.has(categoryName)) {
        const existing = categoryMap.get(categoryName)!;
        categoryMap.set(categoryName, {
          name: categoryName,
          value: existing.value + amount,
        });
      } else {
        categoryMap.set(categoryName, {
          name: categoryName,
          value: amount,
        });
      }
    });

  return Array.from(categoryMap.values()).sort((a, b) => b.value - a.value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}