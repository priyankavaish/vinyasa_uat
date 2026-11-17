import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eventRegistrationKey, eventRegistrationSettings, type EventRegistrationSettings } from "@/lib/event-registration";

export async function loadEventRegistration(slug: string) {
  const [row] = await getDb().select({ value: siteContent.value }).from(siteContent).where(eq(siteContent.key, eventRegistrationKey(slug))).limit(1);
  return eventRegistrationSettings(row?.value);
}
export async function storeEventRegistration(slug: string, previousSlug: string | undefined, settings: EventRegistrationSettings | null) {
  const db = getDb();
  const previousKey = eventRegistrationKey(previousSlug || slug);
  const key = eventRegistrationKey(slug);
  const [existing] = await db.select().from(siteContent).where(eq(siteContent.key, previousKey)).limit(1);
  if (settings === null && !existing) return;
  const value = settings ?? eventRegistrationSettings(existing?.value);
  await db.insert(siteContent).values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
  if (previousKey !== key) await db.delete(siteContent).where(eq(siteContent.key, previousKey));
}
