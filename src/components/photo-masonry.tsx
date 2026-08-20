"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import useEmblaCarousel from "embla-carousel-react";
import "yet-another-react-lightbox/styles.css";
import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { placePhotos } from "@/lib/content";

export default function PhotoMasonry() {
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
    <section className="bg-dusk-surface py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal variant="scale" className="mb-10">
          <SectionEyebrow icon="images-outline">The place, in pictures</SectionEyebrow>
          <h2 className="mt-3 max-w-[26ch] font-display italic text-4xl leading-tight">
            Cottages, gardens, and the fort down the road
          </h2>
        </Reveal>
      </div>

      <Reveal variant="fade" className="place-carousel">
        <div ref={emblaRef} className="place-carousel-viewport cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="place-carousel-track flex touch-pan-y pl-5 sm:pl-8">
            {placePhotos.map((photo, i) => (
              <div key={photo.image} className="place-carousel-slide min-w-0 shrink-0 pr-3 sm:pr-4">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block h-64 w-full overflow-hidden border border-line sm:h-80"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 43vw, 82vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-sm text-white backdrop-blur-sm" aria-hidden>↗</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between px-5 sm:px-8">
          <span className="text-[10px] font-bold uppercase tracking-[.2em] text-dusk-ink/65 sm:hidden">Swipe to explore</span>
          <span className="hidden text-xs tabular-nums text-dusk-ink/60 sm:block">{String(selected + 1).padStart(2, "0")} / {String(placePhotos.length).padStart(2, "0")}</span>
          <div className="flex gap-2">
            <button type="button" onClick={scrollPrev} aria-label="Previous photo" className="grid h-10 w-10 place-items-center rounded-full border border-dusk-ink/35 text-lg transition-colors hover:bg-dusk-ink hover:text-dusk-surface">←</button>
            <button type="button" onClick={scrollNext} aria-label="Next photo" className="grid h-10 w-10 place-items-center rounded-full border border-dusk-ink/35 text-lg transition-colors hover:bg-dusk-ink hover:text-dusk-surface">→</button>
          </div>
        </div>
      </Reveal>

      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={placePhotos.map((p) => ({ src: p.image, alt: p.alt }))}
      />
    </section>
  );
}
