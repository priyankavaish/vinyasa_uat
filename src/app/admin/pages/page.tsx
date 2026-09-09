import Link from "next/link";
import { hasDb } from "@/lib/db";
import { getBuilderPages } from "@/lib/cms";
import DeleteButton from "@/components/admin/delete-button";
import { deletePage } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;

  const pages = await getBuilderPages();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl italic">Pages</h1>
          <p className="mt-1 text-sm text-foreground-soft">
            Build standalone pages from blocks. They live at <code>/your-slug</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/pages/copy"
            className="border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] hover:bg-line/40"
          >
            Edit site copy
          </Link>
          <Link
            href="/admin/pages/new"
            className="bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-accent-ink"
          >
            New page
          </Link>
        </div>
      </div>

      <div className="mt-6 divide-y divide-line border border-line">
        {pages.length === 0 && (
          <p className="p-4 text-sm text-foreground-soft">No pages yet.</p>
        )}
        {pages.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.title}</p>
              <p className="truncate text-xs text-foreground-soft">/{p.slug}</p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-soft">
              {p.blocks.length} block{p.blocks.length === 1 ? "" : "s"}
            </span>
            <Link
              href={`/admin/pages/${p.id}`}
              className="border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:bg-line/40"
            >
              Edit
            </Link>
            <DeleteButton id={p.id} action={deletePage} />
          </div>
        ))}
      </div>
    </div>
  );
}
