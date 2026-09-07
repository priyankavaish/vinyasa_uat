import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/hero";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { Icon, type IconName } from "@/components/ui/icon";
import { getEvents } from "@/lib/cms";
import { whatsappLink } from "@/lib/site";

import residencyImg from "@/app/assets/new/community-05.jpg";
import gatherImg from "@/app/assets/new/community-02.jpg";

export const revalidate = 300;
export const metadata = {
  title: "Events & Retreats",
  description: "Artist residencies, retreats, workshops and gatherings at Vinyasa Earth.",
  alternates: { canonical: "/events" },
};

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

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <PageHero eyebrow="Residencies / Retreats / Workshops" title="Time and space to make what matters" description="From a single evening of Kabir bhajans to a four-month residency, every programme follows the rhythm of the land and its community." image="/images/Vinyasa data (Space)/BM9A6438.jpg" imageAlt="Open-air gathering space and white arches at Vinyasa Earth" imagePosition="50% 55%" mobileImagePosition="60% 50%" />

      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
        <Reveal variant="fade">
          <SectionEyebrow icon="calendar-outline" className="justify-center">The 2026-27 calendar</SectionEyebrow>
          <p className="mt-4 leading-relaxed text-foreground-soft">Vinyasa Earth hosts programmes lasting anywhere from a few hours to several months, created for artistic practice, personal growth and meaningful connection. Each gathering is seasonal and intentionally small.</p>
        </Reveal>
      </section>

      <section className="organic-section relative overflow-hidden bg-clay-surface py-16 sm:py-20">
        <Parallax speed={-0.04} className="pointer-events-none absolute -right-24 -top-16 hidden w-[22rem] opacity-[0.14] sm:block" aria-hidden="true">
          <Image src={gatherImg} alt="" className="w-full rounded-full" />
        </Parallax>
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => {
              const meta = KIND_META[event.kind];
              const display = EVENT_DISPLAY[event.slug] ?? { name: event.name, date: event.dateLabel ?? "", duration: event.durationLabel, facilitator: event.facilitator, description: event.description, image: event.image ?? "/seed/grounds-06.jpg" };
              return (
                <Reveal key={event.slug} variant="up" delay={(i % 3) * 90} className="h-full">
                  <Link href={`/events/${event.slug}`} className="group flex h-full min-h-[34rem] flex-col overflow-hidden border border-line bg-surface transition-all hover:-translate-y-1 hover:shadow-xl" style={{ borderTopColor: meta.accent, borderTopWidth: 3 }}>
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-clay-surface">
                      <Image src={event.image || display.image} alt={`${display.name} at Vinyasa Earth`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: meta.accent }}><Icon name={meta.icon} size={14} />{meta.label}</span>
                        <Icon name="arrow-forward-outline" size={17} className="text-accent transition-transform group-hover:translate-x-1" />
                      </div>
                      <h3 className="mt-5 font-display italic text-2xl leading-tight text-foreground">{display.name}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-foreground-soft">{display.description}</p>
                      <dl className="mt-6 space-y-2 border-t border-line pt-5 text-xs text-foreground-soft">
                        <div className="flex items-center gap-2"><Icon name="calendar-outline" size={13} className="text-muted" /><span>{display.date}</span></div>
                        <div className="flex items-center gap-2"><Icon name="sunny-outline" size={13} className="text-muted" /><span>{display.duration}</span></div>
                        {display.facilitator && <div className="flex items-center gap-2"><Icon name="people-outline" size={13} className="text-muted" /><span>With {display.facilitator}</span></div>}
                      </dl>
                      <p className="mt-5 text-sm font-semibold tabular-nums" style={{ color: meta.accent }}>{priceText(event.priceFrom)}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="artist-escape" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left"><div className="relative aspect-[4/5] overflow-hidden border border-line"><Image src={residencyImg} alt="Resident artists at Vinyasa Earth" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /></div></Reveal>
          <Reveal variant="right" delay={100}>
            <SectionEyebrow icon="compass-outline">The Artist Escape</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">An affordable home for artists at work</h2>
            <p className="mt-4 leading-relaxed text-foreground-soft">Outside the dated calendar, the Artist Escape runs year-round: an affordable stay with meals included, in a supportive creative environment. Paint, write, choreograph or build alongside the resident community for a week or a season.</p>
            <p className="mt-3 leading-relaxed text-foreground-soft">Applications and residency queries go straight to the team.</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <a href={whatsappLink("Hi Vinyasa Earth, I'd like to apply for the Artist Escape.")} className="btn btn-accent inline-flex">Enquire on WhatsApp</a>
              <Link href="/contact" className="btn btn-outline inline-flex">Write to us</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}