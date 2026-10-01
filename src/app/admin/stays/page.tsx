import SearchableTable from "@/components/admin/searchable-table";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { cottages, visitOptions as voT } from "@/lib/db/schema";
import { deleteCottage } from "@/lib/admin/actions";
import DeleteButton from "@/components/admin/delete-button";
import VisitOptionsEditor from "@/components/admin/visit-options-editor";


export const dynamic = "force-dynamic";

export default async function AdminStaysPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;

  const db = getDb();
  const [rows, vo] = await Promise.all([
    db.select().from(cottages).orderBy(asc(cottages.sort)),
    db.select().from(voT).orderBy(asc(voT.sort)),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl italic">Stays</h1>
          <Link href="/admin/stays/new" className="btn btn-accent">
            Add mudhouse
          </Link>
        </div>

        <SearchableTable label="stays" columns={6} emptyMessage="No mudhouses yet. Add a mudhouse to get started." header={<thead className="bg-[#f4efe6] text-xs uppercase tracking-[0.06em] text-foreground-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Element</th>
                <th className="px-4 py-3">Price / night</th>
                <th className="px-4 py-3">Sort</th>
                <th className="px-4 py-3">Live</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>} items={rows.map((c) => ({ id: c.id, search: [c.name, c.slug, c.element, c.published ? "published live yes" : "draft"].join(" "), content: (<tr key={c.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/stays/${c.id}`} className="text-accent underline">
                      {c.name}
                    </Link>
                    <div className="text-xs text-muted">/{c.slug}</div>
                  </td>
                  <td className="px-4 py-3">{c.element}</td>
                  <td className="px-4 py-3 tabular-nums">₹{c.pricePerNight.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 tabular-nums">{c.sort}</td>
                  <td className="px-4 py-3">{c.published ? "Yes" : "Draft"}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={c.id} action={deleteCottage} label="Delete mudhouse?" />
                  </td>
                </tr>) }))} />
      </div>

      <VisitOptionsEditor items={vo} />
      <div className="border border-line bg-white p-6"><h2 className="text-xl">Partner logos & stay page content</h2><p className="mt-2 text-sm text-foreground-soft">Edit partner names, logos, descriptions and gallery images in the website content editor.</p><Link href="/admin/content?section=app%2F(site)%2Fstays%2Fpage" className="btn btn-outline mt-4">Edit stays page content</Link></div>
    </div>
  );
}
