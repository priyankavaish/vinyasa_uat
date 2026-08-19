import { listBookings, listLeads } from "@/lib/store";
import AdminLogoutButton from "@/components/admin-logout-button";
import { cottages, events } from "@/lib/content";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-secondary/20 text-secondary",
  pending: "bg-accent/15 text-accent",
  failed: "bg-red-100 text-red-700",
};

function itemName(type: "stay" | "event", slug: string): string {
  const list = type === "stay" ? cottages : events;
  return list.find((i) => i.slug === slug)?.name ?? slug;
}

export default async function AdminBookingsPage() {
  const [bookings, leads] = await Promise.all([listBookings(), listLeads()]);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-28 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display italic text-3xl">Bookings &amp; Leads</h1>
          <p className="mt-1 text-sm text-foreground-soft">Demo admin dashboard: {bookings.length} bookings, {leads.length} leads.</p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="mt-10">
        <h2 className="font-display italic text-xl">Bookings</h2>
        {bookings.length === 0 ? (
          <div className="mt-4 border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-sm text-foreground-soft">
              No bookings yet. Complete a booking from the site to see it appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface text-xs tracking-[0.06em] uppercase text-foreground-soft">
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
                      <div>{b.guestName}</div>
                      <div className="text-xs text-muted">{b.guestEmail}</div>
                    </td>
                    <td className="px-4 py-3">{itemName(b.type, b.itemSlug)}</td>
                    <td className="px-4 py-3 text-xs">
                      {b.type === "stay" ? `${b.checkIn ?? "N/A"} to ${b.checkOut ?? "N/A"}` : b.eventDate ?? "N/A"}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{b.guests}</td>
                    <td className="px-4 py-3 tabular-nums">₹{b.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{new Date(b.createdAt).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-14">
        <h2 className="font-display italic text-xl">Leads</h2>
        {leads.length === 0 ? (
          <div className="mt-4 border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-sm text-foreground-soft">
              No leads yet. Submit the contact or corporate form to see it appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-surface text-xs tracking-[0.06em] uppercase text-foreground-soft">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-line align-top">
                    <td className="px-4 py-3">{l.name}</td>
                    <td className="px-4 py-3 capitalize">{l.source}</td>
                    <td className="px-4 py-3 text-xs">
                      <div>{l.email}</div>
                      {l.phone && <div className="text-muted">{l.phone}</div>}
                    </td>
                    <td className="px-4 py-3 max-w-[28ch] whitespace-pre-wrap text-xs text-foreground-soft">
                      {l.message || "No message"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{new Date(l.createdAt).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
