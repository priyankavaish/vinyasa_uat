import Image from "next/image";
import Link from "next/link";
import { getCottages, getContent } from "@/lib/cms";
import { Icon, type IconName } from "../ui/icon";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Parallax } from "../ui/parallax";

const FALLBACK = [
  "/images/property-cottages-day.jpg",
  "/images/property-night-gathering.jpg",
  "/images/property-lawn-gazebo.jpg",
];

function priceLabel(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function CottagesPreview() {
  const [cottages, copy] = await Promise.all([
    getCottages(),
    getContent<{ eyebrow?: string; heading?: string }>("home.cottages"),
  ]);
  const [feature, ...rest] = cottages.slice(0, 3);
  if (!feature) return null;

  return (
    <section className="relative overflow-hidden border-y border-line bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* editorial header */}
        <Reveal variant="up">
          <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <SectionEyebrow icon="home-outline">{copy?.eyebrow ?? "The Cottages"}</SectionEyebrow>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
                {copy?.heading ?? "Seven rooms. Each made by hand."}
              </h2>
              <p className="mt-4 leading-relaxed text-foreground-soft">
                Hand-plastered mud rooms named for the elements — no two alike, each shaped around
                the light, the air, and the way you want to rest.
              </p>
            </div>
            <Link
              href="/stays"
              className="group inline-flex w-fit items-center gap-2 border border-foreground/25 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              All seven rooms
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* feature cottage */}
          <Reveal variant="scale" className="lg:row-span-2">
            <Link
              href={`/stays/${feature.slug}`}
              className="stay-card group flex h-full flex-col overflow-hidden border border-line bg-background"
              style={{ borderTopColor: feature.accent, borderTopWidth: 3 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[16/13]">
                <Parallax speed={0.05} className="absolute inset-0">
                  <Image
                    src={feature.image || FALLBACK[0]}
                    alt={`${feature.name} cottage at Vinyasa Earth`}
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                  />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                <span
                  className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md"
                  style={{ backgroundColor: `${feature.accent}e6` }}
                >
                  <Icon name={feature.icon as IconName} size={12} />
                  {feature.element}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    {feature.tagline}
                  </p>
                  <h3 className="mt-1.5 font-display text-3xl leading-tight sm:text-4xl">
                    {feature.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-soft">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
                  <span className="leading-none">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      From
                    </span>
                    <span className="font-display text-3xl text-foreground sm:text-4xl">
                      {priceLabel(feature.pricePerNight)}
                    </span>
                    <span className="ml-1 text-xs text-foreground-soft">/ night</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                    Explore
                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* two supporting cottages */}
          {rest.map((c, i) => (
            <Reveal key={c.slug} variant="scale" delay={(i + 1) * 90}>
              <Link
                href={`/stays/${c.slug}`}
                className="stay-card group relative flex min-h-[16rem] flex-col justify-end overflow-hidden border border-line"
              >
                <Parallax speed={0.04} className="absolute inset-0">
                  <Image
                    src={c.image || FALLBACK[(i + 1) % FALLBACK.length]}
                    alt={`${c.name} cottage at Vinyasa Earth`}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw"
                    className="scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                  />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
                <span
                  className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md"
                  style={{ backgroundColor: `${c.accent}e6` }}
                >
                  <Icon name={c.icon as IconName} size={12} />
                  {c.element}
                </span>

                <div className="relative z-10 p-5 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    {c.tagline}
                  </p>
                  <h3 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">{c.name}</h3>
                  <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
                    <span className="text-sm">
                      <span className="text-white/70">From </span>
                      <span className="font-display text-xl">{priceLabel(c.pricePerNight)}</span>
                      <span className="text-xs text-white/70"> / night</span>
                    </span>
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
