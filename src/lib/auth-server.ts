import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";

/** For server components / layouts: the signed-in admin's email, or null.
 *  Split out of auth.ts so the middleware (Edge) never imports next/headers. */
export async function getSessionUser(): Promise<{ email: string } | null> {
  const store = await cookies();
  const payload = await readSessionToken(store.get(SESSION_COOKIE)?.value);
  return payload ? { email: payload.email } : null;
}
