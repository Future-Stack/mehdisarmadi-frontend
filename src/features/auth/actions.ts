"use server";

import { createSession, deleteSession } from "@/lib/session";
import type { UserRole } from "@/types";

/**
 * Server action to bridge the client-side mock login to the actual session cookie.
 * This is required so the Middleware (proxy.ts) can see the user is "logged in".
 */
export async function handleLoginAction(userId: string, role: UserRole) {
  await createSession(userId, role);
}

export async function handleLogoutAction() {
  await deleteSession();
}
