import { auth as middleware } from "@/lib/auth/config";

export default middleware;

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};