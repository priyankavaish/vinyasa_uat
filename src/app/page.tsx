import Link from "next/link";
import { HomeHero } from "@/components/hero";
import MarqueeBar from "@/components/marquee-bar";
import SectionEyebrow from "@/components/section-eyebrow";
import CottageCard from "@/components/cottage-card";
import EventCard from "@/components/event-card";
import ReviewsSection from "@/components/reviews-section";
import GallerySection from "@/components/gallery-section";
import LocationSection from "@/components/location-section";
import CommunitySection from "@/components/community-section";
import PhotoMasonry from "@/components/photo-masonry";
import DiscountStripe from "@/components/discount-stripe";
import ConnectSection from "@/components/connect-section";
import { Reveal } from "@/components/reveal";
import { cottages, events } from "@/lib/content";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const featured = cottages.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <>
      <HomeHero />
      <MarqueeBar />
      <ConnectSection />

      <section className="organic-section organic-stays mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow icon="home-outline">The Cottages</SectionEyebrow>
            <h2 className="mt-3 max-w-[22ch] font-display italic text-4xl leading-tight">
              Six cottages. Each made by hand.
            </h2>
          </div>
          <Link href="/stays" className="text-xs tracking-[0.08em] uppercase text-accent underline">
            View all stays
          </Link>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((c, i) => (
            <CottageCard key={c.slug} cottage={c} featured={i === 0} index={i} />
          ))}
        </div>
      </section>

      <section className="organic-section organic-events bg-clay-surface py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="left" className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionEyebrow icon="calendar-outline">Events &amp; Retreats</SectionEyebrow>
              <h2 className="mt-3 max-w-[24ch] font-display italic text-4xl leading-tight">
                Time and space to make what matters
              </h2>
            </div>
            <Link href="/events" className="text-xs tracking-[0.08em] uppercase text-accent underline">
              View all programs
            </Link>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {upcomingEvents.map((e, i) => (
              <EventCard key={e.slug} event={e} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CommunitySection />
      <DiscountStripe />
      <PhotoMasonry />
      <GallerySection />
      <ReviewsSection />
      <LocationSection />
    </>
  );
}
