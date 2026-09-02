import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import RichContent from "@/components/rich-content";
import { getEvent, getEvents } from "@/lib/cms";

export const revalidate = 300;

const EVENT_IMAGES: Record<string, string> = {
  "artist-in-residence": "/seed/community-05.jpg",
  "anhad-ka-baaja": "/seed/community-02.jpg",
  "the-pause-within": "/seed/grounds-08.jpg",
  "artist-unite": "/seed/community-06.jpg",
  zariya: "/seed/community-01.jpg",
  "drishti-new-years-retreat": "/seed/grounds-05.jpg",
  "performing-lab-retreat": "/seed/community-03.jpg",
};
const EVENT_DETAILS: Record<string, { heading: string; paragraphs: string[]; highlights: string[] }> = {
  "artist-in-residence": {
    heading: "An immersive, research-led residency",
    paragraphs: ["A four-month living and research opportunity for artists and practitioners who want to deepen their practice in a nature-led, community-oriented environment.", "Residents develop a clear inquiry, document their process and share accessible engagements with the community. The work becomes part of the Vinyasa Archive while the artist retains authorship."],
    highlights: ["Dormitory stay and daily vegetarian meals", "Access to natural, architectural and community spaces", "Independent research and artistic inquiry", "Only two residency places"],
  },
  "anhad-ka-baaja": {
    heading: "An evening of Kabir bhajans",
    paragraphs: ["Listen and sing along to the words of Sant Kabir with Priyal. The evening invites you to experience the poetry not only as performance, but as something felt, shared and reflected upon.", "Priyal has been a musician for 16 years and deepened his relationship with Kabir's music while travelling and learning with Prahlad Tipaniya Ji."],
    highlights: ["Welcome drink included", "Food available from the Vinyasa kitchen", "Come to listen, reflect or sing along"],
  },
  "the-pause-within": {
    heading: "A quiet return to yourself",
    paragraphs: ["A two-night residential retreat created to notice how stress lives differently in each of us and what those experiences may be trying to tell us.", "Gentle group sessions, time in nature and unhurried pauses offer room to step away from daily demands and listen more closely."],
    highlights: ["Guided reflection", "Restorative practices", "Vegetarian meals", "Stay in Vinyasa's earth-built cottages"],
  },
  "artist-unite": {
    heading: "A residency of self creation",
    paragraphs: ["Ten days of making, exchanging and observing with practitioners across disciplines. Encounter how other artists work beyond the usual performance context and let those encounters reshape your own process.", "The residency values curiosity, generosity and work in progress."],
    highlights: ["Independent studio time", "Peer-led exchanges", "Collaborative experiments", "Community living and meals"],
  },
  zariya: {
    heading: "Connecting creators",
    paragraphs: ["Vinyasa Earth's annual gathering for artists, makers and creative professionals begins around sunset and unfolds through art, conversation, performances and music.", "Move through the grounds, meet the people behind the work and discover ideas in an open, informal setting."],
    highlights: ["Live performances", "Creative conversations", "Music and food", "An evening under the open sky"],
  },
  "drishti-new-years-retreat": {
    heading: "See the year with fresh eyes",
    paragraphs: ["Step away from the noise, look back at the year that has been and make grounded space for the one about to begin.", "Days follow the slower rhythm of the farm through shared practice, nourishing meals, reflection, movement and conversations around the fire."],
    highlights: ["Guided year-end reflection", "Movement and grounding", "Community meals", "A gentle New Year's celebration"],
  },
  "performing-lab-retreat": {
    heading: "A five-day performing lab",
    paragraphs: ["A physical intensive for performers, dancers, actors and creative explorers led by theatre practitioner Sukh AhlstrÃ¶m.", "Train, experiment and reconnect with the body as an expressive instrument through physical theatre, Kalaripayattu and movement."],
    highlights: ["Daily physical training", "Improvisation and ensemble work", "Movement research", "Reflection and sharing"],
  },
};

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return { title: event.name, description: event.description, alternates: { canonical: `/events/${event.slug}` } };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const image = event.image || EVENT_IMAGES[event.slug] || "/seed/grounds-06.jpg";
  const details = EVENT_DETAILS[event.slug];
  const priceLabel = event.priceFrom === 0 ? "By donation" : `Ã¢â€šÂ¹${event.priceFrom.toLocaleString("en-IN")}`;

  return (
    <>
      <section className="relative flex h-[52vh] min-h-[380px] items-end text-background">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-12 sm:px-8">
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] before:h-px before:w-7 before:bg-background/60 before:content-['']">
            {event.kind}
          </p>
          <h1 className="font-display italic text-4xl leading-tight sm:text-5xl">{event.name}</h1>
          <p className="mt-4 max-w-[60ch] text-background/85 leading-relaxed">{event.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <Link href="/events" className="text-xs uppercase tracking-[0.08em] text-accent underline">
          Ã¢â€ Â All programmes
        </Link>
        <div className="mt-8 grid gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display italic text-2xl">Details</h2>
            <dl className="mt-4 space-y-3 text-sm text-foreground-soft">
              {event.dateLabel && (
                <div className="flex items-center gap-3">
                  <Icon name="calendar-outline" size={15} className="text-accent" />
                  <span>{event.dateLabel}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Icon name="sunny-outline" size={15} className="text-accent" />
                <span>{event.durationLabel}</span>
              </div>
              {event.facilitator && (
                <div className="flex items-center gap-3">
                  <Icon name="people-outline" size={15} className="text-accent" />
                  <span>Facilitated by {event.facilitator}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Icon name="location-outline" size={15} className="text-accent" />
                <span>Vinyasa Earth, Amer, Jaipur</span>
              </div>
            </dl>
                        {event.bodyHtml ? <RichContent html={event.bodyHtml} className="mt-8" /> : details && (
              <div className="mt-10 border-t border-line pt-8">
                <h2 className="font-display italic text-3xl">{details.heading}</h2>
                {details.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-7 text-foreground-soft">{paragraph}</p>)}
                <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-accent">What to expect</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {details.highlights.map((item) => <li key={item} className="border-l-2 border-accent/50 bg-clay-surface px-4 py-3 text-sm text-foreground-soft">{item}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="border border-line bg-surface p-6">
            <p className="text-xs tracking-[0.08em] uppercase text-foreground-soft">Contribution</p>
            <p className="mt-1 font-sans text-3xl font-bold tracking-tight tabular-nums">{priceLabel}</p>
            <Link href={`/book?type=event&slug=${event.slug}`} className="btn btn-accent mt-5 block text-center">
              Reserve a spot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
