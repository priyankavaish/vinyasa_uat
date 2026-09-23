
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_connect_section";
import { getEditorial } from "@/lib/editorial/server";
import type { ReactNode } from "react";
import Image from "@/components/editorial/image";
import SectionWave from "../ui/section-wave";
import eventsTileImage from "@/app/assets/events-tile-community.png";
import corporateTileImage from "@/app/assets/IMG_2429.jpeg";
import artistTileImage from "@/app/assets/2N0A9983.JPG";
import Link from "next/link";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Parallax } from "../ui/parallax";
import { Icon } from "../ui/icon";

// Each block previews the page it links to, so it borrows that page's own
// hero/identity photo rather than a fresh one.
const FEATURE = {
  title: "Artist Escapes",
  href: "/stays#artist-escape",
  image: artistTileImage,
  blurb:
    "Weeks to build, paint, or write alongside a resident community — an affordable stay-with-meals program for creative practitioners.",
};

const PAIR = [
  {
    title: "Events",
    href: "/events",
    image: eventsTileImage,
    blurb:
      "Residencies, retreats and workshops — a rotating calendar for makers who want a week or a month among people building their own thing.",
  },
  {
    title: "Corporate Offsites",
    href: "/volunteering",
    image: corporateTileImage,
    blurb:
      "Team retreats grounded in the desert, not a boardroom — slow mornings, shared meals, and the conversations that don't happen back at the office.",
  },
] as const;

// `afterFirst` lets the home page drop a full section (Work From Farm) between
// the feature block and the Events/Corporate pair.
export default async function ConnectSection({ afterFirst }: { afterFirst?: ReactNode }) {
  const content = await getEditorial("components/sections/connect-section", editorialDefaults);

  return (
    <section className="relative overflow-hidden pt-10 text-foreground sm:pt-14">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal variant="up">
          <SectionEyebrow tone="secondary" icon="compass-outline" className="justify-center">{content.text_1}</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl">{content.text_2}</h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-foreground">{content.text_3}</p>
        </Reveal>
      </div>

      {/* feature — one full-bleed row */}
      <div className="mt-10 sm:mt-14">
        <div className="mx-auto grid max-w-[100rem] items-center gap-0 md:grid-cols-2 md:gap-4 lg:gap-6">
          <Reveal variant="up" className="relative w-full md:p-4 lg:p-6">
            <div aria-hidden className="absolute -bottom-4 -right-4 hidden h-[calc(100%-2rem)] w-[calc(100%-2rem)] border border-accent/30 bg-clay-surface md:block lg:-bottom-5 lg:-right-5 lg:h-[calc(100%-3rem)] lg:w-[calc(100%-3rem)]" />
            <div aria-hidden className="absolute -bottom-2 -right-2 hidden h-[calc(100%-2rem)] w-[calc(100%-2rem)] bg-accent/15 md:block lg:-bottom-3 lg:-right-3 lg:h-[calc(100%-3rem)] lg:w-[calc(100%-3rem)]" />
            <div className="group relative aspect-[4/3] w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(45,35,25,0.4)] sm:aspect-[16/10] md:aspect-[4/3]">
              <Image
                src={content.FEATURE.image}
                alt=""
                fill
                quality={80}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Reveal>

          <Reveal
            variant="up"
            delay={200}
            className="px-6 py-14 sm:px-12 sm:py-16 md:px-16 lg:px-20"
          >
            <span aria-hidden className="mb-4 block h-px w-10 bg-accent/45" />
            <h3 className="max-w-[16ch] font-display text-3xl leading-tight sm:text-4xl">
              {content.FEATURE.title}
            </h3>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-foreground">
              {content.FEATURE.blurb}
            </p>
            <Link
              href={content.FEATURE.href}
              className="group mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c9713f] transition-[gap] duration-300 hover:gap-3.5"
            >
              {content.text_4}
              <Icon name="arrow-forward-outline" size={13} />
            </Link>
          </Reveal>
        </div>
      </div>

      {afterFirst && (
        <div className="mt-10 sm:mt-14">
          <SectionWave from="#fff1e0" to="#f3e6d8" variant="wave" />
          {afterFirst}
          <SectionWave from="#f3e6d8" to="#fff1e0" variant="wave" />

        </div>
      )}

      {/* Events + Corporate — alternating editorial rows, echoing the
          feature block above instead of a generic matched-card grid. */}
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Reveal variant="up" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow tone="secondary" icon="calendar-outline" className="justify-center">{content.text_5}</SectionEyebrow>
          <h3 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{content.text_6}</h3>
        </Reveal>

        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
          {content.PAIR.map((card, i) => (
            <Reveal key={card.href} variant="up" delay={i * 120}>
              <Link
                href={card.href}
                className={`group grid items-center gap-6 sm:gap-10 md:grid-cols-2 md:gap-14 ${
                  i === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative">
                  <div aria-hidden className={`absolute -bottom-4 h-full w-full border border-clay-ink/15 bg-clay-surface ${i === 1 ? "-left-4" : "-right-4"}`} />
                  <div aria-hidden className={`absolute -bottom-2 h-full w-full bg-accent/10 ${i === 1 ? "-left-2" : "-right-2"}`} />
                  <div className="relative aspect-[16/10] w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(45,35,25,0.4)]">
                    <Parallax enabled speed={i === 0 ? 0.05 : -0.05} className="absolute inset-[-9%]">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      quality={80}
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Parallax>
                  </div>
                </div>
                <div>
                  <span className="font-display text-sm italic text-accent/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="mt-2 mb-3 block h-px w-10 bg-accent/45" />
                  <h4 className="font-display text-2xl leading-tight sm:text-3xl">{card.title}</h4>
                  <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-foreground-soft sm:text-base">
                    {card.blurb}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-[gap] duration-300 group-hover:gap-3.5">
                    {content.text_8}
                    <Icon name="arrow-forward-outline" size={13} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
