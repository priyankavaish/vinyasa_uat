import SearchableTable from "@/components/admin/searchable-table";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { deleteBlog } from "@/lib/admin/actions";
import DeleteButton from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const rows = await getDb().select().from(blogs).orderBy(desc(blogs.updatedAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl italic">Blog</h1>
        <Link href="/admin/blog/new" className="btn btn-accent">
          New post
        </Link>
      </div>

      <SearchableTable label="blogs" columns={4} emptyMessage="No posts yet." header={<thead className="bg-[#f4efe6] text-xs uppercase tracking-[0.06em] text-foreground-soft">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>} items={rows.map((b) => ({ id: b.id, search: [b.title, b.slug, b.status].join(" "), content: (<tr key={b.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/blog/${b.id}`} className="text-accent underline">
                    {b.title}
                  </Link>
                  <div className="text-xs text-muted">/blog/{b.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      b.status === "published"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(b.updatedAt).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton id={b.id} action={deleteBlog} label="Delete this post?" />
                </td>
              </tr>) }))} />
    </div>
  );
}
