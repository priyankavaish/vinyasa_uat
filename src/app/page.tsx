import Image from "next/image";
import Link from "next/link";
import chakkiLeft from "@/app/assets/chakki_left.png";
import { HomeHero } from "@/components/hero";
import MarqueeBar from "@/components/marquee-bar";
import SectionEyebrow from "@/components/section-eyebrow";
import CottageCard from "@/components/cottage-card";
import ReviewsSection from "@/components/reviews-section";
import GallerySection from "@/components/gallery-section";
import CommunitySection from "@/components/community-section";
import PhotoMasonry from "@/components/photo-masonry";
import ConnectSection from "@/components/connect-section";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { cottages } from "@/lib/content";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const featured = cottages.slice(0, 3);

  return (
    <>
      <HomeHero />
      <MarqueeBar />
      <ConnectSection />

      <section className="organic-section organic-stays relative mx-auto max-w-6xl overflow-hidden px-5 py-20 sm:px-8">
        <Parallax speed={0.045} className="pointer-events-none absolute -bottom-12 -left-12 z-[-1] w-32 opacity-70 sm:-bottom-20 sm:-left-20 sm:w-48 lg:-bottom-24 lg:-left-24 lg:w-60">
          <Image src={chakkiLeft} alt="" className="w-full rotate-[-3deg]" aria-hidden="true" />
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

      <CommunitySection />
      <PhotoMasonry />
      <GallerySection />
      <ReviewsSection />
    </>
  );
}
