import PaymentButton from "@/components/ui/payment-button";

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
    highlights: ["Guided reflection", "Restorative practices", "Vegetarian meals", "Stay in Vinyasa's earth-built mudhouses"],
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

type EditorialEvent = {
  introTitle: string;
  intro: string;
  context: string;
  exploreTitle: string;
  explore: string[];
  takeawayTitle: string;
  takeaways: string[];
  aboutTitle: string;
  about: string;
  passes?: { name: string; price: string; detail: string }[];
  cta: string;
};

const EDITORIAL_EVENTS: Record<string, EditorialEvent> = {
  "artist-in-residence": {
    introTitle: "A slower way to let practice evolve.",
    intro: "The Vinyasa Artist-in-Residence Program is a four-month living and research opportunity for artists and practitioners who want to deepen their practice within a nature-led, community-oriented environment.",
    context: "Two selected artists live, explore and create between June and September. This is not a retreat and not a production residency. It is a process-driven immersion in which practice can be questioned, documented and reshaped in dialogue with land, people and time.",
    exploreTitle: "What the residency offers",
    explore: ["Four-month residential stay at Vinyasa Earth", "Dormitory accommodation and daily vegetarian meals", "Access to natural, architectural and community spaces", "Space for independent research and artistic inquiry", "Opportunity to host workshops, sessions or offerings", "A growing body of practice-led work for the Vinyasa Archive"],
    takeawayTitle: "What the application asks for",
    takeaways: ["A clear research topic and central question", "Scope, methodology and proposed outcomes", "A tentative June-September timeline", "A plan for process documentation", "A willingness to offer consistent, accessible engagements to the community"],
    aboutTitle: "Research as practice.",
    about: "Residents are expected to develop their inquiry into a well-structured research document, with written reflections, process journals, visual documentation or practice-based findings. Artists retain authorship while contributing to Vinyasa's growing archive of knowledge.",
    cta: "Apply for the residency",
  },
  "artist-unite": {
    introTitle: "Come with your practice. Leave with a community.",
    intro: "Artist Unite is a ten-day interdisciplinary residency built around the experience of living, creating and exchanging practices with artists from completely different worlds.",
    context: "There are no masterclasses here. A painter might invite you into the way they observe; a dancer might share how movement begins; a theatre-maker might introduce a game for discovering characters. The intention is to experience how another artist thinks through their art.",
    exploreTitle: "The rhythm of Artist Unite",
    explore: ["Morning stretch and a 7:30 AM artist process session", "Open afternoons for self-creation and studio time", "Shared evening practice, experiments or conversations", "Community meals, closing circles and spontaneous jams", "A final day at Zariya, the festival created by the residents", "Ten days of living inside an interdisciplinary artistic community"],
    takeawayTitle: "Who this is for",
    takeaways: ["Dancers, painters and theatre-makers", "Visual artists, musicians and sculptors", "Photographers, filmmakers and writers", "Performance artists and interdisciplinary practitioners", "Anyone curious about how other artists live and create"],
    aboutTitle: "And then, we build Zariya.",
    about: "Over the residency, Vinyasa gradually transforms from a home for artists into a festival made by them. Performances, artworks, installations and collaborations find their spaces, and every resident gets an opportunity to present work in a form suited to their practice.",
    passes: [{ name: "Artist Unite 2026", price: "Rs. 18,500 + GST", detail: "Ten nights in a dormitory, daily breakfast and dinner, shared process spaces and participation at Zariya." }],
    cta: "Apply for Artist Unite",
  },
  zariya: {
    introTitle: "A night to create, connect and celebrate.",
    intro: "Zariya is Vinyasa Earth's annual gathering of artists, creators and curious minds - an evening that begins around sunset and slowly unfolds into art, conversations, performances, music and meaningful connections.",
    context: "As the sun sets, Vinyasa becomes a shared creative space. Some things are planned and some emerge from the people who gather: open stages, artist showcases, spontaneous jams, installations, exhibitions and experiences.",
    exploreTitle: "What the evening holds",
    explore: ["Performances and open stages", "Artist showcases and exhibitions", "Conversations across creative disciplines", "Music, spontaneous jams and shared experiences", "Natural spaces and local, conscious choices", "The option to stay back and wake to a slower morning"],
    takeawayTitle: "Come as you are",
    takeaways: ["Come with your art", "Come with a story", "Come with a friend", "Come curious", "Leave with a collaboration, an idea, a conversation or a beautiful memory"],
    aboutTitle: "At the heart of Zariya is connection.",
    about: "Connection between artists and audiences, between different creative disciplines, and between celebration and a more conscious way of experiencing it. Zariya is our way of bringing people back together for the festive season.",
    cta: "Join the gathering",
  },
  "drishti-new-years-retreat": {
    introTitle: "A different kind of New Year.",
    intro: "Drishti is Vinyasa Earth's year-end retreat - three days to step away from the noise, look back at the year that has been, and create space for the one that is about to begin.",
    context: "Drishti means vision: the way we see, perceive and direct our attention. There is nowhere to rush to and nothing you need to become. These days invite you to notice what the year gave you, what it asked of you, what you are ready to leave behind and what you would like to carry forward.",
    exploreTitle: "The experience",
    explore: ["Slow mornings and movement practices", "Meditation, breathwork and time in nature", "Creative explorations and intimate conversations", "Shared meals, laughter and spaces for silence", "An intentional transition into the New Year", "Room to be part of the community or entirely your own"],
    takeawayTitle: "Who is Drishti for?",
    takeaways: ["Anyone who wants to end the year differently", "People arriving alone or with a friend", "Beginners and experienced practitioners alike", "Anyone willing to arrive, participate and give themselves three days", "Those looking for clarity rather than resolutions"],
    aboutTitle: "Sometimes, changing where you stand changes what you can see.",
    about: "Drishti is not a New Year's Eve party disguised as a retreat. It is a slower kind of beginning, rooted in movement, stillness, conversation, nature, creativity and community.",
    cta: "Reserve your place",
  },
  "performing-lab-retreat": {
    introTitle: "Where technique meets ritual, discipline meets play.",
    intro: "Performing Lab is a five-day residential intensive for performers, dancers, actors, theatre-makers, musicians, facilitators and creative explorers seeking a deeper artistic practice through movement, ritual, physical theatre and embodied creation.",
    context: "Led by internationally acclaimed theatre practitioner Sukh Ahlstrom, the lab combines physical theatre, Kalaripayattu, movement research, rhythm, voice, clowning and collective creation in the natural surroundings of Vinyasa Earth.",
    exploreTitle: "What you will explore",
    explore: ["Physical theatre and Kalaripayattu", "Body Weather and active meditations", "Clowning, pantomime and rhythm training", "Voice, singing and body percussion", "Contemporary movement and creative composition", "Training, laboratories, reflection and a final showcase"],
    takeawayTitle: "What you take home",
    takeaways: ["A wider physical and expressive range", "Practical tools for artistic creation and performance", "Stronger presence, improvisation and adaptability", "New movement qualities and creative strategies", "A renewed relationship with curiosity, play and artistic intuition", "An official certificate of participation"],
    aboutTitle: "Learn with Sukh Ahlstrom.",
    about: "Sukh is an international performing artist, director and educator with more than twenty years of experience across physical theatre, dance, martial arts, theatrical anthropology and embodied creative practices. Her work has reached artists and students across Chile, India, Denmark, Brazil, Serbia and Greenland.",
    passes: [{ name: "Early Bird Dorm", price: "Rs. 20,475", detail: "Shared dormitory accommodation. Limited seats available." }, { name: "Dorm Residency", price: "Rs. 24,150", detail: "Shared dormitory accommodation with the full residency experience." }, { name: "Mudhouse Residency", price: "Rs. 32,025", detail: "Twin-sharing earthen mudhouse accommodation." }, { name: "Artist Scholarship", price: "Rs. 15,015", detail: "Limited scholarship-supported dormitory seats for emerging artists and practitioners." }],
    cta: "Apply for Performing Lab",
  },
  "anhad-ka-baaja": {
    introTitle: "An evening of Kabir bhajans.",
    intro: "Anhad ka Baaja is an intimate evening of listening and singing along to the words of Sant Kabir. Led by Priyal, the evening invites us to slow down and experience poetry through music - not only as something to perform, but as something to feel, share and reflect upon.",
    context: "Come as you are. Listen quietly, sing along when you feel called, and spend an evening in the company of music, poetry and people. Food is not included in the ticket; guests can order from the Vinyasa kitchen before the event begins.",
    exploreTitle: "An evening to sit inside",
    explore: ["Kabir bhajans led by Priyal", "Listening as a shared practice", "Space to sing along or simply be present", "A welcome drink at Vinyasa Earth", "Music, poetry and conversation in community"],
    takeawayTitle: "With Priyal",
    takeaways: ["Musician and yoga teacher", "A bridge between science, spirituality and the arts", "Student of the oral traditions of Kabir, Nanak and Meera", "A musical journey shaped by two years learning with Prahlad Tipanya Ji"],
    aboutTitle: "Come listen, sing and spend an evening with Kabir.",
    about: "Priyal's work brings together music, yoga and meditation as tools for healing and self-discovery. Anhad ka Baaja marks a new step in his journey as he brings these bhajans to Vinyasa in his own voice.",
    passes: [{ name: "Entry", price: "Rs. 450 + GST", detail: "Per person. Includes a welcome drink; food can be ordered separately." }],
    cta: "Book your place",
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
  const content = await getEditorial("app/(site)/events/[slug]/page", editorialDefaults);

  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const image = event.image || content.EVENT_IMAGES[event.slug] || "/seed/grounds-06.jpg";
  const details = content.EVENT_DETAILS[event.slug];
  const priceLabel = event.priceFrom === 0 ? "By donation" : `₹${event.priceFrom.toLocaleString("en-IN")} + 18% GST`;
  const isPauseWithin = event.slug === "the-pause-within";
  const editorialEvent = EDITORIAL_EVENTS[event.slug];

  return (
    <>
      <PageHero framed={isPauseWithin || !!editorialEvent} eyebrow={isPauseWithin ? "A residential retreat" : editorialEvent ? event.kind : event.kind} title={event.name} description={event.description} image={image} imageAlt={event.name + " at Vinyasa Earth"}>
        {(isPauseWithin || editorialEvent) && <PaymentButton target={`event:${event.slug}`} href={`/events/${event.slug}/book`}  className="btn btn-accent">{editorialEvent?.cta ?? "Reserve your place"} <span aria-hidden>↗</span></PaymentButton>}
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
                  {PAUSE_WITHIN_CONTENT.passes.map((pass) => <div key={pass.name} className="py-5 first:pt-0 last:pb-0"><div className="flex items-baseline justify-between gap-3"><h3 className="font-semibold">{pass.name}</h3><span className="shrink-0 text-sm font-semibold text-accent">{pass.price.replace(/\s*\+\s*GST$/i, "")} + 18% GST</span></div><p className="mt-2 text-sm leading-6 text-foreground-soft">{pass.detail}</p></div>)}
                </div>
                <PaymentButton target={`event:${event.slug}`} href={`/events/${event.slug}/book`}  className="btn btn-accent mt-7 block text-center">Reserve your place <span aria-hidden>↗</span></PaymentButton>
              </div>
              <p className="mt-4 text-center text-xs leading-5 text-muted">Part of The Collective Body, Vinyasa Earth's Artist-in-Residence programme.</p>
            </aside>
          </section>
        </main>
      ) : editorialEvent ? (
        <main className="bg-background">
          <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{event.dateLabel || "Vinyasa Earth, Jaipur"}</p>
              <h2 className="mt-5 max-w-[18ch] font-display text-4xl leading-[1.08] text-foreground sm:text-5xl">{editorialEvent.introTitle}</h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft">{editorialEvent.intro}</p>
              <p className="mt-5 max-w-2xl leading-7 text-foreground-soft">{editorialEvent.context}</p>

              <div className="mt-12 grid border-y border-line py-6 sm:grid-cols-3 sm:divide-x sm:divide-line">
                <div className="pb-5 sm:px-5 sm:pb-0 sm:first:pl-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Duration</p><p className="mt-2 font-semibold">{event.durationLabel || "At Vinyasa Earth"}</p></div>
                <div className="border-t border-line pt-5 sm:border-t-0 sm:px-5 sm:pt-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Facilitator</p><p className="mt-2 font-semibold">{event.facilitator || "Vinyasa Earth"}</p></div>
                <div className="border-t border-line pt-5 sm:border-t-0 sm:px-5 sm:pt-0 sm:last:pr-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Venue</p><p className="mt-2 font-semibold">Vinyasa Earth, Jaipur</p></div>
              </div>

              <div className="mt-16 grid gap-12 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The experience</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight">{editorialEvent.exploreTitle}</h3>
                  <ul className="mt-6 space-y-4 text-foreground-soft">
                    {editorialEvent.explore.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />{item}</li>)}
                  </ul>
                </div>
                <div className="border-t border-line pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">A closer look</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight">{editorialEvent.takeawayTitle}</h3>
                  <ul className="mt-6 space-y-4 text-foreground-soft">
                    {editorialEvent.takeaways.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />{item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-16 border-t border-line pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Beyond the schedule</p>
                <h3 className="mt-4 max-w-xl font-display text-3xl leading-tight">{editorialEvent.aboutTitle}</h3>
                <p className="mt-5 max-w-2xl leading-7 text-foreground-soft">{editorialEvent.about}</p>
              </div>
            </div>

            <aside className="self-start lg:sticky lg:top-28">
              <div className="border border-line bg-surface p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{editorialEvent.passes ? "Ways to join" : "Make space for it"}</p>
                <p className="mt-3 text-sm leading-6 text-foreground-soft">{event.description}</p>
                {editorialEvent.passes ? <div className="mt-7 divide-y divide-line">{editorialEvent.passes.map((pass) => <div key={pass.name} className="py-5 first:pt-0 last:pb-0"><div className="flex items-baseline justify-between gap-3"><h3 className="font-semibold">{pass.name}</h3><span className="shrink-0 text-sm font-semibold text-accent">{pass.price.replace(/\s*\+\s*GST$/i, "")} + 18% GST</span></div><p className="mt-2 text-sm leading-6 text-foreground-soft">{pass.detail}</p></div>)}</div> : <p className="mt-7 border-y border-line py-5 text-2xl font-semibold">{priceLabel}</p>}
                <PaymentButton target={`event:${event.slug}`} href={`/events/${event.slug}/book`}  className="btn btn-accent mt-7 block text-center">{editorialEvent.cta} <span aria-hidden>↗</span></PaymentButton>
              </div>
              <p className="mt-4 text-center text-xs leading-5 text-muted">Vinyasa Earth, Jaipur</p>
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
            <PaymentButton target={`event:${event.slug}`} href={`/events/${event.slug}/book`}  className="btn btn-accent mt-5 block text-center">{content.text_8}</PaymentButton>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
