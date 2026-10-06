"use server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { getSessionUser } from "@/lib/auth-server";
import { getDb } from "@/lib/db";
import { blogs, siteContent } from "@/lib/db/schema";
import { blogInputSchema, blogSlug, readBlogSettings, type BlogSettings } from "./blog-fields";
async function requireAdmin() { if (!await getSessionUser()) throw new Error("Unauthorized"); }
function cleanBody(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "img", "span", "hr", "figure", "figcaption"],
    allowedAttributes: { "*": ["style", "class"], a: ["href", "title", "target", "rel", "data-btn", "data-variant"], img: ["src", "alt", "title"] },
    allowedSchemes: ["https", "http", "mailto", "tel"], allowProtocolRelative: false,
  });
}
function refreshBlogs() {
  revalidateTag("blogs"); revalidateTag("content");
  revalidatePath("/admin/blog"); revalidatePath("/blogs", "layout"); revalidatePath("/sitemap.xml");
}
export async function previewBlogPost(form: FormData) {
  await requireAdmin();
  const parsed = blogInputSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the post fields." };
  return { ok: true as const, title: parsed.data.title, excerpt: parsed.data.excerpt, coverUrl: parsed.data.coverUrl, html: cleanBody(parsed.data.bodyHtml) };
}
export async function saveBlogPost(form: FormData) {
  await requireAdmin();
  const parsed = blogInputSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the post fields." };
  const data = parsed.data;
  const slug = blogSlug(data.slug || data.title);
  if (!slug) return { ok: false as const, error: "Enter a URL slug using English letters, numbers or hyphens." };
  try {
    const db = getDb();
    const existing = data.id ? (await db.select().from(blogs).where(eq(blogs.id, data.id)).limit(1))[0] : undefined;
    if (data.id && !existing) return { ok: false as const, error: "This post no longer exists. Refresh the posts list." };
    const all = await db.select({ post: blogs, settings: siteContent.value }).from(blogs).leftJoin(siteContent, eq(siteContent.key, sql`'blog-settings:' || ${blogs.id}::text`));
    if (all.some(row => row.post.id !== data.id && (row.post.slug === slug || readBlogSettings(row.settings).aliases.includes(slug)))) return { ok: false as const, error: "Another post already uses this URL. Choose a different slug." };
    const previous = readBlogSettings(all.find(row => row.post.id === data.id)?.settings);
    const settings: BlogSettings = {
      category: data.category, tags: data.tags, seoTitle: data.seoTitle, seoDescription: data.seoDescription, seoKeywords: data.seoKeywords,
      aliases: [...new Set([...previous.aliases, ...(existing && existing.slug !== slug ? [existing.slug] : [])])].filter(old => old !== slug),
    };
    const id = data.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const publishedAt = data.status === "published" ? existing?.publishedAt?.toISOString() ?? now : null;
    // The post and its editor/SEO settings are saved atomically in one statement.
    await db.execute(sql`
      WITH saved AS (
        INSERT INTO blogs (id, slug, title, excerpt, cover_url, body_html, status, published_at, updated_at)
        VALUES (${id}::uuid, ${slug}, ${data.title}, ${data.excerpt}, ${data.coverUrl}, ${cleanBody(data.bodyHtml)}, ${data.status}, ${publishedAt}::timestamptz, ${now}::timestamptz)
        ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, title = EXCLUDED.title, excerpt = EXCLUDED.excerpt,
          cover_url = EXCLUDED.cover_url, body_html = EXCLUDED.body_html, status = EXCLUDED.status,
          published_at = EXCLUDED.published_at, updated_at = EXCLUDED.updated_at
        RETURNING id
      )
      INSERT INTO site_content (key, value, updated_at)
      SELECT 'blog-settings:' || id::text, ${JSON.stringify(settings)}::jsonb, ${now}::timestamptz FROM saved
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
    `);
    refreshBlogs();
    return { ok: true as const, id, slug, status: data.status, savedAt: now };
  } catch (error) {
    const code = (error as { code?: string; cause?: { code?: string } }).cause?.code ?? (error as { code?: string }).code;
    if (code === "23505") return { ok: false as const, error: "Another post already uses this URL. Choose a different slug." };
    console.error("Blog save failed", { code });
    return { ok: false as const, error: "Could not save the post. Your edits are still here; please retry." };
  }
}
export async function removeBlogPost(id: string) {
  await requireAdmin();
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error("Invalid post.");
  await getDb().execute(sql`
    WITH deleted AS (DELETE FROM blogs WHERE id = ${id}::uuid RETURNING id)
    DELETE FROM site_content USING deleted WHERE site_content.key = 'blog-settings:' || deleted.id::text
  `);
  refreshBlogs();
}
