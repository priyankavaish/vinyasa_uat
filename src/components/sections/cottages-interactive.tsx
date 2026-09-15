"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_cottages_interactive";
import { useEditorial } from "@/components/editorial/provider";


import { useEffect, useRef, useState } from "react";
import Image from "@/components/editorial/image";
import Link from "next/link";
import { Icon, type IconName } from "../ui/icon";
import SectionEyebrow from "../ui/section-eyebrow";

export type RoomItem = {
  slug: string;
  name: string;
  element: string;
  tagline: string;
  icon: string;
  accent: string;
  pricePerNight: number;
  image: string;
  gallery: string[];
};

const inr = (n: number) => `\u20b9${n.toLocaleString("en-IN")}`;

export default function CottagesInteractive({ rooms }: { rooms: RoomItem[] }) {
  const content = useEditorial("components/sections/cottages-interactive", editorialDefaults);

  const [active, setActive] = useState(0);
  const [shot, setShot] = useState(0);
  const [heroRatio, setHeroRatio] = useState(4 / 3);
  const current = rooms[active] ?? rooms[0];
  const gallery = current?.gallery?.length ? current.gallery : current ? [current.image] : [];
  const hero = gallery[shot] ?? current?.image;

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShot(0);
    // keep the active cottage tab in view on the horizontally-scrolling strip
    const nav = tabsRef.current;
    const el = nav?.children[active] as HTMLElement | undefined;
    if (!nav || !el) return;
    const target = el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    if (rooms.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % rooms.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [rooms.length]);

  if (!current) return null;

  return (
    <section aria-labelledby="cottages-heading" className="relative isolate overflow-hidden bg-surface py-12 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="home-outline" className="justify-center">{content.text_1}</SectionEyebrow>
          <h2 id="cottages-heading" className="mt-3 font-display text-3xl leading-tight text-clay-ink sm:text-4xl lg:text-5xl">{content.text_2}</h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-sm leading-relaxed text-foreground-soft">{content.text_3}</p>
        </div>

        <div className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="min-w-0">
            <div className="relative mx-auto max-h-[32rem] transition-[aspect-ratio] duration-500 ease-out" style={{ aspectRatio: heroRatio }}>
              <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full border border-clay-ink/15 bg-clay-surface" />
              <div aria-hidden className="absolute -bottom-2 -right-2 h-full w-full bg-accent/10" />
              <Link href={`/stays/${current.slug}`} aria-label={`Explore ${current.name} cottage`} className="group relative block h-full w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(30,20,12,0.4)]">
                <Image
                  src={hero}
                  alt={`Inside ${current.name}, a hand-built cottage at Vinyasa Earth`}
                  fill
                  quality={95}
                  sizes="(min-width: 1280px) 620px, (min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      setHeroRatio(img.naturalWidth / img.naturalHeight);
                    }
                  }}
                />
              </Link>
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3" aria-label={`${current.name} gallery`}>
                {gallery.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    aria-pressed={shot === index}
                    aria-label={`${current.name} photo ${index + 1}`}
                    onClick={() => setShot(index)}
                    className={`relative aspect-square overflow-hidden border transition-colors ${shot === index ? "border-accent" : "border-clay-ink/15 hover:border-clay-ink/40"}`}
                  >
                    <Image src={src} alt="" fill sizes="110px" className={`object-cover transition-opacity ${shot === index ? "opacity-100" : "opacity-70 hover:opacity-100"}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 border border-clay-ink/10 bg-clay-surface/50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay-ink">{content.text_12}</p>
            <div ref={tabsRef} className="-mx-1 mt-4 flex flex-nowrap gap-x-3 overflow-x-auto scroll-smooth border-b border-clay-ink/20 px-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={content.aria_label_13}>
              {rooms.map((room, index) => (
                <button key={room.slug} type="button" aria-pressed={active === index} aria-controls="cottage-preview" onClick={() => setActive(index)} className={`min-h-11 shrink-0 whitespace-nowrap border-b px-1 py-2 font-display text-base transition-colors sm:text-lg ${active === index ? "border-accent text-accent" : "border-transparent text-foreground-soft hover:border-clay-ink/40 hover:text-clay-ink"}`}>
                  {room.name}
                </button>
              ))}
            </div>

            <article id="cottage-preview" className="pt-7 sm:pt-9">
              <div aria-live="polite" aria-atomic="true">
                <div className="flex items-center gap-3 text-clay-ink">
                  <Icon name={current.icon as IconName} size={18} />
                  <span className="text-xs uppercase tracking-[0.14em]">{current.element}</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-clay-ink/20" />
                  <span className="text-xs tabular-nums">{String(active + 1).padStart(2, "0")} / {String(rooms.length).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl leading-tight text-clay-ink sm:text-4xl">{current.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-soft">{current.tagline}</p>
              </div>
              <p className="mt-6 max-w-[40ch] text-sm leading-relaxed text-foreground-soft">{content.text_16}</p>
              <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
                <p className="text-xs text-foreground-soft">{content.text_17}<span className="mx-1 font-display text-2xl text-clay-ink">{inr(current.pricePerNight)}</span>{content.text_18}</p>
                <Link href={`/stays/${current.slug}`} className="btn btn-accent btn-sm inline-flex items-center">{content.text_19}</Link>
              </div>
            </article>
            <Link href={content.href_20} className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-clay-ink/30 text-xs font-semibold uppercase tracking-[0.12em] text-clay-ink transition-colors hover:text-accent">{content.text_21}{rooms.length}{content.text_22}<Icon name="arrow-forward-outline" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
