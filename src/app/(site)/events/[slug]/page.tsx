
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__events__slug__page";
import { getEditorial } from "@/lib/editorial/server";
import { PageHero } from "@/components/sections/hero";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import RichContent from "@/components/ui/rich-content";
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

const PAUSE_WITHIN_CONTENT = {
  intro: "The Pause Within is an invitation to slow down and become curious about how stress, emotions, tension, overwhelm, disconnection and the need for rest show up in everyday life.",
  context: "This is not a retreat about eliminating stress or achieving a particular state of calm. It is an exploration of our relationship with stress - an opportunity to recognise our patterns, understand our signals and discover what helps us feel supported.",
  explore: [
    "How we recognise when stress is building",
    "How emotions show up physically",
    "What helps us feel more settled and supported",
    "How to notice when we are doing too much",
    "How to pause before reacting automatically",
    "Simple practices that can support us in everyday life",
  ],
  takeBack: [
    "A clearer understanding of your stress responses",
    "Greater awareness of what supports you",
    "More space between what you feel and what you do next",
    "A more compassionate relationship with yourself",
  ],
  passes: [
    { name: "Complete Retreat Pass", price: "Rs. 4,999", detail: "Two-night stay, food and retreat facilitation." },
    { name: "Stay & Retreat Pass", price: "Rs. 2,499", detail: "Two-night stay and retreat facilitation. Meals can be ordered separately." },
    { name: "Community Pass", price: "Rs. 1,800", detail: "For members of the Vinyasa community. Includes stay and food." },
  ],
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
  const content = await getEditorial("app/(site)/events/[slug]/page", editorialDefaults);

  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const image = event.image || content.EVENT_IMAGES[event.slug] || "/seed/grounds-06.jpg";
  const details = content.EVENT_DETAILS[event.slug];
  const priceLabel = event.priceFrom === 0 ? "By donation" : `Ã¢â€šÂ¹${event.priceFrom.toLocaleString("en-IN")}`;
  const isPauseWithin = event.slug === "the-pause-within";

  return (
    <>
      <PageHero framed={isPauseWithin} eyebrow={isPauseWithin ? "A residential retreat" : event.kind} title={event.name} description={event.description} image={image} imageAlt={event.name + " at Vinyasa Earth"}>
        {isPauseWithin && <Link href={`/book?type=event&slug=${event.slug}`} className="btn btn-accent">Reserve your place <span aria-hidden>↗</span></Link>}
      </PageHero>

      {isPauseWithin ? (
        <main className="bg-background">
          <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">18-20 September 2026</p>
              <h2 className="mt-5 max-w-[16ch] font-display text-4xl leading-[1.08] text-foreground sm:text-5xl">A little space to listen inward.</h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft">{PAUSE_WITHIN_CONTENT.intro}</p>
              <p className="mt-5 max-w-2xl leading-7 text-foreground-soft">{PAUSE_WITHIN_CONTENT.context}</p>

              <div className="mt-12 grid border-y border-line py-6 sm:grid-cols-3 sm:divide-x sm:divide-line">
                <div className="pb-5 sm:px-5 sm:pb-0 sm:first:pl-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Duration</p><p className="mt-2 font-semibold">Two nights, two days</p></div>
                <div className="border-t border-line pt-5 sm:border-t-0 sm:px-5 sm:pt-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Facilitator</p><p className="mt-2 font-semibold">Nikita Chawda</p></div>
                <div className="border-t border-line pt-5 sm:border-t-0 sm:px-5 sm:pt-0 sm:last:pr-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Venue</p><p className="mt-2 font-semibold">Vinyasa Earth, Jaipur</p></div>
              </div>

              <div className="mt-16 grid gap-12 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The retreat</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight">What we will explore</h3>
                  <ul className="mt-6 space-y-4 text-foreground-soft">
                    {PAUSE_WITHIN_CONTENT.explore.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />{item}</li>)}
                  </ul>
                </div>
                <div className="border-t border-line pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">A gentle takeaway</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight">What you may take back</h3>
                  <ul className="mt-6 space-y-4 text-foreground-soft">
                    {PAUSE_WITHIN_CONTENT.takeBack.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />{item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-16 border-t border-line pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About Nikita</p>
                <h3 className="mt-4 font-display text-3xl leading-tight">A body-led way of paying attention.</h3>
                <p className="mt-5 max-w-2xl leading-7 text-foreground-soft">Nikita Chawda is a somatic therapist and Play Movement Educator who works with adults navigating trauma, stress and shame. Her approach is not about fixing, changing or controlling the body and mind. She creates the time, space and support needed to meet ourselves where we are and reconnect with the vitality within us.</p>
              </div>
            </div>

            <aside className="self-start lg:sticky lg:top-28">
              <div className="border border-line bg-surface p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Choose your pass</p>
                <p className="mt-3 text-sm leading-6 text-foreground-soft">Come with curiosity. There is nothing to fix and nowhere particular to arrive.</p>
                <div className="mt-7 divide-y divide-line">
                  {PAUSE_WITHIN_CONTENT.passes.map((pass) => <div key={pass.name} className="py-5 first:pt-0 last:pb-0"><div className="flex items-baseline justify-between gap-3"><h3 className="font-semibold">{pass.name}</h3><span className="shrink-0 text-sm font-semibold text-accent">{pass.price}</span></div><p className="mt-2 text-sm leading-6 text-foreground-soft">{pass.detail}</p></div>)}
                </div>
                <Link href={`/book?type=event&slug=${event.slug}`} className="btn btn-accent mt-7 block text-center">Reserve your place <span aria-hidden>↗</span></Link>
              </div>
              <p className="mt-4 text-center text-xs leading-5 text-muted">Part of The Collective Body, Vinyasa Earth's Artist-in-Residence programme.</p>
            </aside>
          </section>
        </main>
      ) : (
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <Link href={content.href_1} className="text-xs uppercase tracking-[0.08em] text-accent underline">{content.text_2}</Link>
        <div className="mt-8 grid gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display italic text-2xl">{content.text_3}</h2>
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
                  <span>{content.text_4}{event.facilitator}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Icon name="location-outline" size={15} className="text-accent" />
                <span>{content.text_5}</span>
              </div>
            </dl>
                        {event.bodyHtml ? <RichContent html={event.bodyHtml} className="mt-8" /> : details && (
              <div className="mt-10 border-t border-line pt-8">
                <h2 className="font-display italic text-3xl">{details.heading}</h2>
                {details.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-7 text-foreground-soft">{paragraph}</p>)}
                <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-accent">{content.text_6}</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {details.highlights.map((item) => <li key={item} className="border-l-2 border-accent/50 bg-clay-surface px-4 py-3 text-sm text-foreground-soft">{item}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="border border-line bg-surface p-6">
            <p className="text-xs tracking-[0.08em] uppercase text-foreground-soft">{content.text_7}</p>
            <p className="mt-1 font-sans text-3xl font-bold tracking-tight tabular-nums">{priceLabel}</p>
            <Link href={`/book?type=event&slug=${event.slug}`} className="btn btn-accent mt-5 block text-center">{content.text_8}</Link>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
