'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transactionsApi } from '@/lib/api/transactions';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '@/lib/api/transactions';

export function MonthlyChart() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll({ limit: 100 }),
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const monthlyData = getMonthlyData(transactions || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => format(new Date(value), 'MMM', { locale: ptBR })}
            />
            <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => format(new Date(label), 'MMMM yyyy', { locale: ptBR })}
            />
            <Bar dataKey="income" name="Receitas" fill="#22c55e" />
            <Bar dataKey="expense" name="Despesas" fill="#ef4444" />
          </BarChart>
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

function getMonthlyData(transactions: Transaction[]) {
  const months = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    months.push({
      month: monthStart.toISOString(),
      income,
      expense,
    });
  }

  return months;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}