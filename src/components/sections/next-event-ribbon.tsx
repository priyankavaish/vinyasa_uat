import Link from "next/link";
import { getEvents } from "@/lib/cms";
import { parseEventStart } from "@/lib/event-dates";
import { Icon } from "../ui/icon";

// A slim strip under the hero so the soonest programme is impossible to miss.
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

  return (
    <Link
      href={`/events/${next.e.slug}`}
      aria-label={`Next event: ${next.e.name}, ${next.e.dateLabel}`}
      className="group block border-b border-t-2 border-b-black/20 border-t-[#e7b878] bg-gradient-to-r from-[#7d3128] via-[#9a3f31] to-[#7d3128] text-accent-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:via-[#ad4636]"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2.5 px-4 py-3.5 sm:flex-nowrap sm:justify-center sm:gap-5 sm:py-3.5">
        {/* kicker — its own line on mobile, inline on desktop */}
        <span className="order-1 basis-full text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f0c58c] sm:order-2 sm:basis-auto sm:text-xs sm:tracking-[0.18em]">
          Next at Vinyasa
        </span>

        <span className="order-2 flex shrink-0 items-center gap-1.5 rounded-full bg-[#e7b878] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5a2015] sm:order-1 sm:text-sm">
          <Icon name="calendar-outline" size={14} />
          {month} {day}
        </span>

        <span className="order-3 min-w-0 flex-1 font-display text-base font-medium leading-snug text-white sm:flex-none sm:truncate sm:text-xl">
          {next.e.name}
        </span>

        <span aria-hidden className="order-4 hidden text-white/40 sm:inline">&middot;</span>
        <span className="order-4 hidden text-sm text-white/85 sm:inline">{next.e.dateLabel}</span>

        <span className="order-5 basis-full sm:basis-auto">
          <span className="flex w-full items-center justify-center gap-1.5 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-accent shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] sm:w-auto sm:py-1.5 sm:text-sm">
            Book Now
            <Icon
              name="arrow-forward-outline"
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </span>
      </div>
    </Link>
  );
}
