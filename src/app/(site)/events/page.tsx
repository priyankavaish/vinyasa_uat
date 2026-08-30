import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/hero";
import SectionEyebrow from "@/components/section-eyebrow";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { Icon, type IconName } from "@/components/icon";
import { getEvents } from "@/lib/cms";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;

import heroImg from "@/app/assets/new/grounds-06.jpg";
import residencyImg from "@/app/assets/new/community-05.jpg";
import gatherImg from "@/app/assets/new/community-02.jpg";

export const metadata = {
  title: "Events & Retreats",
  description:
    "Artist residencies, self-discovery retreats, workshops and gatherings at Vinyasa Earth — a seasonal calendar running Aug 2026 to Jan 2027.",
  alternates: { canonical: "/events" },
};

const KIND_META: Record<string, { icon: IconName; accent: string; label: string }> = {
  residency: { icon: "compass-outline", accent: "#8f3b31", label: "Residency" },
  retreat: { icon: "leaf-outline", accent: "#6b7a5e", label: "Retreat" },
  workshop: { icon: "sparkles-outline", accent: "#a06a2c", label: "Workshop" },
};

function priceText(from: number) {
  return from === 0 ? "By donation" : `From ₹${from.toLocaleString("en-IN")}`;
}

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <PageHero
        eyebrow="Residencies · Retreats · Workshops"
        title="Time and space to make what matters"
        description="From a single evening of Kabir bhajans to a four-month residency, every programme is built around the rhythm of the desert and the community that lives here."
        image={heroImg}
      />

      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
        <Reveal variant="fade">
          <SectionEyebrow icon="calendar-outline" className="justify-center">
            The 2026–27 calendar
          </SectionEyebrow>
          <p className="mt-4 leading-relaxed text-foreground-soft">
            Vinyasa Earth runs multi-duration residential programmes — anywhere from a few hours to
            several months — for self-nurturing, creative practice, and personal growth. Programmes
            are seasonal and small by design. Write to us to hold a place.
          </p>
        </Reveal>
      </section>

      <section className="organic-section relative overflow-hidden bg-clay-surface py-16 sm:py-20">
        <Parallax
          speed={-0.04}
          className="pointer-events-none absolute -right-24 -top-16 hidden w-[22rem] opacity-[0.14] sm:block"
          aria-hidden="true"
        >
          <Image src={gatherImg} alt="" className="w-full rounded-full" />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => {
              const meta = KIND_META[event.kind];
              return (
                <Reveal key={event.slug} variant="up" delay={(i % 3) * 90} className="h-full">
                  <Link
                    href={`/events/${event.slug}`}
                    className="group flex h-full flex-col border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-xl sm:p-7"
                    style={{ borderTopColor: meta.accent, borderTopWidth: 3 }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                        style={{ color: meta.accent }}
                      >
                        <Icon name={meta.icon} size={14} />
                        {meta.label}
                      </span>
                      <span className="text-lg text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </div>

                    <h3 className="mt-5 font-display italic text-2xl leading-tight text-foreground">
                      {event.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-foreground-soft">
                      {event.description}
                    </p>

                    <dl className="mt-6 space-y-2 border-t border-line pt-5 text-xs text-foreground-soft">
                      {event.dateLabel && (
                        <div className="flex items-center gap-2">
                          <Icon name="calendar-outline" size={13} className="text-muted" />
                          <span>{event.dateLabel}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Icon name="sunny-outline" size={13} className="text-muted" />
                        <span>{event.durationLabel}</span>
                      </div>
                      {event.facilitator && (
                        <div className="flex items-center gap-2">
                          <Icon name="people-outline" size={13} className="text-muted" />
                          <span>With {event.facilitator}</span>
                        </div>
                      )}
                    </dl>

                    <p
                      className="mt-5 text-sm font-semibold tabular-nums"
                      style={{ color: meta.accent }}
                    >
                      {priceText(event.priceFrom)}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image
                src={residencyImg}
                alt="Resident artists at Vinyasa Earth"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <SectionEyebrow icon="compass-outline">The Artist Escape</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              An affordable home for artists at work
            </h2>
            <p className="mt-4 leading-relaxed text-foreground-soft">
              Outside the dated calendar, the Artist Escape runs year-round: an affordable stay with
              meals included, in a supportive creative environment. Paint, write, choreograph, or
              build alongside the resident community for a week or a season.
            </p>
            <p className="mt-3 leading-relaxed text-foreground-soft">
              Applications and residency queries go straight to the team.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <a
                href={whatsappLink("Hi Vinyasa Earth, I'd like to apply for the Artist Escape.")}
                className="btn btn-accent inline-flex"
              >
                Enquire on WhatsApp
              </a>
              <Link href="/contact" className="btn btn-outline inline-flex">
                Write to us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
