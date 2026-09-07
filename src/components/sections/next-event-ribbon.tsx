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

  return (
    <Link
      href={`/events/${next.e.slug}`}
      className="group flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-line bg-secondary-surface px-5 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary-ink sm:text-xs"
    >
      <Icon name="calendar-outline" size={13} className="shrink-0" />
      <span>
        Next at Vinyasa — <span className="text-secondary">{next.e.name}</span>
      </span>
      <span className="text-secondary-ink/70">{next.e.dateLabel}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </Link>
  );
}
