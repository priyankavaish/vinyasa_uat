"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_stays_hero_gallery";
import { useEditorial } from "@/components/editorial/provider";


import Image from "@/components/editorial/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import styles from "./stays-hero-gallery.module.css";

export type StayHeroPhoto = { src: string; name: string; slug: string; element: string; date?: string };
const distance = (index: number, position: number, count: number) =>
  ((index - position + count * 100.5) % count) - count / 2;
const stayElementLabel = (element: string) => {
  if (element === "Stillness") return "A place for stillness";
  if (element === "Shared") return "Shared living";
  return `Inspired by ${element.toLowerCase()}`;
};

export default function StaysHeroGallery({ photos, variant = "stays" }: { photos: StayHeroPhoto[]; variant?: "stays" | "events" }) {
  const content = useEditorial("components/sections/stays-hero-gallery", editorialDefaults);

  const isEvents = variant === "events";
  const hero = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const position = useRef(photos.length > 4 ? 2 : 0);
  const current = useRef(position.current);
  const [active, setActive] = useState(position.current);

  const [compact, setCompact] = useState(false);
  const visibleRange = isEvents ? (compact ? 1.65 : 1.8) : (compact ? 1.5 : 2.5);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    const resize = () => setCompact(mobile.matches);
    resize();
    mobile.addEventListener("change", resize);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    const visibility = () => setHidden(document.hidden);
    update(); visibility();
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      mobile.removeEventListener("change", resize);
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    if (reduced) { el.style.setProperty("--stay-drift", "0px"); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty("--stay-drift", Math.max(0, Math.min(90, -el.getBoundingClientRect().top * .14)) + "px");
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); };
  }, [reduced]);

  function paint() {
    if (!photos.length) return;
    cards.current.forEach((card, index) => {
      if (!card) return;
      const d = distance(index, position.current, photos.length);
      const visible = d >= -visibleRange && d < visibleRange;
      card.style.setProperty("--offset", d * 100 + "%");
      card.style.setProperty("--tilt", `${d * 2.5}deg`);
      card.style.setProperty("--lift", `${Math.min(Math.abs(d), 2) * 18}px`);
      card.style.setProperty("--scale", String(1 - Math.min(Math.abs(d), 2) * .10));
      card.style.opacity = visible ? String(Math.min(1, (visibleRange - Math.abs(d)) * 5)) : "0";
      card.style.visibility = visible ? "visible" : "hidden";
      card.style.zIndex = String(Math.round(10 - Math.abs(d) * 3));
      card.dataset.visible = String(visible);
      card.tabIndex = visible ? 0 : -1;
      card.setAttribute("aria-hidden", String(!visible));
    });
    const next = Math.round(position.current) % photos.length;
    if (next !== current.current) {
      current.current = next;
      setActive(next);
    }
  }

  useEffect(() => {
    paint();
    if (photos.length < 2 || focused || reduced || hidden) return;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let previousProgress = 0;
    const tick = (time: number) => {
      if (last) {
        const delta = Math.min(time - last, 50);
        if (isEvents) {
          elapsed += delta;
          const cycle = Math.floor(elapsed / 2800);
          const glide = Math.max(0, (elapsed % 2800 - 1800) / 1000);
          const progress = cycle + (1 - Math.cos(Math.PI * glide)) / 2;
          position.current = (position.current - (progress - previousProgress) + photos.length) % photos.length;
          previousProgress = progress;
        } else {
          position.current = (position.current + delta / 5000) % photos.length;
        }
      }
      last = time;
      paint();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [photos.length, focused, reduced, hidden, compact, isEvents]);

  function move(direction: number) {
    position.current = (Math.round(position.current) + direction + photos.length) % photos.length;
    paint();
  }

  if (!photos.length) return null;
  return (
    <section ref={hero} data-hero className={`${styles.hero} ${isEvents ? styles.eventsHero : ""}`} aria-label={isEvents ? content.text_1 : content.text_2} aria-roledescription="carousel">
      <div className={styles.container}>
        <div className={styles.track}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
          {photos.map((photo, index) => {
            const d = distance(index, photos.length > 4 ? 2 : 0, photos.length);
            const visible = d >= -visibleRange && d < visibleRange;
            return <Link key={photo.src + index} ref={(el) => { cards.current[index] = el; }}
              href={`/${variant}/${photo.slug}`} className={styles.slide} aria-label={`Explore ${photo.name}`}
              data-visible={visible} data-active={index === active} aria-hidden={!visible} tabIndex={visible ? 0 : -1}
              style={{ "--offset": d * 100 + "%", "--scale": 1 - Math.min(Math.abs(d), 2) * .10, visibility: visible ? "visible" : "hidden" } as CSSProperties}>
              <span className={styles.imageLayer}><Image src={photo.src} alt={`${photo.name} at Vinyasa Earth`} fill
                priority={index < 5} loading={index < 5 ? undefined : "eager"}
                quality={80} sizes="(min-width: 640px) 1100px, 640px" className={styles.image} /></span>
              <span className={styles.caption}>
                <span className={styles.captionMeta}>
                  <span>{isEvents ? photo.element || "Upcoming programme" : stayElementLabel(photo.element || "nature")}</span>
                  {photo.date && <span className={styles.captionDate}>{photo.date}</span>}
                </span>
                <span className={styles.captionName}>{photo.name}</span>
              </span>
            </Link>;
          })}
        </div>
        <div className={styles.footer}>
          <div><p className={styles.eyebrow}>{isEvents ? content.text_7 : content.text_8}</p>
            <h1>{isEvents ? content.text_9 : content.text_10}</h1>
          </div>
          {photos.length > 1 && <div className={styles.controls}>
            <button type="button" onClick={() => move(-1)} aria-label={isEvents ? content.text_13 : content.text_14}><span className={styles.previous}><Icon name="arrow-forward-outline" size={18} /></span></button>
            <span className={styles.count}>{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => move(1)} aria-label={isEvents ? content.text_15 : content.text_16}><Icon name="arrow-forward-outline" size={18} /></button>
          </div>}
        </div>
      </div>
    </section>
  );
}
