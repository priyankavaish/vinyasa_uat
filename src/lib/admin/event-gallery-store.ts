import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eventGalleryKey, eventGallerySettings, type EventGallerySettings } from "@/lib/event-gallery";

export async function loadEventGallery(slug: string) {
  const [row] = await getDb().select({ value: siteContent.value }).from(siteContent).where(eq(siteContent.key, eventGalleryKey(slug))).limit(1);
  return eventGallerySettings(row?.value);
}
export async function storeEventGallery(slug: string, previousSlug: string | undefined, settings: EventGallerySettings | null) {
  const db = getDb();
  const previousKey = eventGalleryKey(previousSlug || slug);
  const key = eventGalleryKey(slug);
  const [existing] = await db.select().from(siteContent).where(eq(siteContent.key, previousKey)).limit(1);
  if (settings === null && !existing) return;
  const value = settings ?? eventGallerySettings(existing?.value);
  await db.insert(siteContent).values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
  if (previousKey !== key) await db.delete(siteContent).where(eq(siteContent.key, previousKey));
}
