"use server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSessionUser } from "@/lib/auth-server";
import { getDb } from "@/lib/db";
import { pages, siteContent } from "@/lib/db/schema";
import { ROUTING_KEY, nextPageSettings, readSettingsMap } from "./page-routing";
export async function savePageSettings(id: string, input: { title: string; path: string; menuLabel: string; menuHref: string }) {
  if (!await getSessionUser()) throw new Error("Unauthorized");
  const db = getDb();
  const [row] = await db.select().from(siteContent).where(eq(siteContent.key, ROUTING_KEY)).limit(1);
  const custom = await db.select({ slug: pages.slug }).from(pages);
  const map = readSettingsMap(row?.value);
  const settings = nextPageSettings(id, input, map, custom.map(p => "/" + p.slug));
  const value = { ...map, [id]: settings };
  const updatedAt = new Date();
  const saved = await db.insert(siteContent).values({ key: ROUTING_KEY, value, updatedAt }).onConflictDoUpdate({
    target: siteContent.key, set: { value, updatedAt },
    setWhere: row ? eq(siteContent.updatedAt, row.updatedAt) : sql`false`,
  }).returning({ key: siteContent.key });
  if (!saved.length) throw new Error("Another administrator changed page settings. Refresh and try again.");
  revalidateTag("page-routing");
  revalidateTag("content");
  revalidatePath("/", "layout");
  revalidatePath("/admin/pages");
  return settings;
}
