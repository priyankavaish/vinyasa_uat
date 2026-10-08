"use client";
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_photo_masonry";
import { useEditorial } from "@/components/editorial/provider";


import { useCallback, useEffect, useState } from "react";
import Image from "@/components/editorial/image";
import Lightbox from "yet-another-react-lightbox";
import useEmblaCarousel from "embla-carousel-react";
import "yet-another-react-lightbox/styles.css";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Icon } from "../ui/icon";

export default function PhotoMasonry() {
  const content = useEditorial("components/sections/photo-masonry", editorialDefaults);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!emblaApi.internalEngine().dragHandler.pointerDown()) emblaApi.scrollNext();
    }, 3200);
    return () => window.clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-dusk-surface py-12 sm:py-16">

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal variant="up" className="mb-7">
          <SectionEyebrow icon="images-outline"><FormattedText value={content.text_1} /></SectionEyebrow>
          <h2 className="mt-3 max-w-[26ch] font-display text-4xl leading-tight"><FormattedText value={content.text_2} /></h2>
        </Reveal>
      </div>

      <Reveal variant="up" delay={150} className="place-carousel relative z-10">
        <div ref={emblaRef} className="place-carousel-viewport cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="place-carousel-track flex touch-pan-y gap-4 pl-5 sm:gap-6 sm:pl-8">
            {content.placePhotos.map((photo, i) => (
              <div key={`${photo.image}-${i}`} className="place-carousel-slide min-w-0 shrink-0">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block aspect-[4/5] w-44 cursor-pointer overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] shadow-[0_18px_40px_-24px_rgba(30,20,12,0.35)] transition-shadow duration-300 hover:shadow-[0_24px_54px_-20px_rgba(30,20,12,0.45)] sm:w-56"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 27vw, (min-width: 640px) 38vw, 68vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
                    <Icon name="expand-outline" size={15} />
                  </span>
                  <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <FormattedText value={String(i + 1).padStart(2, "0")} links={false} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl items-center justify-between px-5 sm:justify-end sm:px-8">
          <span className="text-[12px] font-bold uppercase tracking-[.2em] text-dusk-ink/65 sm:hidden"><FormattedText value={content.text_3} /></span>
          <div className="flex gap-2 p-1">
            <button type="button" onClick={scrollPrev} aria-label={content.aria_label_4} className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-dusk-ink hover:text-dusk-surface">
              <Icon name="arrow-forward-outline" size={15} className="rotate-180" />
            </button>
            <button type="button" onClick={scrollNext} aria-label={content.aria_label_5} className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-dusk-ink hover:text-dusk-surface">
              <Icon name="arrow-forward-outline" size={15} />
            </button>
          </div>
        </div>
      </Reveal>

      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={content.placePhotos.map((p) => ({ src: p.image, alt: p.alt }))}
      />
    </section>
  );
}
