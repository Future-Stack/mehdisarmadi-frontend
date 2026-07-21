import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

/**
 * GET /api/auth/signout
 *
 * Called client-side when a 401 Unauthorized is received from the backend.
 * Deletes the httpOnly session cookie server-side and redirects to /login.
 */
export async function GET(request: Request) {
  await deleteSession();

  const url = new URL(request.url);
  const reason = url.searchParams.get("reason") ?? "session_expired";

  const loginUrl = new URL("/login", url.origin);
  loginUrl.searchParams.set("reason", reason);

  return NextResponse.redirect(loginUrl);
}
