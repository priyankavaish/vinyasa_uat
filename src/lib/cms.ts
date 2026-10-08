import { ensureArtistResidencyEvent, ensureMuseEvent } from "@/lib/db/event-catalog";
import { ensureManagedTent } from "@/lib/db/stay-catalog";
import { getStayInventory } from "@/lib/stay-inventory";
import { mudhouseContent, mudhouseText } from "./mudhouse-wording";
import { unstable_cache, unstable_noStore } from "next/cache";
import { isEventActive } from "@/lib/event-dates";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import * as t from "@/lib/db/schema";
import {
  cottages as SEED_COTTAGES,
  legacyCottages,
  events as SEED_EVENTS,
  visitOptions as SEED_VISIT_OPTIONS,
  partners as SEED_PARTNERS,
  siteContentSeed as SEED_SITE_CONTENT,
  type Cottage,
  type EventProgram,
  type VisitOption,
  type Partner,
} from "@/lib/content";

import { readBlogSettings, type BlogSettings } from "./blog-fields";

export type Blog = BlogSettings & {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  bodyHtml: string;
  publishedAt: string | null;
};

// --- row -> public shape mappers -------------------------------------------

// Some legacy rows stored an absolute filesystem path (e.g. a pasted
// `C:\...\public\images\x.webp`). next/image only accepts an http(s) URL or a
// root-relative path, so normalise on the way out.
function toWebPath(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  if (/^(https?:|data:|blob:)/i.test(v)) return v;
  let p = v.replace(/^file:\/\/\/?/i, "").replace(/\\/g, "/");
  const pub = p.match(/(?:^|\/)public\/(.+)$/i);
  if (pub) p = pub[1];
  p = p.replace(/^[a-zA-Z]:\//, "");
  p = p.startsWith("/") ? p : `/${p}`;
  return p.replace(/^\/uploads\//, "/media/"); // legacy local-upload path
}

function rowToCottage(r: t.CottageRow): Cottage {
  const defaults = SEED_COTTAGES.find((c) => c.slug === r.slug);
  const legacy = legacyCottages.find((c) => c.slug === r.slug);
  const gallery = (r.gallery ?? []).map(toWebPath).filter(Boolean);
  // Upgrade untouched seed fields while preserving content edited in the CMS.
  const usesSeedGallery = !gallery.length || (
    !!legacy && JSON.stringify(gallery) === JSON.stringify(legacy.gallery)
  );
  return {
    slug: r.slug,
    name: mudhouseText(r.name),
    element: mudhouseText(r.element),
    tagline: mudhouseText(r.tagline),
    description: defaults && (!r.description || r.description === legacy?.description)
      ? defaults.description : mudhouseText(r.description),
    icon: r.icon,
    accent: r.accent,
    pricePerNight: r.pricePerNight,
    maxGuests: defaults && r.maxGuests === legacy?.maxGuests ? defaults.maxGuests : r.maxGuests,
    amenities: defaults && (!(r.amenities ?? []).length || JSON.stringify(r.amenities) === JSON.stringify(legacy?.amenities))
      ? defaults.amenities : mudhouseContent(r.amenities ?? []),
    image: toWebPath(r.imageUrl) || defaults?.image || "/seed/room-agni-1.jpg",
    gallery: usesSeedGallery && defaults ? defaults.gallery
      : gallery.length ? gallery : [toWebPath(r.imageUrl)].filter(Boolean),
    bodyHtml: mudhouseText(r.bodyHtml || "") || defaults?.bodyHtml || undefined,
    placeholder: false,
  };
}

function rowToEvent(r: t.EventRow): EventProgram {
  return {
    slug: r.slug,
    name: mudhouseText(r.name),
    kind: (r.kind as EventProgram["kind"]) ?? "retreat",
    durationLabel: r.durationLabel,
    priceFrom: r.priceFrom,
    description: mudhouseText(r.description),
    placeholder: false,
    dateLabel: r.dateLabel || undefined,
    facilitator: r.facilitator || undefined,
    image: toWebPath(r.imageUrl) || undefined,
    bodyHtml: mudhouseText(r.bodyHtml || "") || undefined,
  };
}

// --- cached getters (fall back to bundled seed content) ------------------

const getCottageCatalog = unstable_cache(
  async (): Promise<Cottage[]> => {
    if (!hasDb()) return SEED_COTTAGES;
    try {
      await ensureManagedTent();
      const rows = await getDb()
        .select()
        .from(t.cottages)
        .orderBy(asc(t.cottages.sort));
      const rooms = rows.filter((row) => row.published).map(rowToCottage);
      const tentIndex = rooms.findIndex((room) => room.slug === "tent");
      if (tentIndex !== -1) {
        const [tent] = rooms.splice(tentIndex, 1);
        const dormIndex = rooms.findIndex((room) => room.slug === "dorm");
        rooms.splice(dormIndex === -1 ? rooms.length : dormIndex + 1, 0, tent);
      }
      return rooms;
    } catch {
      return SEED_COTTAGES;
    }
  },
  ["cms:cottages:v6"],
  { tags: ["cottages"] }
);

export async function getCottages(): Promise<Cottage[]> {
  const [rooms, stock] = await Promise.all([getCottageCatalog(), getStayInventory()]);
  return rooms.map((room) => ({ ...room, quantity: stock[room.slug] ?? null }));
}

export async function getCottage(slug: string): Promise<Cottage | null> {
  const all = await getCottages();
  return all.find((c) => c.slug === slug) ?? null;
}

export const getAllEvents = unstable_cache(
  async (): Promise<EventProgram[]> => {
    if (!hasDb()) return SEED_EVENTS;
    try {
      await ensureArtistResidencyEvent();
      await ensureMuseEvent();
      const rows = await getDb()
        .select()
        .from(t.events)
        .where(eq(t.events.published, true))
        .orderBy(asc(t.events.sort));
      return rows.map(rowToEvent);
    } catch {
      return SEED_EVENTS;
    }
  },
  ["cms:events:v5"],
  { tags: ["events"] }
);

// Evaluate expiry on every request, outside the cached CMS data.
export async function getEvents(): Promise<EventProgram[]> {
  unstable_noStore();
  const events = await getAllEvents();
  const now = new Date();
  return events.filter((event) => isEventActive(event.dateLabel, now));
}

export async function getEvent(slug: string): Promise<EventProgram | null> {
  const all = await getEvents();
  return all.find((e) => e.slug === slug) ?? null;
}

export const getVisitOptions = unstable_cache(
  async (): Promise<VisitOption[]> => {
    if (!hasDb()) return SEED_VISIT_OPTIONS;
    try {
      const rows = await getDb().select().from(t.visitOptions).orderBy(asc(t.visitOptions.sort));
      return rows.map((r) => ({ title: mudhouseText(r.title), description: mudhouseText(r.description), image: toWebPath(r.imageUrl) }));
    } catch {
      return SEED_VISIT_OPTIONS;
    }
  },
  ["cms:visit-options:v3"],
  { tags: ["visit-options"] }
);

export const getPartners = unstable_cache(
  async (): Promise<Partner[]> => {
    if (!hasDb()) return SEED_PARTNERS;
    try {
      const rows = await getDb().select().from(t.partners).orderBy(asc(t.partners.sort));
      return rows.length
        ? rows.map((r) => ({
            name: mudhouseText(r.name),
            logo: r.logoUrl,
            description: mudhouseText(r.description),
            link: r.link,
          }))
        : SEED_PARTNERS;
    } catch {
      return SEED_PARTNERS;
    }
  },
  ["cms:partners:mudhouse-v1"],
  { tags: ["partners"] }
);

export const getPublishedBlogs = unstable_cache(
  async (): Promise<Blog[]> => {
    if (!hasDb()) return [];
    try {
      const rows = await getDb()
        .select({ post: t.blogs, settings: t.siteContent.value })
        .from(t.blogs)
        .leftJoin(t.siteContent, eq(t.siteContent.key, sql`'blog-settings:' || ${t.blogs.id}::text`))
        .where(eq(t.blogs.status, "published"))
        .orderBy(desc(t.blogs.publishedAt));
      return rows.map(({ post: r, settings }) => ({
        ...readBlogSettings(settings),
        slug: r.slug,
        title: mudhouseText(r.title),
        excerpt: mudhouseText(r.excerpt),
        coverUrl: r.coverUrl,
        bodyHtml: mudhouseText(r.bodyHtml),
        publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      }));
    } catch {
      return [];
    }
  },
  ["cms:blogs:mudhouse-v2"],
  { tags: ["blogs"] }
);

export async function getBlog(slug: string): Promise<Blog | null> {
  const all = await getPublishedBlogs();
  return all.find((b) => b.slug === slug || b.aliases.includes(slug)) ?? null;
}

export const getContent = unstable_cache(
  async <T = unknown>(key: string): Promise<T | null> => {
    const fallback = (SEED_SITE_CONTENT[key] as T) ?? null;
    if (!hasDb()) return fallback;
    try {
      const [row] = await getDb()
        .select()
        .from(t.siteContent)
        .where(eq(t.siteContent.key, key))
        .limit(1);
      return row ? mudhouseContent(row.value as T) : fallback;
    } catch {
      return fallback;
    }
  },
  ["cms:content:mudhouse-v1"],
  { tags: ["content"] }
);

// --- builder pages ------------------------------------------------------

export type BuilderPage = {
  id: string;
  slug: string;
  title: string;
  layout: string;
  status?: "draft" | "published";
  blocks: unknown[];
  seoTitle: string;
  seoDescription: string;
};

export const getBuilderPages = unstable_cache(
  async (): Promise<BuilderPage[]> => {
    if (!hasDb()) return [];
    try {
      const rows = await getDb().select().from(t.pages).orderBy(desc(t.pages.updatedAt));
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: mudhouseText(r.title),
        layout: r.layout,
        status: r.status === "published" ? "published" : "draft",
        blocks: mudhouseContent((r.blocks ?? []) as unknown[]),
        seoTitle: mudhouseText(r.seoTitle),
        seoDescription: mudhouseText(r.seoDescription),
      }));
    } catch {
      return [];
    }
  },
  ["cms:pages:mudhouse-v1"],
  { tags: ["pages"] },
);

/** A single published page by slug (null if missing or still a draft). */
export const getPublishedPage = unstable_cache(
  async (slug: string): Promise<BuilderPage | null> => {
    if (!hasDb()) return null;
    try {
      const [r] = await getDb()
        .select()
        .from(t.pages)
        .where(and(eq(t.pages.slug, slug), eq(t.pages.status, "published")))
        .limit(1);
      if (!r) return null;
      return {
        id: r.id,
        slug: r.slug,
        title: mudhouseText(r.title),
        layout: r.layout,
        status: r.status === "published" ? "published" : "draft",
        blocks: mudhouseContent((r.blocks ?? []) as unknown[]),
        seoTitle: mudhouseText(r.seoTitle),
        seoDescription: mudhouseText(r.seoDescription),
      };
    } catch {
      return null;
    }
  },
  ["cms:page:mudhouse-v1"],
  { tags: ["pages"] },
);
