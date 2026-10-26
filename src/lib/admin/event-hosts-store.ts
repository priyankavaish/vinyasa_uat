import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eventHostsKey, eventHostSettings, type EventHost, type EventHostHeading } from "@/lib/event-hosts";
import { legacyEventHosts } from "@/lib/event-hosts-legacy";

export async function loadEventHosts(slug: string, details?: unknown) {
  const [row] = await getDb().select().from(siteContent).where(eq(siteContent.key, eventHostsKey(slug))).limit(1);
  return eventHostSettings(row?.value, legacyEventHosts(details));
}

export async function storeEventHosts(slug: string, previousSlug: string | undefined, hosts: EventHost[] | null, heading: EventHostHeading | null = null) {
  const db = getDb();
  const oldKey = eventHostsKey(previousSlug || slug);
  const key = eventHostsKey(slug);
  const [existing] = await db.select().from(siteContent).where(eq(siteContent.key, oldKey)).limit(1);
  if (hosts === null && !existing && heading === null) return;
  const previous = eventHostSettings(existing?.value);
  const value = { hosts: hosts ?? previous.hosts, heading: heading ?? previous.heading };
  await db.insert(siteContent).values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
  if (oldKey !== key) await db.delete(siteContent).where(eq(siteContent.key, oldKey));
}
