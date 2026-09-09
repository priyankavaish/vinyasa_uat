"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import heroStyles from "./page-hero.module.css";
import Image, { type StaticImageData } from "next/image";
import brandLogo from "./emblem-gold.png";
import { ParallaxHeroImage } from "../ui/parallax";

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
    <section data-hero className="home-hero relative flex min-h-[100svh] flex-col overflow-hidden text-background">
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
      <div className="hero-video-overlay absolute inset-0" />

      <div
        ref={contentRef}
        className="hero-content relative z-10 flex w-full flex-1 flex-col items-center justify-center px-5 pt-28 text-center sm:px-8"
      >
        <div className="hero-brand">
          <span className="hero-brand-emblem" aria-hidden="true">
            <Image
              src={brandLogo}
              alt=""
              priority
              sizes="(max-width: 639px) 96px, 128px"
              className="hero-brand-emblem-image"
            />
          </span>

          <p className="hero-brand-place">
            <span className="hero-brand-place-rule" aria-hidden />
            Jaipur, Rajasthan
            <span className="hero-brand-place-rule" aria-hidden />
          </p>

          <span className="hero-brand-kicker">A retreat for curious minds</span>

          <h1 className="hero-brand-name">
            <span className="hero-brand-name-primary">Vinyasa</span>
            <span className="hero-brand-name-secondary">Earth</span>
          </h1>

          <span className="hero-brand-divider" aria-hidden="true">
            <span className="hero-brand-divider-rule" />
            <svg className="hero-brand-lotus" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 19s-7-4-7-11c0-3 3-6 7-6s7 3 7 6c0 7-7 11-7 11Z" fill="currentColor" opacity=".9" />
              <path d="M16 19S4 17 2 10c-1-3 1-6 4-6 4 0 10 8 10 15Z" fill="currentColor" opacity=".55" />
              <path d="M16 19s12-2 14-9c1-3-1-6-4-6-4 0-10 8-10 15Z" fill="currentColor" opacity=".55" />
            </svg>
            <span className="hero-brand-divider-rule" />
          </span>

          <span className="hero-brand-values">Stay <i /> Create <i /> Connect</span>
        </div>

        {/* <p className="mt-7 max-w-[44ch] text-base leading-relaxed text-background/90">
          Slow down, create, and meet the people shaping what&apos;s next.
        </p> */}
        {/* <div className="hero-actions mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/book" className="btn btn-outline-light hero-book-button">
            Book your stay <span aria-hidden>↗</span>
          </Link>
        </div> */}
      </div>

    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  imagePosition = "50% 50%",
  mobileImagePosition,
  contain = false,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string | StaticImageData;
  imageAlt?: string;
  imagePosition?: string;
  mobileImagePosition?: string;
  contain?: boolean;
  children?: ReactNode;
}) {
  return (
    <section data-hero className={`${heroStyles.hero} ${contain ? heroStyles.heroContain : ""}`} style={{
      "--hero-position": imagePosition,
      "--hero-mobile-position": mobileImagePosition ?? imagePosition,
    } as CSSProperties}>
      {image && (contain ? (
        <Image src={image} alt={imageAlt} fill priority quality={95} sizes="100vw" className={heroStyles.imageContain} />
      ) : (
        <ParallaxHeroImage>
          <Image src={image} alt={imageAlt} fill priority quality={95} sizes="100vw" className={heroStyles.image} />
        </ParallaxHeroImage>
      ))}
      <div className={heroStyles.overlay} aria-hidden="true" />
      <div className={heroStyles.content}>
        <p
          className={`${heroStyles.eyebrow} animate__animated animate__fadeInLeft`}
          style={{ animationDuration: "0.7s" }}
        >
          {eyebrow}
        </p>
        <h1
          className={`${heroStyles.title} animate__animated animate__fadeInLeft`}
          style={{ animationDuration: "0.7s", animationDelay: "0.12s" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`${heroStyles.description} animate__animated animate__fadeInLeft`}
            style={{ animationDuration: "0.7s", animationDelay: "0.24s" }}
          >
            {description}
          </p>
        )}
        {children && (
          <div
            className={`${heroStyles.actions} animate__animated animate__fadeInLeft`}
            style={{ animationDuration: "0.7s", animationDelay: "0.36s" }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
