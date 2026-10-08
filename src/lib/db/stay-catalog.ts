import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { tentStay } from "@/lib/content";

// Introduce the bundled Tent once. The marker survives deletion so an admin's
// decision to remove or rename this stay is respected on subsequent requests.
export async function ensureManagedTent() {
 const tent = tentStay;
 await getDb().execute(sql`WITH initialized AS (
 INSERT INTO site_content (key, value) VALUES ('stay-catalog:managed-tent-v1', 'true'::jsonb)
 ON CONFLICT (key) DO NOTHING RETURNING key
 )
 INSERT INTO cottages (slug, name, element, tagline, description, icon, accent,
 price_per_night, max_guests, amenities, image_url, gallery, body_html, sort, published)
 SELECT ${tent.slug}, ${tent.name}, ${tent.element}, ${tent.tagline}, ${tent.description},
 ${tent.icon}, ${tent.accent}, ${tent.pricePerNight}, ${tent.maxGuests},
 ${JSON.stringify(tent.amenities)}::jsonb, ${tent.image},
 ${JSON.stringify(tent.gallery)}::jsonb, ${tent.bodyHtml || ""},
 COALESCE((SELECT sort + 1 FROM cottages WHERE slug = 'dorm'), (SELECT MAX(sort) + 1 FROM cottages), 0), true
 FROM initialized ON CONFLICT (slug) DO NOTHING`);
}
