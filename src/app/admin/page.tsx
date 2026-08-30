import Link from "next/link";
import { getDashboardStats } from "@/lib/db/queries";
import { listBookings, listLeads } from "@/lib/store";
import { hasDb } from "@/lib/db";

export const dynamic = "force-dynamic";

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none tabular-nums">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-foreground-soft">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  if (!hasDb()) {
    return (
      <div>
        <h1 className="font-display text-3xl italic">Dashboard</h1>
        <div className="mt-6 rounded-lg border border-dashed border-line bg-white p-8 text-sm text-foreground-soft">
          Database not configured. Set <code>DATABASE_URL</code> in <code>.env.local</code>, then run
          <code className="mx-1">npm run db:migrate</code> and <code className="mx-1">npm run db:seed</code>.
        </div>
      </div>
    );
  }

  const [stats, bookings, leads] = await Promise.all([
    getDashboardStats(),
    listBookings().catch(() => []),
    listLeads().catch(() => []),
  ]);

  const maxPath = Math.max(1, ...stats.topPaths.map((p) => p.count));
  const recentLeads = leads.slice(0, 6);
  const recentBookings = bookings.slice(0, 6);

  return (
    <div>
      <h1 className="font-display text-3xl italic">Dashboard</h1>
      <p className="mt-1 text-sm text-foreground-soft">Last 30 days unless noted.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visitors" value={stats.visitors30d} hint={`${stats.visitorsToday} today`} />
        <StatCard label="Page views" value={stats.pageViews30d} />
        <StatCard
          label="Bookings"
          value={stats.bookingsTotal}
          hint={`${stats.bookingsPaid} paid`}
        />
        <StatCard
          label="Abandoned"
          value={stats.bookingsAbandoned}
          hint="started, no payment (15m+)"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Contact form submissions
          </p>
          <p className="mt-2 font-display text-4xl tabular-nums">{stats.contactForms}</p>
          <div className="mt-4 space-y-1.5 text-xs text-foreground-soft">
            {stats.leadsBySource.map((s) => (
              <div key={s.source} className="flex justify-between capitalize">
                <span>{s.source}</span>
                <span className="tabular-nums">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Top pages</p>
          <div className="mt-3 space-y-2">
            {stats.topPaths.length === 0 && (
              <p className="text-xs text-foreground-soft">No page views recorded yet.</p>
            )}
            {stats.topPaths.map((p) => (
              <div key={p.path}>
                <div className="flex justify-between text-xs">
                  <span className="truncate">{p.path}</span>
                  <span className="tabular-nums text-foreground-soft">{p.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(p.count / maxPath) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Recent contact queries
            </p>
            <Link href="/admin/contact" className="text-xs text-accent underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-line text-sm">
            {recentLeads.length === 0 && (
              <li className="py-2 text-xs text-foreground-soft">Nothing yet.</li>
            )}
            {recentLeads.map((l) => (
              <li key={l.id} className="py-2">
                <div className="flex justify-between gap-3">
                  <span className="font-medium">{l.name}</span>
                  <span className="shrink-0 text-xs capitalize text-muted">{l.source}</span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-foreground-soft">
                  {l.message || l.email}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Recent bookings
            </p>
            <Link href="/admin/bookings" className="text-xs text-accent underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-line text-sm">
            {recentBookings.length === 0 && (
              <li className="py-2 text-xs text-foreground-soft">Nothing yet.</li>
            )}
            {recentBookings.map((b) => (
              <li key={b.id} className="flex justify-between gap-3 py-2">
                <span className="min-w-0">
                  <span className="font-medium">{b.guestName}</span>{" "}
                  <span className="text-xs text-foreground-soft">· {b.itemSlug}</span>
                </span>
                <span
                  className={`shrink-0 text-xs font-semibold ${
                    b.status === "paid"
                      ? "text-secondary"
                      : b.status === "failed"
                        ? "text-red-700"
                        : "text-accent"
                  }`}
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
