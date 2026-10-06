"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";

async function assertAdmin() {
  const store = await cookies();
  const ok = await isValidSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!ok) throw new Error("Unauthorized");
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// isomorphic-dompurify drags in jsdom, which crashes at runtime on Vercel's
// serverless functions (jsdom's sync-XHR worker file isn't in the trace).
// sanitize-html is pure JS (htmlparser2), no DOM shim, and safe there.
async function cleanHtml(html: string) {
  const { default: sanitizeHtml } = await import("sanitize-html");
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li",
      "blockquote", "a", "img", "span", "hr", "figure", "figcaption",
    ],
    allowedAttributes: {
      "*": ["style", "class"],
      a: ["href", "title", "target", "rel", "data-btn", "data-variant"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
  });
}

const listStr = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

// --------------------------------------------------------------------------
// Cottages
// --------------------------------------------------------------------------

const cottageSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  element: z.string().max(60).default(""),
  tagline: z.string().max(160).default(""),
  description: z.string().max(2000).default(""),
  icon: z.string().max(40).default("home-outline"),
  accent: z.string().max(20).default("#8f3b31"),
  pricePerNight: z.coerce.number().int().min(0).max(10_000_000),
  maxGuests: z.coerce.number().int().min(1).max(50),
  imageUrl: z.string().max(600).default(""),
  sort: z.coerce.number().int().default(0),
  published: z.union([z.literal("on"), z.null()]).optional(),
});

export async function saveCottage(form: FormData) {
  await assertAdmin();
  const raw = Object.fromEntries(form);
  const data = cottageSchema.parse(raw);
  const db = getDb();

  const values = {
    slug: slugify(data.slug || data.name),
    name: data.name,
    element: data.element,
    tagline: data.tagline,
    description: data.description,
    icon: data.icon,
    accent: data.accent,
    pricePerNight: data.pricePerNight,
    maxGuests: data.maxGuests,
    amenities: listStr(form.get("amenities")),
    imageUrl: data.imageUrl,
    gallery: listStr(form.get("gallery")),
    bodyHtml: await cleanHtml(String(form.get("bodyHtml") ?? "")),
    sort: data.sort,
    published: form.get("published") === "on",
    updatedAt: new Date(),
  };

  if (data.id) {
    await db.update(t.cottages).set(values).where(eq(t.cottages.id, data.id));
  } else {
    await db.insert(t.cottages).values(values);
  }
  revalidateTag("cottages");
  revalidatePath("/stays");
  redirect("/admin/stays");
}

export async function deleteCottage(id: string) {
  await assertAdmin();
  await getDb().delete(t.cottages).where(eq(t.cottages.id, id));
  revalidateTag("cottages");
  revalidatePath("/stays");
}

// --------------------------------------------------------------------------
// Events
// --------------------------------------------------------------------------

const eventSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).max(80),
  name: z.string().min(1).max(160),
  kind: z.enum(["workshop", "retreat", "residency"]),
  durationLabel: z.string().max(120).default(""),
  dateLabel: z.string().max(120).default(""),
  facilitator: z.string().max(120).default(""),
  priceFrom: z.coerce.number().int().min(0).max(10_000_000),
  description: z.string().max(4000).default(""),
  imageUrl: z.string().max(600).default(""),
  sort: z.coerce.number().int().default(0),
});

export async function saveEvent(form: FormData) {
  await assertAdmin();
  const data = eventSchema.parse(Object.fromEntries(form));
  const db = getDb();
  const values = {
    slug: slugify(data.slug || data.name),
    name: data.name,
    kind: data.kind,
    durationLabel: data.durationLabel,
    dateLabel: data.dateLabel,
    facilitator: data.facilitator,
    priceFrom: data.priceFrom,
    description: data.description,
    imageUrl: data.imageUrl,
    bodyHtml: await cleanHtml(String(form.get("bodyHtml") ?? "")),
    sort: data.sort,
    published: form.get("published") === "on",
    updatedAt: new Date(),
  };
  if (data.id) {
    await db.update(t.events).set(values).where(eq(t.events.id, data.id));
  } else {
    await db.insert(t.events).values(values);
  }
  revalidateTag("events");
  revalidatePath("/events");
  revalidatePath(`/events/${values.slug}`);
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await assertAdmin();
  const db = getDb();
  const [event] = await db.select({ slug: t.events.slug }).from(t.events).where(eq(t.events.id, id)).limit(1);
  await db.delete(t.events).where(eq(t.events.id, id));
  revalidateTag("events");
  revalidatePath("/events");
  if (event?.slug) revalidatePath(`/events/${event.slug}`);
}

// --------------------------------------------------------------------------
// Blogs
// --------------------------------------------------------------------------

