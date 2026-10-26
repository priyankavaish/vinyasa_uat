"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useEmblaCarousel from "embla-carousel-react";
import Image from "@/components/editorial/image";
import { Icon } from "@/components/ui/icon";
import type { EventGalleryPhoto } from "@/lib/event-gallery";
import { plainText } from "@/lib/editorial/text";
import "yet-another-react-lightbox/styles.css";
import styles from "./event-gallery.module.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

export default function EventGallery({ photos, eventPhotos = false }: { photos: EventGalleryPhoto[]; eventPhotos?: boolean }) {
  const [viewport, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", loop: false });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(photos.length > 1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const section = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [playRequested, setPlayRequested] = useState(false);
  const wantsPlayback = !paused && (!reducedMotion || playRequested);
  const autoplay = wantsPlayback && !hovered && !focused && !dragging && inView && pageVisible && lightbox === null;
  const update = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap()); setCanPrev(api.canScrollPrev()); setCanNext(api.canScrollNext());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    update(); api.on("select", update).on("reInit", update);
    return () => { api.off("select", update).off("reInit", update); };
  }, [api, update]);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motion.matches);
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 });
    if (section.current) observer.observe(section.current);
    syncMotion(); syncVisibility();
    motion.addEventListener("change", syncMotion); document.addEventListener("visibilitychange", syncVisibility);
    return () => { observer.disconnect(); motion.removeEventListener("change", syncMotion); document.removeEventListener("visibilitychange", syncVisibility); };
  }, [photos.length]);
  useEffect(() => {
    if (!api) return;
    const down = () => setDragging(true), up = () => setDragging(false);
    api.on("pointerDown", down).on("pointerUp", up);
    return () => { api.off("pointerDown", down).off("pointerUp", up); };
  }, [api]);
  useEffect(() => {
    if (!api || photos.length < 2 || !autoplay || api.scrollSnapList().length < 2) return;
    const timer = window.setTimeout(() => {
      if (api.canScrollNext()) api.scrollNext(reducedMotion); else api.scrollTo(0, reducedMotion);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [api, photos.length, selected, autoplay, reducedMotion]);
  const move = (direction: "next" | "prev") => {
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (direction === "next") api?.scrollNext(instant); else api?.scrollPrev(instant);
  };
  if (!photos.length) return null;

  return <section ref={section} id="event-gallery" className={styles.gallery} aria-labelledby="event-gallery-title" data-gallery-index={selected}
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}
    onFocusCapture={event => { if (event.target.matches(":focus-visible")) setFocused(true); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}><Icon name="camera-outline" size={16} /> A closer look</p><h2 id="event-gallery-title">{eventPhotos ? "Inside the experience" : "A glimpse of Vinyasa"}</h2></div>
      {photos.length > 1 && <div className={styles.controls}>
        <button type="button" aria-label="Previous gallery photo" aria-controls="event-gallery-photos" disabled={!canPrev} onClick={() => move("prev")}><Icon name="arrow-forward-outline" size={20} className={styles.previous} /></button>
        <button type="button" aria-label="Next gallery photo" aria-controls="event-gallery-photos" disabled={!canNext} onClick={() => move("next")}><Icon name="arrow-forward-outline" size={20} /></button>
      </div>}
    </div>
    <p className={styles.intro}>{eventPhotos ? "Take a look around before you join us." : "The spaces, people and quieter moments that make this place."}</p>
    <div ref={viewport} id="event-gallery-photos" className={styles.viewport} tabIndex={photos.length > 1 ? 0 : undefined} role="region" aria-roledescription="carousel" aria-label="Event photo gallery" onKeyDown={event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? "next" : "prev"); }
    }}>
      <div className={styles.track}>{photos.map((photo, index) => <div key={photo.src} className={styles.slide} role="group" aria-roledescription="slide" aria-label={(index + 1) + " of " + photos.length}>
        <button type="button" className={styles.photo} onClick={() => setLightbox(index)} aria-label={"Open photo " + (index + 1) + " fullscreen"}>
          <Image src={photo.src} alt={plainText(photo.alt)} fill sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 80vw" className={styles.image} quality={80} />
          <span className={styles.expand}><Icon name="expand-outline" size={16} /><span>View photo</span></span>
        </button>
      </div>)}</div>
    </div>
    <div className={styles.galleryFooter}>
      <p role="status" aria-live={autoplay ? "off" : "polite"} aria-atomic="true"><span className={styles.current}>{String(selected + 1).padStart(2, "0")}</span> / {String(photos.length).padStart(2, "0")}{photos.length > 1 && <span className={styles.hint}>Swipe to explore</span>}</p>
      <div className={styles.playback}>
        {photos.length > 1 && <button type="button" aria-label={wantsPlayback ? "Pause gallery slideshow" : "Play gallery slideshow"} onClick={() => { setPaused(wantsPlayback); setPlayRequested(!wantsPlayback && reducedMotion); setFocused(false); }}>{wantsPlayback ? "Pause" : "Play"}</button>}
        <span className={styles.progress} aria-hidden="true"><span style={{ width: ((selected + 1) / photos.length * 100) + "%" }} /></span>
      </div>
    </div>
    <div className={styles.atmosphere} aria-label="The Vinyasa setting">
      <span><Icon name="leaf-outline" size={19} /> Closer to nature</span>
      <span><Icon name="people-outline" size={19} /> Art &amp; community</span>
      <span><Icon name="location-outline" size={19} /> Jaipur, Rajasthan</span>
    </div>
    {lightbox !== null && <Lightbox open index={lightbox} close={() => setLightbox(null)} slides={photos.map(photo => ({ src: photo.src, alt: plainText(photo.alt) }))} carousel={{ finite: true }} controller={{ closeOnBackdropClick: true }} />}
  </section>;
}
