import AnimatedButtonArrow from "@/components/ui/animated-button-arrow";
import SeasonalEventContent from "@/components/events/seasonal-event-content";

import FormattedText from "@/components/editorial/formatted-text";
import PaymentButton from "@/components/ui/payment-button";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__events__slug__page";
import { getEditorial } from "@/lib/editorial/server";
import EventDetailHero from "@/components/events/event-detail-hero";
import EventGallery from "@/components/events/event-gallery";
import { eventGalleryKey, eventGallerySettings, eventGalleryPhotos, eventVenuePhotos } from "@/lib/event-gallery";
import styles from "@/components/events/event-detail.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import EventDetailsContent from "@/components/events/event-details-content";
import { splitEventContent } from "@/lib/event-content";
import ArtistUniteContent from "@/components/events/artist-unite-content";
import ArtistResidencyContent from "@/components/events/artist-residency-content";
import { getEvent, getEvents, getContent } from "@/lib/cms";
import EventHosts from "@/components/events/event-hosts";
import { eventHostsKey, eventHostSettings } from "@/lib/event-hosts";
import { legacyEventHosts } from "@/lib/event-hosts-legacy";

export const revalidate = 300;

const EVENT_IMAGES: Record<string, string> = {
  "artist-in-residence": "/seed/community-05.jpg",
  "anhad-ka-baaja": "/seed/community-02.jpg",
  "the-pause-within": "/seed/grounds-08.jpg",
  "artist-unite": "/seed/community-06.jpg",
  zariya: "/seed/community-01.jpg",
  "drishti-new-years-retreat": "/seed/grounds-05.jpg",
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
  const genericContent = splitEventContent(event.bodyHtml || "");
  const priceLabel = event.priceFrom === 0 ? "By donation" : `₹${event.priceFrom.toLocaleString("en-IN")} + 18% GST`;
  const seasonalEvent = content.SEASONAL_EVENTS[event.slug as keyof typeof content.SEASONAL_EVENTS];
  const [savedHosts, savedGallery] = await Promise.all([
    getContent(eventHostsKey(event.slug)),
    getContent(eventGalleryKey(event.slug)),
  ]);
  const gallery = eventGallerySettings(savedGallery);
  const galleryPhotos = eventGalleryPhotos(gallery, event.name, eventVenuePhotos);
  const { hosts, heading: hostHeading } = eventHostSettings(savedHosts, legacyEventHosts(seasonalEvent));
  const isArtistUnite = event.slug === "artist-unite";
  const isArtistResidency = event.slug === "artist-in-residence";
  const isPauseWithin = event.slug === "the-pause-within";
  const editorialEvent = content.EDITORIAL_EVENTS[event.slug];
  const PAUSE_WITHIN_CONTENT = content.PAUSE_WITHIN_CONTENT;
  const bookingLabel = isArtistResidency ? "Apply to join" : isArtistUnite ? content.ARTIST_UNITE.priceLabel : seasonalEvent?.href.includes("/contact") ? "Enquire for details" : event.priceFrom > 0 ? "From \u20b9" + event.priceFrom.toLocaleString("en-IN") + " + GST" : "By donation";

  return (
    <div className={styles.page}>
      <EventDetailHero hostSection={hosts.length ? <EventHosts hosts={hosts} heading={hostHeading} /> : undefined} name={event.name} kind={event.kind} description={event.description} image={image} bookingLabel={bookingLabel} time={seasonalEvent?.timeLabel || (isArtistResidency ? content.ARTIST_IN_RESIDENCE.timeLabel : isArtistUnite ? content.ARTIST_UNITE.timeLabel : undefined)} date={event.dateLabel || seasonalEvent?.dateLabel || (isArtistResidency ? content.ARTIST_IN_RESIDENCE.dateLabel : isArtistUnite ? content.ARTIST_UNITE.dateLabel : undefined)} duration={event.durationLabel} facilitator={event.facilitator}>
        {seasonalEvent ? <Link href={seasonalEvent.href} className="btn btn-accent"><FormattedText value={seasonalEvent.cta} links={false} /> <AnimatedButtonArrow /></Link> : isArtistResidency ? <Link href="#residency-application" className="btn btn-accent"><FormattedText value={content.ARTIST_IN_RESIDENCE.applyCta} links={false} /> <AnimatedButtonArrow /></Link> : isArtistUnite ? <Link href="#artist-unite-application" className="btn btn-accent"><FormattedText value={content.ARTIST_UNITE.applyCta} links={false} /> <AnimatedButtonArrow /></Link> : <PaymentButton animatedArrow target={`event:${event.slug}`} href={`/events/${event.slug}/book`}  className="btn btn-accent"><FormattedText value={editorialEvent?.cta ?? "Reserve your place"} links={false} /> </PaymentButton>}
      </EventDetailHero>
      <nav aria-label="Event page sections" className={styles.sectionNav}><div><a href="#event-overview">Overview</a>{galleryPhotos.length > 0 && <a href="#event-gallery">Gallery</a>}{(seasonalEvent || isArtistResidency || isArtistUnite || genericContent.sections.length > 0 || (!event.bodyHtml && details?.highlights.length)) && <a href="#event-programme">Programme</a>}{!!hosts.length && <a href="#event-hosts">{hostHeading}</a>}<a href="#event-registration">How to join <Icon name="arrow-forward-outline" size={14} /></a></div></nav>
      <div id="event-overview" className={styles.details}>
      <EventGallery photos={galleryPhotos} eventPhotos={gallery.images.length > 0} />

      {seasonalEvent ? (
        <SeasonalEventContent content={seasonalEvent} />
      ) : isArtistResidency ? (
        <ArtistResidencyContent content={content.ARTIST_IN_RESIDENCE} />
      ) : isArtistUnite ? (
        <ArtistUniteContent content={content.ARTIST_UNITE} />
      ) : isPauseWithin ? (
        <main className="bg-background">
          <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20 lg:pb-24 lg:pt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">18-20 September 2026</p>
              <h2 className="mt-5 max-w-[16ch] font-display text-4xl leading-[1.08] text-foreground sm:text-5xl">A little space to listen inward.</h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft"><FormattedText value={PAUSE_WITHIN_CONTENT.intro} /></p>
              <p className="mt-5 max-w-2xl leading-7 text-foreground-soft"><FormattedText value={PAUSE_WITHIN_CONTENT.context} /></p>

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
                    {PAUSE_WITHIN_CONTENT.explore.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" /><FormattedText value={item} /></li>)}
                  </ul>
                </div>
                <div className="border-t border-line pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">A gentle takeaway</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight">What you may take back</h3>
                  <ul className="mt-6 space-y-4 text-foreground-soft">
                    {PAUSE_WITHIN_CONTENT.takeBack.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" /><FormattedText value={item} /></li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-16 border-t border-line pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About Nikita</p>
                <h3 className="mt-4 font-display text-3xl leading-tight">A body-led way of paying attention.</h3>
                <p className="mt-5 max-w-2xl leading-7 text-foreground-soft">Nikita Chawda is a somatic therapist and Play Movement Educator who works with adults navigating trauma, stress and shame. Her approach is not about fixing, changing or controlling the body and mind. She creates the time, space and support needed to meet ourselves where we are and reconnect with the vitality within us.</p>
              </div>
            </div>

            <aside id="event-registration" className="self-start lg:sticky lg:top-28">
              <div className="border border-line bg-surface p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Choose your pass</p>
                <p className="mt-3 text-sm leading-6 text-foreground-soft">Come with curiosity. There is nothing to fix and nowhere particular to arrive.</p>
                <div className="mt-7 divide-y divide-line">
                  {PAUSE_WITHIN_CONTENT.passes.map((pass) => <div key={pass.name} className="py-5 first:pt-0 last:pb-0"><div className="flex items-baseline justify-between gap-3"><h3 className="font-semibold"><FormattedText value={pass.name} /></h3><span className="shrink-0 text-sm font-semibold text-accent"><FormattedText value={pass.price.replace(/\s*\+\s*GST$/i, "")} /> + 18% GST</span></div><p className="mt-2 text-sm leading-6 text-foreground-soft"><FormattedText value={pass.detail} /></p></div>)}
                </div>
                <PaymentButton animatedArrow target={`event:${event.slug}`} href={`/events/${event.slug}/book`}  className="btn btn-accent mt-7 block text-center">Reserve your place </PaymentButton>
              </div>
              <p className="mt-4 text-center text-xs leading-5 text-muted">Part of The Collective Body, Vinyasa Earth's Artist-in-Residence programme.</p>
            </aside>
          </section>
        </main>
      ) : editorialEvent ? (
        <main className="bg-background">
          <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20 lg:pb-24 lg:pt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"><FormattedText value={event.dateLabel || "Vinyasa Earth, Jaipur"} /></p>
              <h2 className="mt-5 max-w-[18ch] font-display text-4xl leading-[1.08] text-foreground sm:text-5xl"><FormattedText value={editorialEvent.introTitle} /></h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft"><FormattedText value={editorialEvent.intro} /></p>
              <p className="mt-5 max-w-2xl leading-7 text-foreground-soft"><FormattedText value={editorialEvent.context} /></p>

              <div className="mt-12 grid border-y border-line py-6 sm:grid-cols-3 sm:divide-x sm:divide-line">
                <div className="pb-5 sm:px-5 sm:pb-0 sm:first:pl-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Duration</p><p className="mt-2 font-semibold"><FormattedText value={event.durationLabel || "At Vinyasa Earth"} /></p></div>
                <div className="border-t border-line pt-5 sm:border-t-0 sm:px-5 sm:pt-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Facilitator</p><p className="mt-2 font-semibold"><FormattedText value={event.facilitator || "Vinyasa Earth"} /></p></div>
                <div className="border-t border-line pt-5 sm:border-t-0 sm:px-5 sm:pt-0 sm:last:pr-0"><p className="text-xs uppercase tracking-[0.16em] text-muted">Venue</p><p className="mt-2 font-semibold">Vinyasa Earth, Jaipur</p></div>
              </div>

              <div className="mt-16 grid gap-12 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The experience</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight"><FormattedText value={editorialEvent.exploreTitle} /></h3>
                  <ul className="mt-6 space-y-4 text-foreground-soft">
                    {editorialEvent.explore.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" /><FormattedText value={item} /></li>)}
                  </ul>
                </div>
                <div className="border-t border-line pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">A closer look</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight"><FormattedText value={editorialEvent.takeawayTitle} /></h3>
                  <ul className="mt-6 space-y-4 text-foreground-soft">
                    {editorialEvent.takeaways.map((item) => <li key={item} className="flex gap-3 leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" /><FormattedText value={item} /></li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-16 border-t border-line pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Beyond the schedule</p>
                <h3 className="mt-4 max-w-xl font-display text-3xl leading-tight"><FormattedText value={editorialEvent.aboutTitle} /></h3>
                <p className="mt-5 max-w-2xl leading-7 text-foreground-soft"><FormattedText value={editorialEvent.about} /></p>
              </div>
            </div>

            <aside id="event-registration" className="self-start lg:sticky lg:top-28">
              <div className="border border-line bg-surface p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"><FormattedText value={editorialEvent.passes ? "Ways to join" : "Make space for it"} /></p>
                <p className="mt-3 text-sm leading-6 text-foreground-soft"><FormattedText value={event.description} /></p>
                {editorialEvent.passes ? <div className="mt-7 divide-y divide-line">{editorialEvent.passes.map((pass) => <div key={pass.name} className="py-5 first:pt-0 last:pb-0"><div className="flex items-baseline justify-between gap-3"><h3 className="font-semibold"><FormattedText value={pass.name} /></h3><span className="shrink-0 text-sm font-semibold text-accent"><FormattedText value={pass.price.replace(/\s*\+\s*GST$/i, "")} /> + 18% GST</span></div><p className="mt-2 text-sm leading-6 text-foreground-soft"><FormattedText value={pass.detail} /></p></div>)}</div> : <p className="mt-7 border-y border-line py-5 text-2xl font-semibold"><FormattedText value={priceLabel} /></p>}
                <PaymentButton animatedArrow target={`event:${event.slug}`} href={`/events/${event.slug}/book`}  className="btn btn-accent mt-7 block text-center"><FormattedText value={editorialEvent.cta} links={false} /> </PaymentButton>
              </div>
              <p className="mt-4 text-center text-xs leading-5 text-muted">Vinyasa Earth, Jaipur</p>
            </aside>
          </section>
        </main>
      ) : (
        <EventDetailsContent event={event} content={genericContent} fallback={details} priceLabel={priceLabel} />
      )}
      </div>
    </div>
  );
}
