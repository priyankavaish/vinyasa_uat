import Image from "next/image";
import Link from "next/link";
import chakki from "@/app/assets/chakki.png";
import clayPot from "@/app/assets/claypot.png";
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
import { Parallax, ParallaxHeroImage } from "@/components/parallax";
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

      <section className="organic-section organic-stays relative mx-auto max-w-6xl overflow-hidden px-5 py-20 sm:px-8">
        <Parallax speed={-0.055} className="pointer-events-none absolute -right-14 top-2 w-[16rem] sm:-right-8 sm:w-[22rem] lg:right-2 lg:top-4 lg:w-[26rem]">
          <Image src={chakki} alt="" className="w-full rotate-[-5deg] opacity-[0.12]" aria-hidden="true" />
        </Parallax>
        <Reveal className="relative z-10 mb-10 flex flex-wrap items-end justify-between gap-4">
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
        <div className="relative z-10 grid gap-5 sm:grid-cols-2">
          {featured.map((c, i) => (
            <CottageCard key={c.slug} cottage={c} featured={i === 0} index={i} />
          ))}
        </div>
      </section>

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
      <PhotoMasonry />
      <GallerySection />
      <ReviewsSection />
      <DiscountStripe />
      <LocationSection />
    </>
  );
}
