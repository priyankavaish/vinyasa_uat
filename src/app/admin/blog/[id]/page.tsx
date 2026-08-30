import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import BlogForm from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const { id } = await params;
  const [row] = await getDb().select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!row) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl italic">Edit post</h1>
      <div className="mt-6">
        <BlogForm blog={row} />
      </div>
    </div>
  );
}
