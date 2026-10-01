import { listBookings } from "@/lib/store";
import { hasDb } from "@/lib/db";
import { getCottages, getAllEvents } from "@/lib/cms";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-secondary/20 text-secondary",
  pending: "bg-accent/15 text-accent",
  failed: "bg-red-100 text-red-700",
};

export default async function AdminBookingsPage() {
  if (!hasDb()) {
    return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  }

  const [bookings, cottages, events] = await Promise.all([
    listBookings(),
    getCottages(),
    getAllEvents(),
  ]);

  const nameFor = (type: string, slug: string) => {
    const list = type === "stay" ? cottages : events;
    return list.find((i) => i.slug === slug)?.name ?? slug;
  };

  return (
    <div>
      <h1 className="font-display text-3xl italic">Bookings</h1>
      <p className="mt-1 text-sm text-foreground-soft">{bookings.length} total.</p>

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-line bg-white p-10 text-center text-sm text-foreground-soft">
          No bookings yet.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#f4efe6] text-xs uppercase tracking-[0.06em] text-foreground-soft">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.guestName}</div>
                    <div className="text-xs text-muted">{b.guestEmail}</div>
                    <div className="text-xs text-muted">{b.guestPhone}</div>
                  </td>
                  <td className="px-4 py-3">{nameFor(b.type, b.itemSlug)}</td>
                  <td className="px-4 py-3 text-xs">
                    {b.type === "stay"
                      ? `${b.checkIn ?? "—"} → ${b.checkOut ?? "—"}`
                      : b.eventDate ?? "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{b.guests}</td>
                  <td className="px-4 py-3 tabular-nums">₹{b.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(b.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
