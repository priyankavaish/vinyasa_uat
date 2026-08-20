"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ParallaxHeroImage } from "./parallax";

export function HomeHero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {
      // iOS Low Power Mode may still choose the poster; keeping it is the
      // graceful fallback while normal mobile browsers autoplay the film.
    });
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
    <section className="home-hero relative flex min-h-[100svh] flex-col overflow-hidden text-background">
      <ParallaxHeroImage>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          poster="/images/hero-video-poster.jpg"
          className="hero-video absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </ParallaxHeroImage>
      <div className="absolute inset-0 bg-gradient-to-b from-[#15120b]/55 via-[#1c2418]/35 to-[#171108]/70" />

      <div
        ref={contentRef}
        className="hero-content relative z-10 flex w-full flex-1 flex-col items-center justify-center px-5 text-center sm:px-8"
      >
        <p className="mb-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-background/80">
          <span className="h-px w-6 bg-background/50" aria-hidden />
          Amer, Jaipur
          <span className="h-px w-6 bg-background/50" aria-hidden />
        </p>
        <div className="hero-brand" aria-label="Vinyasa Earth">
          <span className="hero-brand-kicker">A retreat for curious minds</span>
          <span className="hero-brand-vinyasa">Vinyasa Earth</span>
          <span className="hero-brand-rule" aria-hidden />
          <span className="hero-brand-earth">Stay · Create · Connect</span>
        </div>

        <p className="mt-7 max-w-[44ch] text-base leading-relaxed text-background/90">
          Slow down, create, and meet the people shaping what&apos;s next.
        </p>
        <div className="hero-actions mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/book" className="btn btn-book-stay hero-book-button">
            Book your stay <span aria-hidden>↗</span>
          </Link>
          <Link href="/events/artist-escape" className="btn btn-outline-light hero-secondary-action">
            Explore Artist Residencies
          </Link>
        </div>
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
