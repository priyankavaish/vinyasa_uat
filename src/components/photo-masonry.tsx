"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { placePhotos } from "@/lib/content";

// A continuously auto-scrolling strip (same translateX-loop technique as the
// MarqueeBar text ticker, applied to photo tiles) — pauses on hover, opens a
// full-screen lightbox on click. Every real property/location photo lives
// here in one loop instead of being split across two separate galleries.
const loop = [...placePhotos, ...placePhotos];

export default function PhotoMasonry() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

      <Reveal variant="fade" className="group overflow-hidden">
        <div className="flex w-max animate-[place-scroll_38s_linear_infinite] gap-4 px-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:px-8">
          {loop.map((photo, i) => (
            <button
              key={`${photo.image}-${i}`}
              type="button"
              onClick={() => setLightboxIndex(i % placePhotos.length)}
              className="relative block h-64 w-56 shrink-0 overflow-hidden border border-line sm:h-80 sm:w-72"
            >
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                sizes="288px"
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </button>
          ))}
        </div>
      </Reveal>

      <style>{`
        @keyframes place-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={placePhotos.map((p) => ({ src: p.image, alt: p.alt }))}
      />
    </section>
  );
}
