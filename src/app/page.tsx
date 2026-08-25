import Image from "next/image";
import Link from "next/link";
import chakkiLeft from "@/app/assets/chakki_left.png";
import decorativeHut from "@/app/assets/decorative-hut.png";
import huttFlorals from "@/app/assets/vine4.png";
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

      <section className="organic-section organic-stays relative mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Parallax
          speed={0.14}
          className="pointer-events-none absolute -top-6 right-10 z-0 w-28 opacity-40 sm:right-16 sm:w-36 lg:w-44"
        >
          <Image src={huttFlorals} alt="" aria-hidden="true" className="w-full rotate-[18deg]" />
        </Parallax>
        <Parallax
          speed={-0.1}
          className="organic-stays-hut -top-14 -right-6 w-36 opacity-95 sm:-top-16 sm:right-0 sm:w-48 lg:-top-20 lg:w-60"
        >
          <Image
            src={decorativeHut}
            alt=""
            aria-hidden="true"
            className="w-full drop-shadow-[0_20px_35px_rgba(75,45,25,0.28)]"
          />
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

      <div className="relative z-20 mx-auto max-w-6xl px-5 sm:px-8">
        <Parallax speed={0.045} className="pointer-events-none absolute -top-24 -left-8 w-32 opacity-90 sm:-top-28 sm:-left-10 sm:w-44 lg:-top-32 lg:-left-14 lg:w-48">
          <Image src={chakkiLeft} alt="" className="w-full rotate-[-3deg] drop-shadow-[0_18px_30px_rgba(75,55,35,0.25)]" aria-hidden="true" />
        </Parallax>
      </div>

      <CommunitySection />
      <PhotoMasonry />
      <GallerySection />
      <ReviewsSection />
    </>
  );
}
