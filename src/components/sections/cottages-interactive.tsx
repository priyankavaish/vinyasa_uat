"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "../ui/icon";
import MediaFrame from "../ui/media-frame";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";

export type RoomItem = {
  slug: string;
  name: string;
  element: string;
  tagline: string;
  icon: string;
  accent: string;
  pricePerNight: number;
  image: string;
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CottagesInteractive({ rooms }: { rooms: RoomItem[] }) {
  const [active, setActive] = useState(0);
  const current = rooms[active] ?? rooms[0];
  if (!current) return null;

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="grid items-stretch gap-0 md:grid-cols-2">
        <div className="order-1 flex items-center px-5 py-8 sm:px-12 sm:py-12 md:py-14 lg:px-16 ">
          <article className="w-full overflow-hidden border border-line bg-surface">
            <Link href={`/stays/${current.slug}`} className="relative block aspect-square w-full" aria-label={`Open ${current.name}`}>
              <MediaFrame key={current.image} src={current.image} alt={current.name} sizes="(min-width: 768px) 50vw, 100vw" />
            </Link>
            <div className="border-t border-line p-5 sm:p-7">
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-secondary">{current.element} &middot; {current.tagline}</span>
              <h3 className="mt-2 font-display text-3xl leading-tight">{current.name}</h3>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <span className="font-display text-lg">from {inr(current.pricePerNight)} / night</span>
                <Link href={`/stays/${current.slug}`} className="btn btn-secondary btn-sm inline-flex">View room</Link>
              </div>
            </div>
          </article>
        </div>

        {/* room index — right */}
        <Reveal
          variant="right"
          className="order-2 flex flex-col justify-center px-5 py-12 sm:px-12 sm:py-16 md:px-16 lg:px-20"
        >
          <SectionEyebrow tone="secondary" icon="home-outline">
            The Cottages
          </SectionEyebrow>
          <h2 className="mt-3 max-w-[16ch] font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Seven rooms, each made by hand
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-foreground-soft">
            Mud-plastered rooms named for the elements — hover a room to see it, tap through to its
            own page.
          </p>

          <ul className="mt-6 divide-y divide-line border-y border-line" onMouseLeave={() => setActive(0)}>
            {rooms.map((r, i) => (
              <li
                key={r.slug}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group flex items-stretch gap-2 transition-colors duration-200 ${
                  i === active ? "bg-clay-surface/60" : ""
                }`}
              >
                <button
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                  className={`flex flex-1 items-center gap-3 py-3 text-left transition-[padding-left,background-color] duration-200 ${
                    i === active ? "pl-2" : ""
                  }`}
                >
                  <span className="shrink-0" style={{ color: r.accent }}>
                    <Icon name={r.icon as IconName} size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg text-foreground">{r.name}</span>
                    <span className="block truncate text-xs text-foreground-soft">
                      {r.element} · {r.tagline}
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-sm text-foreground">
                    {inr(r.pricePerNight)}
                  </span>
                </button>
                <Link
                  href={`/stays/${r.slug}`}
                  aria-label={`Open ${r.name}`}
                  className="grid w-10 shrink-0 place-items-center self-stretch text-lg text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5"
                >
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <Link href="/stays" className="btn btn-secondary inline-flex">
              View all {rooms.length} rooms
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
