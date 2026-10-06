import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-server";
import { getDb, hasDb } from "@/lib/db";
import { blogs, siteContent } from "@/lib/db/schema";
import { readBlogSettings } from "@/lib/blog-fields";
import BlogsManager from "@/components/admin/blogs-manager";
export const dynamic = "force-dynamic";
export default async function AdminBlogPage() {
  if (!await getSessionUser()) redirect("/admin/login");
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const rows = await getDb().select({ post: blogs, settings: siteContent.value }).from(blogs).leftJoin(siteContent, eq(siteContent.key, sql`'blog-settings:' || ${blogs.id}::text`)).orderBy(desc(blogs.updatedAt));
  return <BlogsManager posts={rows.map(({ post, settings }) => ({ id: post.id, title: post.title, slug: post.slug, status: post.status, updatedAt: post.updatedAt.toISOString(), category: readBlogSettings(settings).category, tags: readBlogSettings(settings).tags }))} />;
}
