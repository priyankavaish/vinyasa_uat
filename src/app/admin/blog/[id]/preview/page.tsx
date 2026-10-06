import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-server";
import { getDb, hasDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { PageHero } from "@/components/sections/hero";
import RichContent from "@/components/ui/rich-content";
export const dynamic = "force-dynamic";
export default async function PreviewBlog({ params }: { params: Promise<{ id: string }> }) {
  if (!await getSessionUser()) redirect("/admin/login");
  if (!hasDb()) notFound();
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) notFound();
  const [post] = await getDb().select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!post) notFound();
  return <div><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm">Saved {post.status} preview · visible only to admins</p><Link href={"/admin/blog/" + post.id} className="btn btn-outline">Back to editor</Link></div><PageHero eyebrow="Journal" title={post.title} description={post.excerpt || undefined} image={post.coverUrl || undefined} imageAlt={post.title} /><section className="mx-auto max-w-3xl px-5 py-14"><RichContent html={post.bodyHtml} /></section></div>;
}
