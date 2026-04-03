export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">DUD.IA</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <p className="text-sm text-muted-foreground">Navigation coming soon...</p>
        </nav>
      </aside>
      <main className="flex-1">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}