import "server-only";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { hmac } from "@/lib/auth";
export const validPassword = (password: string) => password.length >= 8 && Buffer.byteLength(password, "utf8") <= 72;
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
function rows(result: unknown): unknown[] { return Array.isArray(result) ? result : (result as { rows?: unknown[] }).rows || []; }
export async function allowRecovery(key: string, limit: number, minutes: number) {
 const name = "recovery-rate:" + await hmac(key);
 const result = await getDb().execute(sql`INSERT INTO site_content (key,value) VALUES (${name},jsonb_build_object('count',1))
 ON CONFLICT (key) DO UPDATE SET value = jsonb_build_object('count',CASE WHEN site_content.updated_at < now() - ${minutes} * interval '1 minute' THEN 1 ELSE (site_content.value->>'count')::int + 1 END),
 updated_at = CASE WHEN site_content.updated_at < now() - ${minutes} * interval '1 minute' THEN now() ELSE site_content.updated_at END
 WHERE site_content.updated_at < now() - ${minutes} * interval '1 minute' OR (site_content.value->>'count')::int < ${limit} RETURNING key`);
 return rows(result).length > 0;
}
export async function issueReset(userId: string) {
 const token = randomBytes(32).toString("base64url"), tokenHash = hash(token);
 const value = JSON.stringify({ userId, expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() });
 await getDb().execute(sql`WITH token AS (INSERT INTO site_content (key,value) VALUES (${"password-reset:" + tokenHash}, ${value}::jsonb) RETURNING key)
 INSERT INTO site_content (key,value) SELECT ${"password-reset-user:" + userId},jsonb_build_object('tokenHash',${tokenHash}::text) FROM token
 ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`);
 return token;
}
export async function revokeReset(token: string) {
 await getDb().execute(sql`DELETE FROM site_content WHERE key=${"password-reset:" + hash(token)}`);
}
export async function resetPassword(token: string, password: string) {
 const tokenHash = hash(token);
 const passwordHash = await bcrypt.hash(password, 12);
 const result = await getDb().execute(sql`WITH claimed AS (
 DELETE FROM site_content t USING site_content p
 WHERE t.key=${"password-reset:" + tokenHash}
 AND p.key='password-reset-user:' || (t.value->>'userId')
 AND p.value->>'tokenHash'=${tokenHash}
 AND (t.value->>'expiresAt')::timestamptz > now()
 RETURNING t.value->>'userId' AS user_id),
 changed AS (UPDATE admin_users SET password_hash=${passwordHash} FROM claimed WHERE admin_users.id=claimed.user_id::uuid RETURNING admin_users.id),
 marked AS (INSERT INTO site_content (key,value) SELECT 'admin-password-changed:' || id::text,'true'::jsonb FROM changed ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now() RETURNING key)
 SELECT id FROM changed`);
 return rows(result).length > 0;
}
