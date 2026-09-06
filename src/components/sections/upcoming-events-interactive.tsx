"use client";

import { useState } from "react";
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
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <section className="relative overflow-hidden bg-clay-surface">
      <div className="grid items-stretch gap-0 md:grid-cols-2">
        {/* content — left (below the image on mobile) */}
        <div className="order-2 flex flex-col justify-center px-5 py-12 sm:px-12 sm:py-16 md:order-1 md:px-16 lg:px-20">
          <Reveal variant="up">
            <SectionEyebrow icon="calendar-outline">What&apos;s coming up</SectionEyebrow>
            <h2 className="mt-3 max-w-[16ch] font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
              The next dates on the calendar
            </h2>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-foreground-soft">
              Residencies, retreats and workshops — closest first. Small by design, so write early to
              hold a place.
            </p>
          </Reveal>

          <ul className="mt-7 border-t border-foreground/15" onMouseLeave={() => setActive(0)}>
            {items.map((it, i) => {
              const meta = KIND_META[it.kind] ?? KIND_META.retreat;
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
                    <span className="flex w-12 flex-col items-center rounded border border-line bg-surface py-1 leading-none shadow-sm sm:w-14">
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.1em]"
                        style={{ color: meta.accent }}
                      >
                        {it.month}
                      </span>
                      <span className="font-display text-xl text-foreground sm:text-2xl">{it.day}</span>
                    </span>

                    <span className="min-w-0">
                      <span
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em]"
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
            <Link href="/events" className="btn btn-accent inline-flex">
              See the full calendar
            </Link>
          </div>
        </div>

        {/* live preview — image (above the list on mobile) */}
        <Link
          href={`/events/${current.slug}`}
          className="group relative order-1 aspect-[4/3] w-full md:order-2 md:aspect-auto md:min-h-[32rem]"
          aria-label={`Open ${current.name}`}
        >
          {items.map((it, i) => (
            <MediaFrame
              key={it.slug}
              src={it.image}
              alt={it.name}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`transition-opacity duration-500 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
              {current.month} {current.day}
            </span>
            <span className="mt-1 block max-w-[24ch] font-display text-3xl leading-tight">
              {current.name}
            </span>
            <span className="btn btn-outline-light btn-sm mt-3 inline-flex shrink-0">
              View programme
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
