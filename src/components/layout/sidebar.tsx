import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transações" },
  { href: "/budgets", label: "Orçamentos" },
  { href: "/categories", label: "Categorias" },
  { href: "/reports", label: "Relatórios" },
  { href: "/ai-chat", label: "Chat IA" },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold">DUD.IA</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              "transition-colors"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm font-medium",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            "transition-colors"
          )}
        >
          Configurações
        </Link>
      </div>
    </aside>
  );
}