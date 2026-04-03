export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao DUD.IA Finance
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Saldo</h3>
          <p className="text-2xl font-bold">R$ 0,00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">R$ 0,00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Economia</h3>
          <p className="text-2xl font-bold text-blue-600">R$ 0,00</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Transações Recentes</h3>
        <p className="text-muted-foreground">Nenhuma transação ainda...</p>
      </div>
    </div>
  );
}