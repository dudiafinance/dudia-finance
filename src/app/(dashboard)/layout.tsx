import { Suspense } from "react";
import { Sidebar, Topbar } from "@/components/layout";

function DashboardLoading() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card animate-pulse" />
      <main className="flex-1 animate-pulse">
        <div className="h-16 border-b bg-card" />
        <div className="p-6">
          <div className="h-8 w-48 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Suspense fallback={<div className="h-16 border-b bg-card" />}>
          <Topbar />
        </Suspense>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}