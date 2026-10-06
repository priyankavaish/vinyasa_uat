import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-server";
import { getDb, hasDb } from "@/lib/db";
import { blogs, siteContent } from "@/lib/db/schema";
import { readBlogSettings } from "@/lib/blog-fields";
import BlogForm from "@/components/admin/blog-form";
export const dynamic = "force-dynamic";
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  if (!await getSessionUser()) redirect("/admin/login");
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) notFound();
  const db = getDb();
  const [row] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!row) notFound();
  const [settings] = await db.select({ value: siteContent.value }).from(siteContent).where(eq(siteContent.key, "blog-settings:" + id)).limit(1);
  return <div className="pt-8 lg:pt-0"><h1 className="text-3xl font-semibold">Edit post</h1><BlogForm blog={row} settings={readBlogSettings(settings?.value)} /></div>;
}
