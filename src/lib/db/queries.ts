import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { getDb, hasDb } from "./index";
import { bookings, leads, pageViews } from "./schema";

export type DashboardStats = {
  configured: boolean;
  visitors30d: number;
  visitorsToday: number;
  pageViews30d: number;
  topPaths: { path: string; count: number }[];
  bookingsTotal: number;
  bookingsPaid: number;
  bookingsAbandoned: number;
  contactForms: number;
  leadsBySource: { source: string; count: number }[];
};

const EMPTY: DashboardStats = {
  configured: false,
  visitors30d: 0,
  visitorsToday: 0,
  pageViews30d: 0,
  topPaths: [],
  bookingsTotal: 0,
  bookingsPaid: 0,
  bookingsAbandoned: 0,
  contactForms: 0,
  leadsBySource: [],
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasDb()) return EMPTY;
  const db = getDb();

  const now = Date.now();
  const d30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const abandonedCutoff = new Date(now - 15 * 60 * 1000);

  const [
    v30,
    vToday,
    pv30,
    paths,
    bTotal,
    bPaid,
    bAband,
    contact,
    bySource,
  ] = await Promise.all([
    db
      .select({ n: sql<number>`count(distinct ${pageViews.ipHash})::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, d30)),
    db
      .select({ n: sql<number>`count(distinct ${pageViews.ipHash})::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startOfToday)),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, d30)),
    db
      .select({ path: pageViews.path, count: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, d30))
      .groupBy(pageViews.path)
      .orderBy(desc(sql`count(*)`))
      .limit(8),
    db.select({ n: sql<number>`count(*)::int` }).from(bookings),
    db.select({ n: sql<number>`count(*)::int` }).from(bookings).where(eq(bookings.status, "paid")),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(bookings)
      .where(
        and(inArray(bookings.status, ["pending", "failed"]), lt(bookings.createdAt, abandonedCutoff))
      ),
    db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.source, "contact")),
    db
      .select({ source: leads.source, count: sql<number>`count(*)::int` })
      .from(leads)
      .groupBy(leads.source),
  ]);

  return {
    configured: true,
    visitors30d: v30[0]?.n ?? 0,
    visitorsToday: vToday[0]?.n ?? 0,
    pageViews30d: pv30[0]?.n ?? 0,
    topPaths: paths.map((p) => ({ path: p.path, count: p.count })),
    bookingsTotal: bTotal[0]?.n ?? 0,
    bookingsPaid: bPaid[0]?.n ?? 0,
    bookingsAbandoned: bAband[0]?.n ?? 0,
    contactForms: contact[0]?.n ?? 0,
    leadsBySource: bySource.map((r) => ({ source: r.source, count: r.count })),
  };
}
