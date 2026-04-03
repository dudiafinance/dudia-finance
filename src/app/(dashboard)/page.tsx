import { Suspense } from 'react';
import {
  DashboardCards,
  MonthlyChart,
  CategoryChart,
  RecentTransactions,
} from '@/components/dashboard';

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao DUD.IA Finance
        </p>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <DashboardCards />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <MonthlyChart />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <CategoryChart />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
        <RecentTransactions />
      </Suspense>
    </div>
  );
}