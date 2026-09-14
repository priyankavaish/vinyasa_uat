"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_photo_masonry";
import { useEditorial } from "@/components/editorial/provider";


import { useCallback, useEffect, useState } from "react";
import Image from "@/components/editorial/image";
import Lightbox from "yet-another-react-lightbox";
import useEmblaCarousel from "embla-carousel-react";
import "yet-another-react-lightbox/styles.css";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Parallax } from "../ui/parallax";
import { Icon } from "../ui/icon";

export default function PhotoMasonry() {
  const content = useEditorial("components/sections/photo-masonry", editorialDefaults);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelected = () => setSelected(emblaApi.selectedScrollSnap());
    updateSelected();
    emblaApi.on("select", updateSelected);
    return () => { emblaApi.off("select", updateSelected); };
  }, [emblaApi]);

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
          <SectionEyebrow icon="images-outline">{content.text_1}</SectionEyebrow>
          <h2 className="mt-3 max-w-[26ch] font-display text-4xl leading-tight">{content.text_2}</h2>
        </Reveal>
      </div>

      <Reveal variant="up" delay={150} className="place-carousel relative z-10">
        <div ref={emblaRef} className="place-carousel-viewport cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="place-carousel-track flex touch-pan-y pl-5 sm:pl-8">
            {content.placePhotos.map((photo, i) => (
              <div key={`${photo.image}-${i}`} className="place-carousel-slide min-w-0 shrink-0 pr-3 sm:pr-4">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block h-64 w-full cursor-pointer overflow-hidden rounded-none border border-line sm:h-80"
                >
                  <Parallax enabled speed={i % 2 === 0 ? 0.045 : -0.045} className="absolute inset-[-9%]">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 43vw, 82vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Parallax>
                  <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm" aria-hidden>
                    <Icon name="expand-outline" size={14} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between px-5 sm:px-8">
          <span className="text-[12px] font-bold uppercase tracking-[.2em] text-dusk-ink/65 sm:hidden">{content.text_3}</span>
          <span className="hidden text-xs tabular-nums text-dusk-ink/60 sm:block">{String(selected + 1).padStart(2, "0")} / {String(content.placePhotos.length).padStart(2, "0")}</span>
          <div className="flex gap-2">
            <button type="button" onClick={scrollPrev} aria-label={content.aria_label_4} className="grid h-10 w-10 place-items-center rounded-full border border-dusk-ink/35 transition-colors hover:bg-dusk-ink hover:text-dusk-surface">
              <Icon name="arrow-forward-outline" size={16} className="rotate-180" />
            </button>
            <button type="button" onClick={scrollNext} aria-label={content.aria_label_5} className="grid h-10 w-10 place-items-center rounded-full border border-dusk-ink/35 transition-colors hover:bg-dusk-ink hover:text-dusk-surface">
              <Icon name="arrow-forward-outline" size={16} />
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
