"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { cookies } from "next/headers";
import DOMPurify from "isomorphic-dompurify";
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

function cleanHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li",
      "blockquote", "a", "img", "span", "hr", "figure", "figcaption",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "style", "class", "data-btn", "data-variant"],
    ALLOWED_URI_REGEXP: /^(https?:|mailto:|tel:|\/|#)/i,
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
    bodyHtml: cleanHtml(String(form.get("bodyHtml") ?? "")),
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
    bodyHtml: cleanHtml(String(form.get("bodyHtml") ?? "")),
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
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await assertAdmin();
  await getDb().delete(t.events).where(eq(t.events.id, id));
  revalidateTag("events");
  revalidatePath("/events");
}

// --------------------------------------------------------------------------
// Blogs
// --------------------------------------------------------------------------

const blogSchema = z.object({
  id: z.string().optional(),
  slug: z.string().max(80).default(""),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).default(""),
  coverUrl: z.string().max(600).default(""),
  status: z.enum(["draft", "published"]),
});

export async function saveBlog(form: FormData) {
  await assertAdmin();
  const data = blogSchema.parse(Object.fromEntries(form));
  const db = getDb();
  const slug = slugify(data.slug || data.title);
  const bodyHtml = cleanHtml(String(form.get("bodyHtml") ?? ""));
  const now = new Date();

  if (data.id) {
    const [existing] = await db.select().from(t.blogs).where(eq(t.blogs.id, data.id)).limit(1);
    await db
      .update(t.blogs)
      .set({
        slug,
        title: data.title,
        excerpt: data.excerpt,
        coverUrl: data.coverUrl,
        bodyHtml,
        status: data.status,
        publishedAt:
          data.status === "published"
            ? (existing?.publishedAt ?? now)
            : null,
        updatedAt: now,
      })
      .where(eq(t.blogs.id, data.id));
  } else {
    await db.insert(t.blogs).values({
      slug,
      title: data.title,
      excerpt: data.excerpt,
      coverUrl: data.coverUrl,
      bodyHtml,
      status: data.status,
      publishedAt: data.status === "published" ? now : null,
    });
  }
  revalidateTag("blogs");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlog(id: string) {
  await assertAdmin();
  await getDb().delete(t.blogs).where(eq(t.blogs.id, id));
  revalidateTag("blogs");
  revalidatePath("/blog");
}

// --------------------------------------------------------------------------
// Site content (page copy)
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
