import "server-only";
import { eq, like } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";

export type StayBlock = { id: string; slug: string; from: string; to: string; reason?: string };
export const stayBlockKey = (id: string) => `stay-block:${id}`;

export async function listStayBlocks(): Promise<StayBlock[]> {
  if (!hasDb()) return [];
  const rows = await getDb().select().from(siteContent).where(like(siteContent.key, "stay-block:%"));
  return rows.map((row) => ({ id: row.key.slice("stay-block:".length), ...(row.value as Omit<StayBlock, "id">) }))
    .filter((b) => b.slug && b.from && b.to).sort((a, b) => a.from.localeCompare(b.from));
}

export async function addStayBlock(block: Omit<StayBlock, "id">) {
  await getDb().insert(siteContent).values({ key: stayBlockKey(crypto.randomUUID()), value: block });
}

export async function removeStayBlock(id: string) {
  await getDb().delete(siteContent).where(eq(siteContent.key, stayBlockKey(id)));
}

/** Slugs closed on at least one night of [checkIn, checkOut). Block dates are inclusive nights. */
export async function blockedSlugs(checkIn: string, checkOut: string) {
  return new Set((await listStayBlocks()).filter((b) => b.from < checkOut && b.to >= checkIn).map((b) => b.slug));
}
