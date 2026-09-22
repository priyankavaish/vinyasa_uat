"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Icon } from "./icon";

/** A swipeable carousel where each slide is a 3x2 grid of bigger photos —
 *  for a gallery with more images than comfortably fits in one row.
 *  Click any photo to open the full set in a lightbox. */
export default function GalleryCarouselGrid({
  images,
  alt = "",
  perSlide = 4,
  masonry = false,
  rounded = false,
  square = false,
}: {
  images: string[];
  alt?: string;
  perSlide?: number;
  masonry?: boolean;
  rounded?: boolean;
  square?: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > perSlide, align: "start" });

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
    if (!emblaApi || images.length <= perSlide || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => emblaApi.scrollNext(), 4500);
    return () => window.clearInterval(timer);
  }, [emblaApi, images.length, perSlide]);

  if (!images.length) return null;

  const slides: string[][] = [];
  for (let i = 0; i < images.length; i += perSlide) slides.push(images.slice(i, i + perSlide));

  return (
    <>
      <div ref={emblaRef} className="cursor-grab overflow-hidden active:cursor-grabbing">
        <div className="flex touch-pan-y">
          {slides.map((slide, si) => (
            <div key={si} className="min-w-0 shrink-0 grow-0 basis-full">
              <div className={masonry ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3" : "grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3"}>
                {slide.map((src, ii) => {
                  const globalIndex = si * perSlide + ii;
                  return (
                    <button
                      key={`${src}-${globalIndex}`}
                      type="button"
                      onClick={() => setLightboxIndex(globalIndex)}
                      className={`group relative overflow-hidden border border-line ${rounded ? "rounded-tl-[2rem] rounded-br-[2rem]" : ""} ${square ? "aspect-square" : masonry && (ii === 0 || ii === 5) ? "aspect-[3/4] md:row-span-2 md:aspect-auto md:h-full" : "aspect-[4/3]"}`}
                    >
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(min-width: 768px) 30vw, 45vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <Icon name="expand-outline" size={13} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs tabular-nums text-foreground-soft">
            {String(selected + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous photos"
              className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors hover:bg-line/40"
            >
              <Icon name="arrow-forward-outline" size={15} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next photos"
              className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors hover:bg-line/40"
            >
              <Icon name="arrow-forward-outline" size={15} />
            </button>
          </div>
        </div>
      ) : null}

      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={images.map((src) => ({ src }))}
      />
    </>
  );
}
