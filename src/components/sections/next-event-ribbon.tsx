import Link from "next/link";
import { getEvents } from "@/lib/cms";
import { parseEventStart } from "@/lib/event-dates";
import { Icon } from "../ui/icon";

// A slim strip under the hero so the soonest programme is impossible to miss.
// Runs as a marquee so a long event name is always readable in full.
export default async function NextEventRibbon() {
  const events = await getEvents();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const next = events
    .map((e) => ({ e, start: parseEventStart(e.dateLabel) }))
    .filter((x): x is { e: (typeof events)[number]; start: Date } => x.start !== null && x.start >= today)
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

  if (!next) return null;

  const month = next.start
    .toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const day = next.start.getUTCDate();

  const Unit = (
    <span className="flex shrink-0 items-center gap-4 pr-8 sm:gap-5 sm:pr-10">
      <span className="flex items-center gap-1.5 rounded-full bg-[#e7b878] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5a2015]">
        <Icon name="calendar-outline" size={13} />
        {month} {day}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f0c58c]">
        Next at Vinyasa
      </span>
      <span className="font-display text-base font-medium leading-none text-white sm:text-lg">
        {next.e.name}
      </span>
      <span className="text-xs text-white/70">{next.e.dateLabel}</span>
      <span className="flex items-center gap-1.5 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent shadow-[0_2px_10px_rgba(0,0,0,0.22)]">
        Book Now
        <Icon name="arrow-forward-outline" size={14} />
      </span>
      <Icon name="leaf-outline" size={12} className="-rotate-45 text-[#e7b878]" />
    </span>
  );

  return (
    <Link
      href={`/events/${next.e.slug}`}
      aria-label={`Next event: ${next.e.name}, ${next.e.dateLabel} — book now`}
      className="group relative block overflow-hidden border-b border-t-2 border-b-black/20 border-t-[#e7b878] bg-gradient-to-r from-[#7d3128] via-[#9a3f31] to-[#7d3128] text-accent-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#7d3128] to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#7d3128] to-transparent sm:w-16" />

      <div
        aria-hidden="true"
        className="marquee-track flex w-max items-center py-3 group-hover:[animation-play-state:paused] sm:py-3.5"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="flex shrink-0 items-center">
            {Unit}
          </span>
        ))}
      </div>
    </Link>
  );
}
