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

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f4efe6] text-xs uppercase tracking-[0.06em] text-foreground-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Live</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-line">
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
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-foreground-soft">
                  No events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
