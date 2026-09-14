
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__events_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/hero";
import type { EventSlide } from "@/components/sections/events-hero-carousel";
import StaysHeroGallery from "@/components/sections/stays-hero-gallery";
import EventsCalendar, { type CalEntry } from "@/components/sections/events-calendar";
import SectionWave from "@/components/ui/section-wave";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { Icon, type IconName } from "@/components/ui/icon";
import { getEvents } from "@/lib/cms";
import { parseEventStart } from "@/lib/event-dates";

import gatherImg from "@/app/assets/new/community-02.jpg";

export const revalidate = 300;
export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/events/page", editorialDefaults)).seo;
}

const KIND_META: Record<string, { icon: IconName; accent: string; label: string }> = {
  residency: { icon: "compass-outline", accent: "#8f3b31", label: "Residency" },
  retreat: { icon: "leaf-outline", accent: "#6b7a5e", label: "Retreat" },
  workshop: { icon: "sparkles-outline", accent: "#a06a2c", label: "Workshop" },
};

const EVENT_DISPLAY: Record<string, { name: string; date: string; duration: string; facilitator?: string; description: string; image: string }> = {
  "artist-in-residence": { name: "Artist-in-Residence Program", date: "1 Jun - 30 Sep 2026", duration: "4 months - Jun to Sep", description: "A four-month immersive residency where two selected artists live, explore and create in a nature-led, community-oriented environment.", image: "/seed/community-05.jpg" },
  "anhad-ka-baaja": { name: "Anhad ka Baaja", date: "12 Sep 2026", duration: "One evening - 6:00 pm", facilitator: "Priyal", description: "An intimate evening of Kabir bhajans, listening and singing along to poetry that is meant to be felt and shared.", image: "/seed/community-02.jpg" },
  "the-pause-within": { name: "The Pause Within", date: "18-20 Sep 2026", duration: "3 days / 2 nights", facilitator: "Nikita Chawda", description: "A two-night residential retreat exploring how stress lives differently in each of us and what those experiences are trying to tell us.", image: "/seed/grounds-08.jpg" },
  "artist-unite": { name: "Artist Unite - A Residency of Self Creation", date: "15-24 Oct 2026", duration: "10 days", description: "An intensive residency on collaborative artistic practice and a chance to experience how other artists work.", image: "/seed/community-06.jpg" },
  zariya: { name: "Zariya - Connecting Creators", date: "24 Oct 2026", duration: "One day - 4:00 to 11:00 pm", description: "Vinyasa Earth's annual sunset gathering of art, conversations, performances, music and creative people.", image: "/seed/community-01.jpg" },
  "drishti-new-years-retreat": { name: "Drishti - New Year's Retreat", date: "29 Dec 2026 - 1 Jan 2027", duration: "3 days", description: "Step away from the noise, reflect on the year that has been and make grounded space for the one ahead.", image: "/seed/grounds-05.jpg" },
  "performing-lab-retreat": { name: "Performing Lab Retreat", date: "17-22 Jan 2027", duration: "5 days", facilitator: "Sukh Ahlstrom", description: "A five-day intensive in physical theatre, Kalaripayattu and movement for performers and creative explorers.", image: "/seed/community-03.jpg" },
};

function priceText(from: number) {
  return from === 0 ? "By donation" : `From INR ${from.toLocaleString("en-IN")}`;
}

// Rough end-date from a range label ("18-20 Sep 2026" -> 20 Sep 2026); falls
// back to the start when there's no range.
function parseEventEnd(label: string, start: Date): Date {
  const [, restRaw] = label.split(/\s*[–-]\s*/);
  if (!restRaw) return start;
  const m = restRaw.trim().match(/(\d{1,2})\s+([A-Za-z]{3,})(?:\s+(\d{4}))?/);
  if (!m) return start;
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const month = months[m[2].slice(0, 3).toLowerCase()];
  if (month === undefined) return start;
  const year = m[3] ? Number(m[3]) : start.getUTCFullYear();
  const d = new Date(Date.UTC(year, month, Number(m[1])));
  return Number.isNaN(d.getTime()) || d < start ? start : d;
}

