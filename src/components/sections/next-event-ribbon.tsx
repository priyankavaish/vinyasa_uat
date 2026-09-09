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
      className="group block border-b border-line border-t border-t-accent/50 bg-surface"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-5 py-2.5 sm:py-3">
        <span className="flex shrink-0 flex-col items-center leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            {month}
          </span>
          <span className="font-display text-lg leading-none text-clay-ink">{day}</span>
        </span>

        <span aria-hidden className="hidden h-6 w-px bg-line sm:block" />

        <span className="flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Next at Vinyasa
          </span>
          <span className="font-display text-base leading-tight text-clay-ink sm:text-lg">
            {next.e.name}
          </span>
        </span>

        <span className="flex items-center gap-2 text-xs text-foreground-soft">
          <span aria-hidden className="hidden text-muted sm:inline">
            &middot;
          </span>
          {next.e.dateLabel}
          <Icon
            name="arrow-forward-outline"
            size={14}
            className="text-accent transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
