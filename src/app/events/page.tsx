import { PageHero } from "@/components/hero";
import EventCard from "@/components/event-card";
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
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {events.map((e, i) => (
            <EventCard key={e.slug} event={e} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
