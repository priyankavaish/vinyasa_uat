import Image from "next/image";
import Link from "next/link";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Icon, type IconName } from "../ui/icon";
import farmImage from "@/app/assets/IMG_4301-scaled.webp";

const perks: { icon: IconName; label: string }[] = [
  { icon: "wind-outline", label: "Wi-Fi & quiet corners" },
  { icon: "leaf-outline", label: "Community meals" },
  { icon: "home-outline", label: "Cottage or dorm" },
  { icon: "sunny-outline", label: "Farm walks" },
];

const points = [
  [
    "A desk with a horizon",
    "Open-air studios and shaded common spaces instead of another day between four walls.",
  ],
  [
    "Work, then wander",
    "Stay connected when you need to, then reset with a farm walk, a shared meal, and easy company.",
  ],
  [
    "Stay for your rhythm",
    "Take an earth-built cottage or a dorm bed and shape the day around your own work.",
  ],
];

export default function WorkFromFarmSection() {
  return (
    <section className="organic-section relative overflow-hidden bg-clay-surface py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left" className="order-1">
          <SectionEyebrow icon="leaf-outline">A different way to work</SectionEyebrow>

          <h2 className="mt-4 font-display text-4xl leading-[1.03] sm:text-5xl">
            Work From Farm
            <span className="mt-1 block font-script text-3xl text-accent sm:text-[2.75rem]">
              at Vinyasa
            </span>
          </h2>

          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-foreground-soft">
            Step away from the work-from-home routine without stepping away from work. Bring your
            laptop and your project; find focus among mud cottages, open skies and a living creative
            community — close to Jaipur, far from its rush.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {perks.map((p) => (
              <li
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary/25 bg-secondary-surface px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary-ink"
              >
                <Icon name={p.icon} size={12} />
                {p.label}
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-0">
            {points.map(([title, body], i) => (
              <div key={title} className="flex gap-4 border-t border-line py-4 last:border-b">
                <span className="font-display text-2xl leading-none text-accent/60 tabular-nums">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-foreground-soft">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-accent inline-flex">
              Plan your work stay
            </Link>
            <Link href="/contact" className="btn btn-outline inline-flex">
              Ask us anything
            </Link>
          </div>
        </Reveal>

        <Reveal variant="right" delay={100} className="order-2">
          <figure className="relative aspect-[4/5] w-full overflow-hidden border border-line shadow-[0_1.5rem_3.5rem_rgba(74,52,35,0.14)]">
            <Image
              src={farmImage}
              alt="Working from the grounds at Vinyasa Earth"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90">
                <Icon name="location-outline" size={12} />
                Maheshwas · Jaipur
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
