import Image from "next/image";
import Link from "next/link";
import { getEvents } from "@/lib/cms";
import { parseEventStart } from "@/lib/event-dates";
import { Icon, type IconName } from "../ui/icon";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";

const KIND_META: Record<string, { icon: IconName; accent: string; label: string }> = {
  residency: { icon: "compass-outline", accent: "#8f3b31", label: "Residency" },
  retreat: { icon: "leaf-outline", accent: "#6b7a5e", label: "Retreat" },
  workshop: { icon: "sparkles-outline", accent: "#a06a2c", label: "Workshop" },
};

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function priceText(from: number) {
  return from === 0 ? "By donation" : `From ₹${from.toLocaleString("en-IN")}`;
}

export default async function UpcomingEventsSection() {
  const events = await getEvents();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const upcoming = events
    .map((event) => ({ event, start: parseEventStart(event.dateLabel) }))
    .filter((e): e is { event: (typeof events)[number]; start: Date } => e.start !== null && e.start >= today)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="organic-section relative overflow-hidden bg-clay-surface py-14 sm:py-20">
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal variant="up" className="mx-auto mb-12 max-w-2xl text-center">
          <SectionEyebrow icon="calendar-outline" className="justify-center">
            What&apos;s coming up
          </SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            The next few dates on the calendar
          </h2>
          <p className="mt-4 leading-relaxed text-foreground-soft">
            Residencies, retreats and workshops, closest first. The full seasonal calendar has more.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map(({ event, start }, i) => {
            const meta = KIND_META[event.kind] ?? KIND_META.retreat;
            return (
              <Reveal key={event.slug} variant="up" delay={i * 90} className="h-full">
                <Link
                  href={`/events/${event.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-line bg-surface transition-all hover:-translate-y-1 hover:shadow-xl"
                  style={{ borderTopColor: meta.accent, borderTopWidth: 3 }}
                >
                  <div className="relative flex aspect-[4/3] w-full shrink-0 overflow-hidden bg-clay-surface">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon name={meta.icon} size={28} className="text-muted" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex flex-col items-center rounded bg-white/95 px-2.5 py-1.5 leading-none shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: meta.accent }}>
                        {MONTH_SHORT[start.getUTCMonth()]}
                      </span>
                      <span className="mt-0.5 font-display text-lg text-foreground">{start.getUTCDate()}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <span
                      className="inline-flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: meta.accent }}
                    >
                      <Icon name={meta.icon} size={13} />
                      {meta.label}
                    </span>
                    <h3 className="mt-4 font-display italic text-2xl leading-tight text-foreground">
                      {event.name}
                    </h3>
                    <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-foreground-soft">
                      {event.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <span className="text-xs text-foreground-soft">{event.dateLabel}</span>
                      <span className="text-sm font-semibold tabular-nums" style={{ color: meta.accent }}>
                        {priceText(event.priceFrom)}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal variant="fade" delay={150} className="mt-12 text-center">
          <Link href="/events" className="btn btn-outline inline-flex">
            View the full calendar
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
