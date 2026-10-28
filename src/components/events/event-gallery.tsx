"use client";

import GalleryCarouselGrid from "@/components/ui/gallery-carousel-grid";
import { Icon } from "@/components/ui/icon";
import type { EventGalleryPhoto } from "@/lib/event-gallery";
import { plainText } from "@/lib/editorial/text";
import styles from "./event-gallery.module.css";

export default function EventGallery({ photos, eventPhotos = false }: { photos: EventGalleryPhoto[]; eventPhotos?: boolean }) {
  if (!photos.length) return null;

  return <section id="event-gallery" className={styles.gallery} aria-labelledby="event-gallery-title">
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}><Icon name="camera-outline" size={16} /> A closer look</p><h2 id="event-gallery-title">{eventPhotos ? "Inside the experience" : "A glimpse of Vinyasa"}</h2></div>
    </div>
    <p className={styles.intro}>{eventPhotos ? "Take a look around before you join us." : "The spaces, people and quieter moments that make this place."}</p>
    <GalleryCarouselGrid perSlide={8} fourCol images={photos.map(photo => photo.src)} alt={plainText(photos[0].alt)} />
    <div className={styles.atmosphere} aria-label="The Vinyasa setting">
      <span><Icon name="leaf-outline" size={19} /> Closer to nature</span>
      <span><Icon name="people-outline" size={19} /> Art &amp; community</span>
      <span><Icon name="location-outline" size={19} /> Jaipur, Rajasthan</span>
    </div>
  </section>;
}