export async function saveBlog(form: FormData) {
  const { saveBlogPost } = await import("@/lib/blog-post-actions");
  const result = await saveBlogPost(form);
  if (!result.ok) throw new Error(result.error);
  redirect("/admin/blog");
}
export async function deleteBlog(id: string) {
  const { removeBlogPost } = await import("@/lib/blog-post-actions");
  await removeBlogPost(id);
}

// --------------------------------------------------------------------------
// // Site content (page copy)
// --------------------------------------------------------------------------

export async function saveContent(key: string, value: unknown) {
  await assertAdmin();
  const db = getDb();
  await db
    .insert(t.siteContent)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: t.siteContent.key, set: { value, updatedAt: new Date() } });
  revalidateTag("content");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
}

// --------------------------------------------------------------------------
// Visit options + partners (simple repeaters)
// --------------------------------------------------------------------------

export async function saveVisitOption(form: FormData) {
  await assertAdmin();
  const db = getDb();
  const id = String(form.get("id") ?? "");
  const values = {
    title: String(form.get("title") ?? "").slice(0, 160),
    description: String(form.get("description") ?? "").slice(0, 1000),
    imageUrl: String(form.get("imageUrl") ?? "").slice(0, 600),
    sort: Number(form.get("sort") ?? 0) || 0,
  };
  if (id) await db.update(t.visitOptions).set(values).where(eq(t.visitOptions.id, id));
  else await db.insert(t.visitOptions).values(values);
  revalidateTag("visit-options");
  revalidatePath("/stays");
}

export async function deleteVisitOption(id: string) {
  await assertAdmin();
  await getDb().delete(t.visitOptions).where(eq(t.visitOptions.id, id));
  revalidateTag("visit-options");
  revalidatePath("/stays");
}

export async function savePartner(form: FormData) {
  await assertAdmin();
  const db = getDb();
  const id = String(form.get("id") ?? "");
  const values = {
    name: String(form.get("name") ?? "").slice(0, 160),
    logoUrl: String(form.get("logoUrl") ?? "").slice(0, 600),
    description: String(form.get("description") ?? "").slice(0, 600),
    link: String(form.get("link") ?? "/contact").slice(0, 600),
    sort: Number(form.get("sort") ?? 0) || 0,
  };
  if (id) await db.update(t.partners).set(values).where(eq(t.partners.id, id));
  else await db.insert(t.partners).values(values);
  revalidateTag("partners");
  revalidatePath("/stays");
}

export async function deletePartner(id: string) {
  await assertAdmin();
  await getDb().delete(t.partners).where(eq(t.partners.id, id));
  revalidateTag("partners");
  revalidatePath("/stays");
}

// --------------------------------------------------------------------------
// Builder pages
// --------------------------------------------------------------------------

function stripDangerous(html: string) {
  return html
    .replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*script[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript\s*:/gi, "")
    .slice(0, 200_000);
}

export async function savePage(form: FormData) {
  await assertAdmin();
  const db = getDb();
  const { coerceBlocks } = await import("@/lib/blocks");

  const id = String(form.get("id") ?? "").trim();
  const title = String(form.get("title") ?? "").trim() || "Untitled page";
  const slug = slugify(String(form.get("slug") ?? "").trim() || title);
  const { getPageSettings } = await import("@/lib/page-routing-store");
  const { normalisePagePath, assertPathAvailable } = await import("@/lib/page-routing");
  assertPathAvailable(normalisePagePath("/" + slug), "custom-" + id, await getPageSettings());
  const status = String(form.get("status") ?? "draft") === "published" ? "published" : "draft";
  const layoutRaw = String(form.get("layout") ?? "boxed");
  const layout = ["boxed", "full", "narrow"].includes(layoutRaw) ? layoutRaw : "boxed";
  const seoTitle = String(form.get("seoTitle") ?? "").trim();
  const seoDescription = String(form.get("seoDescription") ?? "").trim();

  let parsed: unknown = [];
  try {
    parsed = JSON.parse(String(form.get("blocks") ?? "[]"));
  } catch {
    parsed = [];
  }
  const blocks = coerceBlocks(parsed).map((b) => {
    if (b.type === "rich-text" || b.type === "html") return { ...b, html: stripDangerous(b.html) };
    return b;
  });

  const values = { slug, title, status, layout, blocks, seoTitle, seoDescription, updatedAt: new Date() };

  if (id) {
    await db.update(t.pages).set(values).where(eq(t.pages.id, id));
  } else {
    await db.insert(t.pages).values(values);
  }

  revalidateTag("pages");
  revalidatePath("/", "layout");
  revalidatePath(`/${slug}`);
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await assertAdmin();
  await getDb().delete(t.pages).where(eq(t.pages.id, id));
  revalidateTag("pages");
  revalidatePath("/", "layout");
}