function ymd(d: Date) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(
    d.getUTCDate(),
  ).padStart(2, "0")}`;
}

// A "Add to Google Calendar" template link for an all-day event.
function gcalUrl(name: string, start: Date, end: Date, details: string) {
  const endExclusive = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${name} — Vinyasa Earth`,
    dates: `${ymd(start)}/${ymd(endExclusive)}`,
    details: `${details}\n\nhttps://vinyasa.earth`,
    location: "Vinyasa Earth, Maheshwas Khurd, Jalsu, Jaipur 303701, Rajasthan",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default async function EventsPage() {
  const content = await getEditorial("app/(site)/events/page", editorialDefaults);

  const events = await getEvents();

  const slides: EventSlide[] = events.map((event) => {
    const meta = content.KIND_META[event.kind] ?? content.KIND_META.retreat;
    const display = content.EVENT_DISPLAY[event.slug];
    return {
      slug: event.slug,
      name: event.name,
      date: event.dateLabel ?? "",
      image: event.image || display?.image || "/images/events-hero.jpg",
      label: meta.label,
      icon: meta.icon,
      accent: meta.accent,
    };
  });

  const calEntries: CalEntry[] = events
    .map((event) => {
      const meta = content.KIND_META[event.kind] ?? content.KIND_META.retreat;
      const label = event.dateLabel || "";
      const start = parseEventStart(label);
      if (!start) return null;
      const end = parseEventEnd(label, start);
      return {
        slug: event.slug,
        name: event.name,
        accent: meta.accent,
        start: start.toISOString(),
        end: end.toISOString(),
      } satisfies CalEntry;
    })
    .filter((x): x is CalEntry => x !== null);

  return (
    <>
      {slides.length ? (
        <>
          <StaysHeroGallery variant="events" photos={slides.map((slide) => ({ src: slide.image, name: slide.name, slug: slide.slug, element: slide.label, date: slide.date }))} />
          <section className="mx-auto max-w-3xl px-5 pb-4 pt-4 text-center sm:px-8">
            <p className="text-sm leading-relaxed text-foreground-soft sm:text-base">{content.text_1}</p>
          </section>
        </>
      ) : (
        <PageHero
          eyebrow={content.eyebrow_2}
          title={content.title_3}
          description={content.description_4}
          image={content.image_5}
          imageAlt={content.imageAlt_6}
          imagePosition="60% 45%"
          mobileImagePosition="62% 45%"
          contain
        />
      )}

      <section id="events-calendar" className="mx-auto max-w-3xl scroll-mt-24 px-5 pb-8 pt-8 text-center sm:px-8">
        <Reveal variant="fade">
          <SectionEyebrow icon="calendar-outline" className="justify-center">{content.text_7}</SectionEyebrow>
          <p className="mt-3 text-sm leading-relaxed text-foreground-soft">{content.text_8}</p>
        </Reveal>
      </section>

      <SectionWave from="#f3f1ea" to="#f3e6d8" variant="wave" />
      <section className="organic-section relative overflow-hidden bg-clay-surface py-14 sm:py-16">
        <Parallax speed={-0.04} className="pointer-events-none absolute -right-24 -top-16 hidden w-[22rem] opacity-[0.14] sm:block" aria-hidden="true">
          <Image src={content.gatherImg} alt="" className="w-full rounded-full" />
        </Parallax>
        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal variant="up">
            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-soft">
              {Object.values(content.KIND_META).map((k) => (
                <span key={k.label} className="inline-flex items-center gap-2">
                  <span className="h-3 w-3" style={{ backgroundColor: k.accent }} />
                  {k.label}
                </span>
              ))}
            </div>
            <EventsCalendar entries={calEntries} />
          </Reveal>

          <ul className="mt-12 border-t border-line">
            {events.map((event, i) => {
              const meta = content.KIND_META[event.kind] ?? content.KIND_META.retreat;
              const display =
                {
                  name: event.name,
                  date: event.dateLabel ?? "",
                  duration: event.durationLabel ?? "",
                  facilitator: event.facilitator,
                  description: event.description ?? "",
                  image: event.image ?? "/seed/grounds-06.jpg",
                };
              const label = display.date || event.dateLabel || "";
              const start = parseEventStart(label);
              const end = start ? parseEventEnd(label, start) : null;
              const month = start
                ? start.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase()
                : "";
              const day = start ? start.getUTCDate() : "";
              return (
                <Reveal key={event.slug} variant="up" delay={(i % 4) * 70}>
                  <li className="flex flex-col gap-4 border-b border-line py-6 sm:flex-row sm:items-center sm:gap-6">
                    <span
                      className="flex w-14 shrink-0 flex-col items-center border border-line bg-surface py-1.5 leading-none"
                      style={{ borderTopColor: meta.accent, borderTopWidth: 3 }}
                    >
                      <span
                        className="text-[12px] font-bold uppercase tracking-[0.12em]"
                        style={{ color: meta.accent }}
                      >
                        {month || "—"}
                      </span>
                      <span className="font-display text-xl text-foreground">{day || "?"}</span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
                        style={{ color: meta.accent }}
                      >
                        <Icon name={meta.icon} size={12} />
                        {meta.label}
                      </span>
                      <h3 className="mt-1 font-display text-lg italic leading-tight text-foreground">
                        {display.name}
                      </h3>
                      <p className="mt-1 text-xs text-foreground-soft">
                        {label}
                        {display.duration ? ` · ${display.duration}` : ""} · {priceText(event.priceFrom)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {start && end && (
                        <a
                          href={gcalUrl(display.name, start, end, display.description)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-clay-ink transition-colors hover:border-accent hover:text-accent"
                        >
                          <Icon name="calendar-outline" size={12} />{content.text_9}</a>
                      )}
                      <Link
                        href={`/events/${event.slug}`}
                        className="inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-ink transition-transform hover:-translate-y-0.5"
                      >{content.text_10}<Icon name="arrow-forward-outline" size={12} />
                      </Link>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
      <SectionWave from="#f3e6d8" to="#f3f1ea" variant="arch" />
    </>
  );
}