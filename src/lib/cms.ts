import { unstable_cache } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import * as t from "@/lib/db/schema";
import {
  cottages as SEED_COTTAGES,
  events as SEED_EVENTS,
  visitOptions as SEED_VISIT_OPTIONS,
  partners as SEED_PARTNERS,
  siteContentSeed as SEED_SITE_CONTENT,
  type Cottage,
  type EventProgram,
  type VisitOption,
  type Partner,
} from "@/lib/content";

export type Blog = {
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
  return {
    slug: r.slug,
    name: r.name,
    element: r.element,
    tagline: r.tagline,
    description: r.description,
    icon: r.icon,
    accent: r.accent,
    pricePerNight: r.pricePerNight,
    maxGuests: r.maxGuests,
    amenities: r.amenities ?? [],
    image: toWebPath(r.imageUrl) || "/seed/room-agni-1.jpg",
    gallery: (r.gallery ?? []).length
      ? r.gallery.map(toWebPath)
      : [toWebPath(r.imageUrl)].filter(Boolean),
    bodyHtml: r.bodyHtml || undefined,
    placeholder: false,
  };
}

function rowToEvent(r: t.EventRow): EventProgram {
  return {
    slug: r.slug,
    name: r.name,
    kind: (r.kind as EventProgram["kind"]) ?? "retreat",
    durationLabel: r.durationLabel,
    priceFrom: r.priceFrom,
    description: r.description,
    placeholder: false,
    dateLabel: r.dateLabel || undefined,
    facilitator: r.facilitator || undefined,
    image: toWebPath(r.imageUrl) || undefined,
    bodyHtml: r.bodyHtml || undefined,
  };
}

// --- cached getters (fall back to bundled seed content) ------------------

export const getCottages = unstable_cache(
  async (): Promise<Cottage[]> => {
    if (!hasDb()) return SEED_COTTAGES;
    try {
      const rows = await getDb()
        .select()
        .from(t.cottages)
        .where(eq(t.cottages.published, true))
        .orderBy(asc(t.cottages.sort));
      return rows.length ? rows.map(rowToCottage) : SEED_COTTAGES;
    } catch {
      return SEED_COTTAGES;
    }
  },
  ["cms:cottages"],
  { tags: ["cottages"] }
);

export async function getCottage(slug: string): Promise<Cottage | null> {
  const all = await getCottages();
  return all.find((c) => c.slug === slug) ?? null;
}

export const getEvents = unstable_cache(
  async (): Promise<EventProgram[]> => {
    if (!hasDb()) return SEED_EVENTS;
    try {
      const rows = await getDb()
        .select()
        .from(t.events)
        .where(eq(t.events.published, true))
        .orderBy(asc(t.events.sort));
      return rows.length ? rows.map(rowToEvent) : SEED_EVENTS;
    } catch {
      return SEED_EVENTS;
    }
  },
  ["cms:events"],
  { tags: ["events"] }
);

export async function getEvent(slug: string): Promise<EventProgram | null> {
  const all = await getEvents();
  return all.find((e) => e.slug === slug) ?? null;
}

export const getVisitOptions = unstable_cache(
  async (): Promise<VisitOption[]> => {
    if (!hasDb()) return SEED_VISIT_OPTIONS;
    try {
      const rows = await getDb().select().from(t.visitOptions).orderBy(asc(t.visitOptions.sort));
      return rows.length
        ? rows.map((r) => ({ title: r.title, description: r.description, image: r.imageUrl }))
        : SEED_VISIT_OPTIONS;
    } catch {
      return SEED_VISIT_OPTIONS;
    }
  },
  ["cms:visit-options"],
  { tags: ["visit-options"] }
);

export const getPartners = unstable_cache(
  async (): Promise<Partner[]> => {
    if (!hasDb()) return SEED_PARTNERS;
    try {
      const rows = await getDb().select().from(t.partners).orderBy(asc(t.partners.sort));
      return rows.length
        ? rows.map((r) => ({
            name: r.name,
            logo: r.logoUrl,
            description: r.description,
            link: r.link,
          }))
        : SEED_PARTNERS;
    } catch {
      return SEED_PARTNERS;
    }
  },
  ["cms:partners"],
  { tags: ["partners"] }
);

export const getPublishedBlogs = unstable_cache(
  async (): Promise<Blog[]> => {
    if (!hasDb()) return [];
    try {
      const rows = await getDb()
        .select()
        .from(t.blogs)
        .where(eq(t.blogs.status, "published"))
        .orderBy(desc(t.blogs.publishedAt));
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        coverUrl: r.coverUrl,
        bodyHtml: r.bodyHtml,
        publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      }));
    } catch {
      return [];
    }
  },
  ["cms:blogs"],
  { tags: ["blogs"] }
);

export async function getBlog(slug: string): Promise<Blog | null> {
  const all = await getPublishedBlogs();
  return all.find((b) => b.slug === slug) ?? null;
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
      return row ? (row.value as T) : fallback;
    } catch {
      return fallback;
    }
  },
  ["cms:content"],
  { tags: ["content"] }
);
