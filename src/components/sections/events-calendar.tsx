import Link from "next/link";

export type CalEntry = {
  slug: string;
  name: string;
  accent: string;
  start: string; // ISO, UTC midnight
  end: string; // ISO, UTC midnight (inclusive last day)
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const monthKey = (y: number, m: number) => y * 12 + m;
const dayNum = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

// A month-grid view of the programme — every month that has an event, with its
// dates coloured by kind and linking through to the event.
export default function EventsCalendar({ entries }: { entries: CalEntry[] }) {
  const parsed = entries
    .map((e) => ({ ...e, s: new Date(e.start), e2: new Date(e.end) }))
    .filter((e) => !Number.isNaN(e.s.getTime()) && !Number.isNaN(e.e2.getTime()));
  if (!parsed.length) return null;

  const monthsSet = new Map<number, { y: number; m: number }>();
  for (const p of parsed) {
    let cur = new Date(Date.UTC(p.s.getUTCFullYear(), p.s.getUTCMonth(), 1));
    const stop = new Date(Date.UTC(p.e2.getUTCFullYear(), p.e2.getUTCMonth(), 1));
    while (cur <= stop) {
      monthsSet.set(monthKey(cur.getUTCFullYear(), cur.getUTCMonth()), {
        y: cur.getUTCFullYear(),
        m: cur.getUTCMonth(),
      });
      cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1));
    }
  }
  const months = [...monthsSet.values()].sort(
    (a, b) => monthKey(a.y, a.m) - monthKey(b.y, b.m),
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {months.map(({ y, m }) => {
        const first = new Date(Date.UTC(y, m, 1));
        const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
        const lead = first.getUTCDay();
        const cells: Array<number | null> = [
          ...Array<null>(lead).fill(null),
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ];

        const byDay = new Map<number, typeof parsed>();
        for (const p of parsed) {
          for (let d = 1; d <= daysInMonth; d++) {
            const t = Date.UTC(y, m, d);
            if (t >= dayNum(p.s) && t <= dayNum(p.e2)) {
              if (!byDay.has(d)) byDay.set(d, []);
              byDay.get(d)!.push(p);
            }
          }
        }

        const label = first.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        });

        return (
          <div key={`${y}-${m}`} className="border border-line bg-surface p-4 sm:p-5">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-clay-ink">
              {label}
            </p>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[12px] font-bold uppercase text-muted">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((c, i) => {
                if (c === null) return <span key={i} className="h-8" />;
                const ev = byDay.get(c);
                if (!ev?.length) {
                  return (
                    <span
                      key={i}
                      className="grid h-8 place-items-center text-xs text-foreground-soft"
                    >
                      {c}
                    </span>
                  );
                }
                const primary = ev[0];
                return (
                  <Link
                    key={i}
                    href={`/events/${primary.slug}`}
                    title={ev.map((x) => x.name).join(", ")}
                    className="grid h-8 place-items-center text-xs font-bold text-white transition-transform hover:scale-110"
                    style={{ backgroundColor: primary.accent }}
                  >
                    {c}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
