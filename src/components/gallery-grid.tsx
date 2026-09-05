"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Icon } from "./icon";

/** Uniform-size thumbnail grid — click any photo to see it full size in a
 *  lightbox (actual dimensions, zoomable, arrow/swipe through the set). */
export default function GalleryGrid({
  images,
  alt = "",
  className = "mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3",
}: {
  images: string[];
  alt?: string;
  className?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  if (!images.length) return null;

  return (
    <>
      <div className={className}>
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden border border-line"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <Icon name="expand-outline" size={13} />
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        open={index !== null}
        index={index ?? 0}
        close={() => setIndex(null)}
        slides={images.map((src) => ({ src }))}
      />
    </>
  );
}
