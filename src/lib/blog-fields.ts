import { z } from "zod";
export type BlogSettings = { category: string; tags: string; seoTitle: string; seoDescription: string; seoKeywords: string; aliases: string[] };
export const emptyBlogSettings: BlogSettings = { category: "", tags: "", seoTitle: "", seoDescription: "", seoKeywords: "", aliases: [] };
export function readBlogSettings(value: unknown): BlogSettings {
  if (!value || typeof value !== "object") return { ...emptyBlogSettings, aliases: [] };
  const input = value as Record<string, unknown>;
  return {
    ...Object.fromEntries(["category", "tags", "seoTitle", "seoDescription", "seoKeywords"].map(key => [key, typeof input[key] === "string" ? input[key] : ""])) as Omit<BlogSettings, "aliases">,
    aliases: Array.isArray(input.aliases) ? input.aliases.filter((slug): slug is string => typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) : [],
  };
}
export function blogSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/, "");
}
const imageUrl = z.string().trim().max(600).refine(value => {
  if (!value || /^\/(?!\/)[^\s\\]*$/.test(value)) return true;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}, "Use an uploaded image, a root-relative path or an http/https image URL.");
export const blogInputSchema = z.object({
  id: z.union([z.string().uuid(), z.literal("")]).default(""),
  slug: z.string().trim().max(80).default(""),
  title: z.string().trim().min(1, "Enter a post title.").max(200),
  excerpt: z.string().trim().max(500).default(""),
  coverUrl: imageUrl.default(""),
  bodyHtml: z.string().max(200000, "Post content is too long.").default(""),
  status: z.enum(["draft", "published"]),
  category: z.string().trim().max(80).default(""),
  tags: z.string().trim().max(600).default(""),
  seoTitle: z.string().trim().max(200).default(""),
  seoDescription: z.string().trim().max(500).default(""),
  seoKeywords: z.string().trim().max(1000).default(""),
});
export function blogKeywords(settings: BlogSettings): string[] | undefined {
  const words = (settings.seoKeywords || settings.tags).split(",").map(word => word.trim()).filter(Boolean);
  return words.length ? [...new Set(words)] : undefined;
}
