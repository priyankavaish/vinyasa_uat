import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { events } from "@/lib/content";

// Add this separate residency once, including upgrading its original June seed.
// The marker preserves subsequent admin edits, unpublishing and deletion.
export async function ensureArtistResidencyEvent() {
  const event = events.find(event => event.slug === "artist-in-residence")!;
  await getDb().execute(sql`WITH initialized AS (
    INSERT INTO site_content (key, value) VALUES ('event-catalog:artist-residency-oct-2026-v1', 'true'::jsonb)
    ON CONFLICT (key) DO NOTHING RETURNING key
  )
  INSERT INTO events (slug, name, kind, duration_label, date_label, description, image_url, sort, published)
  SELECT ${event.slug}, ${event.name}, ${event.kind}, ${event.durationLabel}, ${event.dateLabel},
    ${event.description}, ${event.image || "/seed/community-05.jpg"},
    COALESCE((SELECT MIN(sort) - 1 FROM events), 0), true
  FROM initialized
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, date_label = EXCLUDED.date_label, duration_label = EXCLUDED.duration_label,
    description = EXCLUDED.description, sort = EXCLUDED.sort, published = true, updated_at = NOW()`);
}

// Initialise the new retreat once; subsequent admin edits and deletion remain intact.
export async function ensureMuseEvent() {
  const event = events.find(event => event.slug === "become-your-own-muse")!;
  await getDb().execute(sql`WITH initialized AS (
    INSERT INTO site_content (key, value) VALUES ('event-catalog:become-your-own-muse-v1', 'true'::jsonb)
    ON CONFLICT (key) DO NOTHING RETURNING key
  )
  INSERT INTO events (slug, name, kind, duration_label, date_label, description, image_url, price_from, facilitator, sort, published)
  SELECT ${event.slug}, ${event.name}, ${event.kind}, ${event.durationLabel}, ${event.dateLabel},
    ${event.description}, ${event.image}, ${event.priceFrom}, ${event.facilitator},
    COALESCE((SELECT sort FROM events WHERE slug = 'zariya' LIMIT 1), 0), true
  FROM initialized ON CONFLICT (slug) DO NOTHING`);
}
