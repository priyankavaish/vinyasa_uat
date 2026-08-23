import Image from "next/image";
import clayPot from "@/app/assets/claypot.png";
import { PageHero } from "@/components/hero";
import EventCard from "@/components/event-card";
import SectionEyebrow from "@/components/section-eyebrow";
import { Reveal } from "@/components/reveal";
import { ParallaxHeroImage } from "@/components/parallax";
import { events } from "@/lib/content";

export const metadata = { title: "Events & Retreats", description: "Explore artist residencies, self-discovery retreats and creative workshops at Vinyasa Earth.", alternates: { canonical: "/events" } };

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Residencies, retreats & workshops"
        title="Programs built around the rhythm of the desert"
        description="From single-day workshops to month-long artist residencies, pick a program below."
        image="/images/property-night-gathering.jpg"
      />
      <section className="organic-section organic-events relative overflow-hidden bg-clay-surface py-20">
        <ParallaxHeroImage className="pointer-events-none">
          <Image
            src={clayPot}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left opacity-20 mix-blend-multiply"
            aria-hidden="true"
          />
        </ParallaxHeroImage>
        <div className="pointer-events-none absolute inset-0 bg-clay-surface/55" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="left" className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionEyebrow icon="calendar-outline">Events &amp; Retreats</SectionEyebrow>
              <h2 className="mt-3 max-w-[24ch] font-display italic text-4xl leading-tight">
                Time and space to make what matters
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {events.map((e, i) => (
              <EventCard key={e.slug} event={e} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
