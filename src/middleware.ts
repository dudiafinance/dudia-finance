import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware simples que redireciona para login se não autenticado
// A proteção real é feita pelo NextAuth automaticamente
export function middleware(request: NextRequest) {
  // Verifica se há um token de sessão (cookie do NextAuth)
  const sessionToken = request.cookies.get("next-auth.session-token") || 
                       request.cookies.get("__Secure-next-auth.session-token");

  // Rotas que precisam de autenticação
  const protectedPaths = ["/dashboard", "/transactions", "/categories", "/budgets"];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Rotas de API que precisam de autenticação (exceto auth e webhooks)
  const isProtectedApi = 
    request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/api/auth") &&
    !request.nextUrl.pathname.startsWith("/api/webhooks");

  if ((isProtectedPath || isProtectedApi) && !sessionToken) {
    // Redireciona para login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/transactions/:path*", "/categories/:path*", "/budgets/:path*", "/api/:path*"],
};