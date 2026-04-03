import { auth } from "@/lib/auth/config";
import { redirects } from "@/lib/auth/redirects";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirects.login();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-2xl p-8">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-4">
            Bem-vindo, {session?.user?.name || "Usuário"}!
          </h1>
          
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h2 className="text-lg font-semibold mb-2">Sessão Ativa</h2>
              <p className="text-sm text-muted-foreground">
                Você está logado com sucesso!
              </p>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="text-sm font-medium mb-2">Dados da Sessão:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div className="flex gap-4">
              <a
                href="/api/auth/signout"
                className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                Sair
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}