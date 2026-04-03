import { Suspense } from "react";
import { Sidebar, Topbar } from "@/components/layout";

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