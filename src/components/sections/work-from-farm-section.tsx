
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_work_from_farm_section";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import Link from "next/link";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Icon, type IconName } from "../ui/icon";
import farmImage from "@/app/assets/IMG_4301-scaled.webp";

const perks: { icon: IconName; label: string }[] = [
  { icon: "wind-outline", label: "Wi-Fi & quiet corners" },
  { icon: "leaf-outline", label: "Community meals" },
  { icon: "home-outline", label: "Mudhouse or dorm" },
  { icon: "sunny-outline", label: "Farm walks" },
];

const points = [
  ["A desk with a horizon", "Open-air studios and shaded common spaces, not four more walls."],
  ["Work, then wander", "Log off to a farm walk, a shared meal, and easy company."],
];

export default async function WorkFromFarmSection() {
  const content = await getEditorial("components/sections/work-from-farm-section", editorialDefaults);

  return (
    <section className="organic-section relative overflow-hidden bg-clay-surface py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left" className="order-1">
          <SectionEyebrow icon="leaf-outline"><FormattedText value={content.text_1} /></SectionEyebrow>

          <h2 className="mt-3 font-display text-4xl leading-[1.03] sm:text-5xl"><FormattedText value={content.text_2} /><span className="mt-1 block text-accent"><FormattedText value={content.text_3} /></span>
          </h2>

          <p className="mt-4 max-w-[46ch] leading-relaxed text-foreground-soft"><FormattedText value={content.text_4} /></p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {content.perks.map((p) => (
              <li
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary/25 bg-secondary-surface px-3.5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary-ink"
              >
                <Icon name={p.icon} size={12} />
                <FormattedText value={p.label} />
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-0">
            {points.map(([title, body]) => (
              <div key={title} className="border-t border-line py-3.5 last:border-b">
                <h3 className="font-display text-base leading-snug text-foreground"><FormattedText value={title} /></h3>
                <p className="mt-1 text-sm leading-6 text-foreground-soft"><FormattedText value={body} /></p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={content.href_6} className="btn btn-accent inline-flex"><FormattedText value={content.text_7} links={false} /></Link>
            <Link href={content.href_8} className="btn btn-outline inline-flex"><FormattedText value={content.text_9} links={false} /></Link>
          </div>
        </Reveal>

        <Reveal variant="right" delay={100} className="order-2 relative">
          <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full border border-clay-ink/15 bg-clay-surface" />
          <div aria-hidden className="absolute -bottom-2 -right-2 h-full w-full bg-accent/10" />
          <figure className="group relative aspect-[4/5] w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(45,35,25,0.4)]">
            <Image
              src={content.farmImage}
              alt={content.alt_10}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white/90">
                <Icon name="location-outline" size={12} /><FormattedText value={content.text_11} /></span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
