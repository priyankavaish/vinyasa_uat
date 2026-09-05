import Link from "next/link";
import { HomeHero } from "@/components/sections/hero";
import MarqueeBar from "@/components/sections/marquee-bar";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import CottageCard from "@/components/cards/cottage-card";
import GallerySection from "@/components/sections/gallery-section";
import CommunitySection from "@/components/sections/community-section";
import WorkFromFarmSection from "@/components/sections/work-from-farm-section";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
import PhotoMasonry from "@/components/sections/photo-masonry";
import ConnectSection from "@/components/sections/connect-section";
import { LaceDivider } from "@/components/ui/lace-divider";
import { Reveal } from "@/components/ui/reveal";
import { getCottages, getContent } from "@/lib/cms";

export const metadata = { alternates: { canonical: "/" } };
export const revalidate = 300;

export default async function HomePage() {
  const [cottages, copy] = await Promise.all([
    getCottages(),
    getContent<{ eyebrow?: string; heading?: string }>("home.cottages"),
  ]);
  const featured = cottages.slice(0, 3);

  return (
    <div className="home-page-theme">
      <style>{`
        .home-page-theme {
          background-color: #fff1e0;
        }
      `}</style>
      <HomeHero />
      <MarqueeBar />
      <ConnectSection />
      <LaceDivider variant="white" className="-mt-14 sm:-mt-16" />
      <WorkFromFarmSection />
      <CommunitySection />
      <LaceDivider variant="white" upsideDown />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal variant="up" className="mx-auto mb-14 max-w-2xl text-center">
          <SectionEyebrow icon="home-outline" className="justify-center">
            {copy?.eyebrow ?? "The Cottages"}
          </SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            {copy?.heading ?? "Seven rooms. Each made by hand."}
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((c, i) => (
            <CottageCard key={c.slug} cottage={c} featured index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/stays" className="text-xs tracking-[0.08em] uppercase text-accent underline">
            View all stays
          </Link>
        </div>
      </section>

      <UpcomingEventsSection />

      <PhotoMasonry />
      <GallerySection />
      <LaceDivider variant="white" />
    </div>
  );
}
