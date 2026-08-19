"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ParallaxHeroImage } from "./parallax";
import MaskedHeading from "./MaskedHeading";
import EarthTypewriter from "./EarthTypewriter";

export function HomeHero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / (vh * 0.85), 0), 1);
      el.style.opacity = `${1 - progress}`;
      el.style.transform = `translate3d(0, ${(progress * 60).toFixed(1)}px, 0) scale(${(1 - progress * 0.06).toFixed(3)})`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100vh] flex-col overflow-hidden text-background">
      <ParallaxHeroImage>
        {reducedMotion ? (
          <Image
            src="/images/hero-video-poster.jpg"
            alt="Sunrise over the fields at Vinyasa Earth"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-video-poster.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}
      </ParallaxHeroImage>
      <div className="absolute inset-0 bg-gradient-to-b from-[#241c10]/45 via-[#2f3a26]/15 to-[#1a1408]/50" />

      <div
        ref={contentRef}
        className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-5 pt-24 text-center sm:px-8"
      >
        <p className="mb-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-background/80">
          <span className="h-px w-6 bg-background/50" aria-hidden />
          Amer, Jaipur
          <span className="h-px w-6 bg-background/50" aria-hidden />
        </p>
        <MaskedHeading
          text="Vinyasa"
          mediaType="video"
          src="/videos/hero.mp4"
          poster="/images/hero-video-poster.jpg"
          fillScale={1.15}
          parallax={14}
          reveal="rise"
          trigger="view"
          duration={1.3}
          stagger={0.08}
          align="center"
          weight={600}
          tracking={-0.02}
          lineHeight={0.95}
          textScale={0.105}
          brightness={1.15}
          saturation={1.2}
          className="max-w-full"
        />
        <EarthTypewriter className="mt-3 text-[9vw] font-normal leading-[0.9] tracking-[-0.02em] sm:text-5xl lg:text-6xl" />

        <div className="mt-10 flex w-full max-w-4xl items-center justify-between gap-6 text-xs font-semibold uppercase tracking-[0.22em] max-sm:hidden">
          <span className="text-[#e8a15c]">A home</span>
          <span className="h-px flex-1 bg-background/30" />
          <span className="text-[#9db388]">Grown from the earth</span>
          <span className="h-px flex-1 bg-background/30" />
          <span className="text-[#e0b0d0]">You return to</span>
        </div>

        <p className="mt-8 max-w-[38ch] text-base leading-relaxed text-background/85">
          Yoga. Earth. One community.
          Live, create, belong.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/book" className="btn btn-outline-light">
            Check Availability
          </Link>
          <Link href="/events/artist-escape" className="btn btn-outline-light">
            Explore Artist Residencies
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 pb-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-background/60">
        <span className="h-8 w-px animate-pulse bg-background/40" aria-hidden />
        Scroll
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
}) {
  if (image) {
    return (
      <section className="relative flex h-[46vh] min-h-[340px] items-end overflow-hidden text-background">
        <ParallaxHeroImage>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        </ParallaxHeroImage>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8">
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] before:h-px before:w-7 before:bg-background/60 before:content-['']">
            {eyebrow}
          </p>
          <h1 className="max-w-[22ch] text-balance font-display italic text-4xl leading-tight sm:text-5xl">
            {title}
          </h1>
          {description && <p className="mt-4 max-w-[60ch] text-background/85 leading-relaxed">{description}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-line bg-surface px-5 pb-16 pt-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow flex items-center gap-3 before:h-px before:w-7 before:bg-accent before:content-['']">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-[22ch] text-balance font-display italic text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-[60ch] text-foreground-soft leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
