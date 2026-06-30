import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/lib/session-edge";

// ─── Route definitions ────────────────────────────────────────────────────

const AUTH_ROUTES = ["/login", "/register"]; // redirect away if already logged in
const PROTECTED_ADMIN = "/admin";
const PROTECTED_SUB_USER = "/sub-user";

// ─── Middleware ───────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);
  const isAuthenticated = !!session;

  // 1. Already logged-in users should not see auth pages
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const role = session?.role;
    const redirectPath = role === "user" ? PROTECTED_SUB_USER : PROTECTED_ADMIN;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 2. Unauthenticated users cannot access admin dashboard
  if (!isAuthenticated && pathname.startsWith(PROTECTED_ADMIN)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Unauthenticated users cannot access sub-user dashboard
  if (!isAuthenticated && pathname.startsWith(PROTECTED_SUB_USER)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Refresh the session on each dashboard request to extend expiry
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
