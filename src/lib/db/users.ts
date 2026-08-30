import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./index";
import { adminUsers } from "./schema";

export async function findAdminByEmail(email: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .limit(1);
  return row ?? null;
}

export async function verifyAdmin(email: string, password: string) {
  const user = await findAdminByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function setAdminPassword(email: string, newPassword: string) {
  const db = getDb();
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db
    .update(adminUsers)
    .set({ passwordHash })
    .where(eq(adminUsers.email, email.toLowerCase().trim()));
}

export async function upsertAdmin(email: string, password: string) {
  const db = getDb();
  const passwordHash = await bcrypt.hash(password, 10);
  const e = email.toLowerCase().trim();
  const existing = await findAdminByEmail(e);
  if (existing) {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.email, e));
    return existing;
  }
  const [row] = await db.insert(adminUsers).values({ email: e, passwordHash }).returning();
  return row;
}

export async function countAdmins(): Promise<number> {
  const db = getDb();
  const rows = await db.select({ id: adminUsers.id }).from(adminUsers);
  return rows.length;
}
