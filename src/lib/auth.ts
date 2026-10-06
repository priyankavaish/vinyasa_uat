import { NextRequest, NextResponse } from "next/server";

// Shared by Node API routes and Node middleware.

export const SESSION_COOKIE = "vinyasa_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set. Add it to .env.local.");
  return s;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(sig);
}

/** HMAC-SHA256 of an arbitrary value, hex. Also used to hash visitor IPs
 *  for analytics so raw addresses are never stored. */
export async function hmac(value: string): Promise<string> {
  return hmacHex(value);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

type SessionPayload = { email: string; expires: number };

export async function createSessionToken(email: string): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const { findAdminByEmail } = await import("@/lib/db/users");
  const user = await findAdminByEmail(email);
  if (!user) throw new Error("Admin account does not exist.");
  const payload = `${expires}~${encodeURIComponent(user.email)}~${await hmacHex(user.passwordHash)}`;
  return `${payload}.${await hmacHex(payload)}`;
}

export async function readSessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = await hmacHex(payload);
  if (!timingSafeEqualHex(expected, signature)) return null;
  const [expStr, emailEnc, fingerprint] = payload.split("~");
  const expires = Number(expStr);
  if (!Number.isFinite(expires) || Date.now() >= expires) return null;
  try {
    const email = decodeURIComponent(emailEnc ?? "");
    const { findAdminByEmail } = await import("@/lib/db/users");
    const user = await findAdminByEmail(email);
    if (!user) return null;
    if (fingerprint) {
      if (!timingSafeEqualHex(fingerprint, await hmacHex(user.passwordHash))) return null;
    } else {
      const { getDb } = await import("@/lib/db");
      const { siteContent } = await import("@/lib/db/schema");
      const { eq } = await import("drizzle-orm");
      const changed = await getDb().select({key:siteContent.key}).from(siteContent).where(eq(siteContent.key,"admin-password-changed:"+user.id)).limit(1);
      if (changed.length) return null;
    }
    return {email:user.email,expires};
  } catch { return null; }
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  return (await readSessionToken(token)) !== null;
}

export type { SessionPayload };

/** Returns a 401 NextResponse if the request lacks a valid admin session, else null. */
export async function requireAdminSession(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}
