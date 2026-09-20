import SearchableTable from "@/components/admin/searchable-table";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { deleteEvent } from "@/lib/admin/actions";
import DeleteButton from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const rows = await getDb().select().from(events).orderBy(asc(events.sort));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl italic">Events &amp; Retreats</h1>
        <Link href="/admin/events/new" className="btn btn-accent">
          Add event
        </Link>
      </div>

      <SearchableTable label="events" columns={7} emptyMessage="No events yet." header={<thead className="bg-[#f4efe6] text-xs uppercase tracking-[0.06em] text-foreground-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Live</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>} items={rows.map((e) => ({ id: e.id, search: [e.name, e.slug, e.kind, e.dateLabel, e.published ? "published live yes" : "draft"].join(" "), content: (<tr key={e.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/events/${e.id}`} className="text-accent underline">
                    {e.name}
                  </Link>
                  <div className="text-xs text-muted">/{e.slug}</div>
                </td>
                <td className="px-4 py-3 capitalize">{e.kind}</td>
                <td className="px-4 py-3 text-xs">{e.dateLabel || "—"}</td>
                <td className="px-4 py-3 tabular-nums">
                  {e.priceFrom === 0 ? "Donation" : `₹${e.priceFrom.toLocaleString("en-IN")}`}
                </td>
                <td className="px-4 py-3 tabular-nums">{e.sort}</td>
                <td className="px-4 py-3">{e.published ? "Yes" : "Draft"}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton id={e.id} action={deleteEvent} label="Delete this event?" />
                </td>
              </tr>) }))} />
    </div>
  );
}
