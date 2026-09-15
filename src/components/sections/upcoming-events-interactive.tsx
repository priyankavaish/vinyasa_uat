"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_upcoming_events_interactive";
import { useEditorial } from "@/components/editorial/provider";


import { useEffect, useState } from "react";
import Image from "@/components/editorial/image";
import Link from "next/link";
import { Icon, type IconName } from "../ui/icon";
import MediaFrame from "../ui/media-frame";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";

export type EventItem = {
  slug: string;
  name: string;
  kind: string;
  dateLabel: string;
  priceFrom: number;
  image: string;
  month: string;
  day: number;
};

const KIND_META: Record<string, { icon: IconName; accent: string; label: string }> = {
  residency: { icon: "compass-outline", accent: "#8f3b31", label: "Residency" },
  retreat: { icon: "leaf-outline", accent: "#6b7a5e", label: "Retreat" },
  workshop: { icon: "sparkles-outline", accent: "#a06a2c", label: "Workshop" },
};
const priceText = (from: number) => (from === 0 ? "By donation" : `From ₹${from.toLocaleString("en-IN")}`);

export default function UpcomingEventsInteractive({ items }: { items: EventItem[] }) {
  const content = useEditorial("components/sections/upcoming-events-interactive", editorialDefaults);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [items.length]);

  const current = items[active] ?? items[0];
  if (!current) return null;

  const currentMeta = content.KIND_META[current.kind] ?? content.KIND_META.retreat;

  return (
    <section className="relative overflow-hidden bg-clay-surface">
      <div className="grid items-stretch gap-0 md:grid-cols-2">
        {/* content — left (below the image on mobile) */}
        <div className="order-2 flex flex-col justify-center px-5 py-12 sm:px-12 sm:py-16 md:order-1 md:px-16 lg:px-20">
          <Reveal variant="up">
            <SectionEyebrow icon="calendar-outline">{content.text_1}</SectionEyebrow>
            <h2 className="mt-4 max-w-[15ch] font-display text-4xl italic leading-[1.05] tracking-tight text-accent sm:text-5xl lg:text-[3.4rem]">{content.text_2}</h2>
            <span aria-hidden className="mt-5 block h-[3px] w-16 rounded-full bg-accent" />
            <p className="mt-5 max-w-[44ch] text-[17px] font-medium leading-relaxed text-foreground">{content.text_3}{" "}
              <span className="text-clay-ink">{content.text_4}</span>
            </p>
          </Reveal>

          <ul className="mt-7 border-t border-foreground/15">
            {items.map((it, i) => {
              const meta = content.KIND_META[it.kind] ?? content.KIND_META.retreat;
              return (
                <li
                  key={it.slug}
                  className={`flex items-stretch gap-2 border-b border-foreground/15 transition-colors duration-200 ${
                    i === active ? "bg-surface/60" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={i === active}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`grid flex-1 grid-cols-[auto_1fr] items-center gap-4 py-4 text-left transition-[padding-left] duration-200 ${
                      i === active ? "pl-2" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                    {i === active && it.image && (
                      <span className="relative hidden h-14 w-14 shrink-0 overflow-hidden border border-line sm:block">
                        <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                    )}
                    <span className="flex w-12 flex-col items-center border border-line bg-surface py-1 leading-none shadow-sm sm:w-14">
                      <span
                        className="text-[11px] font-bold uppercase tracking-[0.1em]"
                        style={{ color: meta.accent }}
                      >
                        {it.month}
                      </span>
                      <span className="font-display text-xl text-foreground sm:text-2xl">{it.day}</span>
                    </span>
                    </span>

                    <span className="min-w-0">
                      <span
                        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
                        style={{ color: meta.accent }}
                      >
                        <Icon name={meta.icon} size={11} />
                        {meta.label}
                      </span>
                      <span className="mt-0.5 block truncate font-display text-lg leading-snug text-foreground sm:text-xl">
                        {it.name}
                      </span>
                      <span className="block truncate text-xs text-foreground-soft">
                        {it.dateLabel} · {priceText(it.priceFrom)}
                      </span>
                    </span>
                  </button>

                  <Link
                    href={`/events/${it.slug}`}
                    aria-label={`Open ${it.name}`}
                    className="grid w-10 shrink-0 place-items-center self-stretch text-lg text-accent transition-transform duration-200 hover:translate-x-0.5"
                  >
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Link href={content.href_7} className="btn btn-accent inline-flex">{content.text_8}</Link>
          </div>
        </div>

        <div className="order-1 flex items-center px-5 py-8 sm:px-12 sm:py-12 md:py-14 lg:px-16 md:order-2">
          <div className="w-full">
          <div className="relative w-full">
            <div aria-hidden className="absolute -bottom-4 -right-4 hidden h-full w-full border border-clay-ink/15 bg-clay-surface sm:block" />
            <div aria-hidden className="absolute -bottom-2 -right-2 hidden h-full w-full bg-accent/10 sm:block" />
            <article className="relative w-full overflow-hidden border border-foreground/12 bg-surface shadow-[0_30px_60px_-28px_rgba(30,20,12,0.4)]">
              <Link href={`/events/${current.slug}`} className="group relative block aspect-square w-full sm:aspect-[6/5]" aria-label={`Open ${current.name}`}>
                <MediaFrame key={current.image} src={current.image} alt={current.name} sizes="(min-width: 768px) 50vw, 100vw" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <span
                  className="absolute left-4 top-4 inline-flex items-center gap-1.5 border border-white/60 bg-black/25 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
                >
                  <Icon name={currentMeta.icon} size={12} />
                  {currentMeta.label}
                </span>
                <span className="absolute inset-x-4 bottom-4">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                    {current.dateLabel}
                  </span>
                  <span className="mt-1 block font-display text-2xl leading-tight text-white sm:text-3xl">
                    {current.name}
                  </span>
                </span>
              </Link>
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
                <span className="font-display text-lg">{priceText(current.priceFrom)}</span>
                <Link href={`/events/${current.slug}`} className="btn btn-accent btn-sm inline-flex">{content.text_9}</Link>
              </div>
            </article>
          </div>
            {items.length > 1 && (
              <div className="mt-4 flex gap-2" role="tablist" aria-label={content.aria_label_12}>
                {items.map((it, i) => (
                  <button
                    key={it.slug}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={it.name}
                    onClick={() => setActive(i)}
                    className={`h-1 flex-1 transition-colors ${i === active ? "bg-accent" : "bg-foreground/15 hover:bg-foreground/30"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>


      </div>
    </section>
  );
}
