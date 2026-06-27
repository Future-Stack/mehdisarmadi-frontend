/**
 * Edge-compatible session helpers (no "use server" directive).
 * Safe to import from Next.js Middleware, which runs on the Edge Runtime.
 */
import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "@/types";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "fallback-secret-change-me";
const encodedKey = new TextEncoder().encode(SESSION_SECRET);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
