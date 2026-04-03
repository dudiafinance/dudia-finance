import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect API routes (except auth and webhooks)
  if (
    request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/api/auth") &&
    !request.nextUrl.pathname.startsWith("/api/webhooks")
  ) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};