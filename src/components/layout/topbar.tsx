import { auth, signIn, signOut } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";

export async function Topbar() {
  const session = await auth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <h2 className="text-lg font-semibold">DUD.IA Finance</h2>
      </div>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span className="text-sm text-muted-foreground">
              {session.user?.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <Button type="submit" size="sm">
              Entrar
            </Button>
          </form>
        )}
      </div>
    </header>
  );
}