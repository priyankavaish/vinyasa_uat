import { asc } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { cottages } from "@/lib/db/schema";
import { ensureManagedTent } from "@/lib/db/stay-catalog";
import { nightlyAvailability } from "@/lib/stay-availability";
import { listStayBlocks } from "@/lib/stay-blocks";
import AvailabilityCalendar from "@/components/admin/availability-calendar";
import { StayBlockManager } from "@/components/admin/offers-manager";

export const dynamic = "force-dynamic";
const MONTHS = 6;

export default async function AvailabilityPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  await ensureManagedTent().catch(() => undefined);
  const stays = await getDb().select({ slug: cottages.slug, name: cottages.name }).from(cottages).orderBy(asc(cottages.sort)).catch(() => []);
  const today = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
  const startMonth = today.slice(0, 7);
  const end = new Date(Date.UTC(Number(startMonth.slice(0, 4)), Number(startMonth.slice(5)) - 1 + MONTHS, 1)).toISOString().slice(0, 10);
  const [days, blocks] = await Promise.all([
    nightlyAvailability(stays.map((s) => s.slug), `${startMonth}-01`, end).catch(() => ({} as Record<string, Record<string, number | null>>)),
    listStayBlocks().catch(() => []),
  ]);
  return <div>
    <h1 className="font-display text-3xl italic">Availability</h1>
    <div className="mt-6 space-y-6">
      <AvailabilityCalendar stays={stays} days={days} startMonth={startMonth} months={MONTHS} />
      <StayBlockManager stays={stays} blocks={blocks} />
    </div>
  </div>;
}
