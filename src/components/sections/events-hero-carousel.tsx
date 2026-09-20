"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_events_hero_carousel";
import { useEditorial } from "@/components/editorial/provider";


import Image from "@/components/editorial/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";

export type EventSlide = {
  slug: string;
  name: string;
  date: string;
  image: string;
  label: string;
  icon: IconName;
  accent: string;
};

// A full-bleed hero carousel of the upcoming programmes. Images are always
// `object-cover` inside a fixed-height frame, so they crop rather than stretch.
export default function EventsHeroCarousel({ slides }: { slides: EventSlide[] }) {
  const content = useEditorial("components/sections/events-hero-carousel", editorialDefaults);

  const n = slides.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setIdx((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % n), 5500);
    return () => window.clearInterval(t);
  }, [n, paused]);

  if (n === 0) return null;
  const cur = slides[idx];

  return (
    <section
      aria-roledescription="carousel"
      aria-label={content.aria_label_1}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[52vh] min-h-[20rem] w-full overflow-hidden border border-line bg-clay-ink shadow-[0_28px_64px_-34px_rgba(45,35,25,0.45)] sm:h-[54vh] lg:h-[32rem]"
    >
      {slides.map((s, i) => (
        <div
          key={s.slug || i}
          aria-hidden={i !== idx}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="(min-width: 1152px) 1152px, 100vw"
            quality={90}
            className="object-cover"
            style={{ objectPosition: "50% 38%" }}
          />
        </div>
      ))}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent sm:w-2/3"
      />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="px-6 pb-12 pt-14 sm:px-10 sm:pb-14">
          <span className="inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white/90 sm:text-[11px]">
            <span
              className="grid h-5 w-5 place-items-center rounded-full"
              style={{ backgroundColor: cur.accent }}
            >
              <Icon name={cur.icon} size={11} className="text-white" />
            </span>
            {cur.label}
          </span>
          <h2 className="mt-3 max-w-[18ch] font-display text-2xl italic leading-[1.1] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] sm:text-3xl lg:text-4xl">
            {cur.name}
          </h2>
          {cur.date && (
            <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 sm:text-xs">
              {cur.date}
            </p>
          )}
          {cur.slug && (
            <Link
              href={`/events/${cur.slug}`}
              className="mt-5 inline-flex items-center gap-2 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-accent shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
            >{content.text_4}<Icon name="arrow-forward-outline" size={13} />
            </Link>
          )}
        </div>
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={content.aria_label_7}
            className="absolute right-14 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-16 sm:top-5"
          >
            <Icon name="arrow-forward-outline" size={15} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={content.aria_label_8}
            className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-6 sm:top-5"
          >
            <Icon name="arrow-forward-outline" size={15} />
          </button>

          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.slug || i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show ${s.name}`}
                aria-current={i === idx}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-7 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
