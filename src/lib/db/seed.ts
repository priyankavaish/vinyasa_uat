import "./load-env";
import { getDb } from "./index";
import {
  cottages as cottagesT,
  events as eventsT,
  visitOptions as visitOptionsT,
  partners as partnersT,
  siteContent as siteContentT,
} from "./schema";
import { upsertAdmin } from "./users";
import {
  cottages as SEED_COTTAGES,
  events as SEED_EVENTS,
  visitOptions as SEED_VISIT_OPTIONS,
  partners as SEED_PARTNERS,
  siteContentSeed as SEED_SITE_CONTENT,
} from "../content";

const EVENT_IMAGES: Record<string, string> = {
  "artist-in-residence": "/seed/community-05.jpg",
  "anhad-ka-baaja": "/seed/community-02.jpg",
  "the-pause-within": "/seed/grounds-08.jpg",
  "artist-unite": "/seed/community-06.jpg",
  zariya: "/seed/community-01.jpg",
  "drishti-new-years-retreat": "/seed/grounds-05.jpg",
};

async function main() {
  const db = getDb();

  // --- admin user ---------------------------------------------------------
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (email && password) {
    await upsertAdmin(email, password);
    console.log(`✓ admin user ${email}`);
  } else {
    console.warn("! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipped admin user");
  }

  // --- cottages ---------------------------------------------------------
  for (const [i, c] of SEED_COTTAGES.entries()) {
    await db
      .insert(cottagesT)
      .values({
        slug: c.slug,
        name: c.name,
        element: c.element,
        tagline: c.tagline,
        description: c.description,
        icon: c.icon,
        accent: c.accent,
        pricePerNight: c.pricePerNight,
        maxGuests: c.maxGuests,
        amenities: c.amenities,
        imageUrl: c.image,
        gallery: c.gallery,
        sort: i,
        published: true,
      })
      .onConflictDoNothing({ target: cottagesT.slug });
  }
  console.log(`✓ ${SEED_COTTAGES.length} cottages`);

  // --- events ---------------------------------------------------------
  for (const [i, e] of SEED_EVENTS.entries()) {
    await db
      .insert(eventsT)
      .values({
        slug: e.slug,
        name: e.name,
        kind: e.kind,
        durationLabel: e.durationLabel,
        dateLabel: e.dateLabel ?? "",
        facilitator: e.facilitator ?? "",
        priceFrom: e.priceFrom,
        description: e.description,
        imageUrl: EVENT_IMAGES[e.slug] ?? "/seed/grounds-06.jpg",
        sort: i,
        published: true,
      })
      .onConflictDoNothing({ target: eventsT.slug });
  }
  console.log(`✓ ${SEED_EVENTS.length} events`);

  // --- visit options + partners (no natural key: only seed if empty) ----
  const existingVisit = await db.select({ id: visitOptionsT.id }).from(visitOptionsT);
  if (existingVisit.length === 0) {
    await db.insert(visitOptionsT).values(
      SEED_VISIT_OPTIONS.map((v, i) => ({
        title: v.title,
        description: v.description,
        imageUrl: v.image,
        sort: i,
      }))
    );
    console.log(`✓ ${SEED_VISIT_OPTIONS.length} visit options`);
  }

  const existingPartners = await db.select({ id: partnersT.id }).from(partnersT);
  if (existingPartners.length === 0) {
    await db.insert(partnersT).values(
      SEED_PARTNERS.map((p, i) => ({
        name: p.name,
        logoUrl: p.logo,
        description: p.description,
        link: p.link,
        sort: i,
      }))
    );
    console.log(`✓ ${SEED_PARTNERS.length} partners`);
  }

  // --- site content -----------------------------------------------------
  for (const [key, value] of Object.entries(SEED_SITE_CONTENT)) {
    await db
      .insert(siteContentT)
      .values({ key, value })
      .onConflictDoNothing({ target: siteContentT.key });
  }
  console.log(`✓ ${Object.keys(SEED_SITE_CONTENT).length} site-content keys`);

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
