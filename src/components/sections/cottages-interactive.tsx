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

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="grid items-stretch gap-0 md:grid-cols-2">
        {/* live preview — left */}
        <div className="relative order-1 aspect-[16/11] w-full sm:aspect-[16/10] md:aspect-auto md:min-h-[34rem]">
          {rooms.map((r, i) => (
            <MediaFrame
              key={r.slug}
              src={r.image}
              alt={`${r.name} cottage at Vinyasa Earth`}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`transition-opacity duration-500 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <Link
            href={`/stays/${current.slug}`}
            className="group absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white sm:inset-x-6 sm:bottom-6"
            aria-label={`Open ${current.name}`}
          >
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/85">
                <Icon name={current.icon as IconName} size={11} />
                {current.element} · {current.tagline}
              </span>
              <span className="mt-1 block font-display text-3xl leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-4xl">
                {current.name}
              </span>
              <span className="mt-1.5 block text-sm text-white/85">
                from <span className="font-display text-lg">{inr(current.pricePerNight)}</span> / night
              </span>
            </span>
            <span className="btn btn-outline-light btn-sm inline-flex shrink-0">
              View room
            </span>
          </Link>
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
              <li key={r.slug} className="flex items-stretch gap-2">
                <button
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`flex flex-1 items-center gap-3 py-3 text-left transition-[padding-left,background-color] duration-200 ${
                    i === active ? "bg-clay-surface/60 pl-2" : ""
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
                  className="grid w-10 shrink-0 place-items-center self-stretch text-lg text-accent transition-transform duration-200 hover:translate-x-0.5"
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
