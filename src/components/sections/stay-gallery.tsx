"use client";
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_stay_gallery";
import { useEditorial } from "@/components/editorial/provider";


import { useState } from "react";
import Image from "@/components/editorial/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Icon } from "@/components/ui/icon";
import styles from "./stay-gallery.module.css";

export default function StayGallery({ images, name }: { images: string[]; name: string }) {
  const content = useEditorial("components/sections/stay-gallery", editorialDefaults);

  const [index, setIndex] = useState<number | null>(null);
  const photos = [...new Set(images.filter(Boolean))];
  if (!photos.length) return null;
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid} data-count={Math.min(photos.length, 5)}>
        {photos.slice(0, 5).map((src, i) => (
          <button key={src} type="button" className={styles.photo}
            onClick={() => setIndex(i)} aria-label={`Open ${name} photo ${i + 1} of ${photos.length}`}>
            <Image src={src} alt={`${name} at Vinyasa Earth, photo ${i + 1}`} fill
              priority={i === 0} sizes={i === 0 ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              className={styles.image} />
          </button>
        ))}
      </div>
      <button type="button" className={styles.all} onClick={() => setIndex(0)}>
        <Icon name="images-outline" size={16} /><FormattedText value={content.text_3} links={false} />{photos.length}<FormattedText value={content.text_4} links={false} /></button>
      <Lightbox open={index !== null} index={index ?? 0} close={() => setIndex(null)}
        slides={photos.map((src, i) => ({ src, alt: `${name}, photo ${i + 1}` }))} />
    </div>
  );
}
