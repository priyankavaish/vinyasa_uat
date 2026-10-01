import { getEvents } from "@/lib/cms";
import { parseEventStart } from "@/lib/event-dates";
import UpcomingEventsInteractive, { type EventItem } from "./upcoming-events-interactive";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FALLBACK = "/images/property-night-gathering.jpg";

export default async function UpcomingEventsSection() {
  const events = await getEvents();

  const items: EventItem[] = events
    .map((event) => ({ event, start: parseEventStart(event.dateLabel) }))
    .filter((e): e is { event: (typeof events)[number]; start: Date } => e.start !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 4)
    .map(({ event, start }) => ({
      slug: event.slug,
      name: event.name,
      kind: event.kind,
      dateLabel: event.dateLabel ?? "",
      priceFrom: event.priceFrom,
      image: event.image || FALLBACK,
      month: MONTH_SHORT[start.getUTCMonth()],
      day: start.getUTCDate(),
    }));

  if (items.length === 0) return null;

  return <UpcomingEventsInteractive items={items} />;
}
