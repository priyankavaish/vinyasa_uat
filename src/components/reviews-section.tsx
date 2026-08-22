import Image from "next/image";
import hut from "@/app/assets/hut.png.png";
import vine2 from "@/app/assets/vine2.png";
import vine4 from "@/app/assets/vine4.png";
import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { Icon, type IconName } from "./icon";
import { Parallax, ParallaxHeroImage } from "./parallax";
import { GOOGLE_RATING, GOOGLE_MAPS_LINK } from "@/lib/site";

function Stars({ score }: { score: number }) {
  const full = Math.round(score);
  return (
    <span aria-hidden className="flex items-center justify-center gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name={i < full ? "star" : "star-outline"} size={18} className={i < full ? "text-accent" : "text-line"} />
      ))}
    </span>
  );
}

const TOPIC_STYLE: Record<string, { icon: IconName; accent: string }> = {
  "Peaceful atmosphere": { icon: "moon-outline", accent: "#6b7a9e" },
  Sustainability: { icon: "leaf-outline", accent: "#66783f" },
  "Dance studio": { icon: "musical-notes-outline", accent: "#b85d32" },
  "Outside amphitheatre": { icon: "sunny-outline", accent: "#c18425" },
};

const TOPIC_CARD_STYLE = [
  "rounded-[2.75rem_1rem_1rem_1rem] border-dusk-ink/15 bg-dusk-surface/90",
  "rounded-[1rem_2.75rem_1rem_1rem] border-secondary/20 bg-secondary-surface/90",
  "rounded-[1rem_1rem_1rem_2.75rem] border-accent/20 bg-clay-surface/90",
  "rounded-[1rem_1rem_2.75rem_1rem] border-line bg-surface/90",
] as const;
const pullQuote = GOOGLE_RATING.summary.split(/(?<=\.)\s+/)[0]!.replace(/\.$/, "");

export default function ReviewsSection() {
  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-background py-16 sm:py-20 lg:min-h-[680px]">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[56%] lg:w-[51%]" aria-hidden="true">
        <ParallaxHeroImage>
          <Image
            src={hut}
            alt=""
            fill
            sizes="(min-width: 1024px) 51vw, (min-width: 640px) 56vw, 100vw"
            className="object-cover object-right opacity-20 sm:opacity-70 lg:opacity-85"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,.4) 18%, #000 48%)",
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,.4) 18%, #000 48%)",
            }}
          />
        </ParallaxHeroImage>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(243,241,234,1)_0%,rgba(243,241,234,.96)_48%,rgba(243,241,234,.22)_72%,transparent_100%)]" aria-hidden="true" />

      <Parallax speed={-0.025} className="pointer-events-none absolute -left-20 -top-44 z-[1] w-[15rem] opacity-25 sm:w-[20rem]" aria-hidden="true">
        <Image src={vine2} alt="" className="w-full -rotate-12" />
      </Parallax>
      <Parallax speed={0.02} className="pointer-events-none absolute -bottom-44 -left-24 z-[1] w-[18rem] opacity-20 sm:w-[24rem]" aria-hidden="true">
        <Image src={vine4} alt="" className="w-full rotate-6" />
      </Parallax>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="w-full lg:w-[58%]">
          <Reveal variant="fade" className="flex justify-center lg:justify-start">
            <SectionEyebrow icon="ribbon-outline">Verified on Google</SectionEyebrow>
          </Reveal>

          <Parallax speed={-0.025} className="relative">
            <Reveal variant="scale" delay={70} className="mt-6 text-center">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-secondary/45 sm:w-24" aria-hidden="true" />
                <Icon name="leaf-outline" size={24} className="-rotate-45 text-secondary/70" />
                <span className="font-display text-6xl italic leading-none text-secondary-ink sm:text-7xl">
                  {GOOGLE_RATING.score}
                </span>
                <Icon name="leaf-outline" size={24} className="rotate-45 scale-x-[-1] text-secondary/70" />
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-secondary/45 sm:w-24" aria-hidden="true" />
              </div>
              <div className="mt-4"><Stars score={GOOGLE_RATING.score} /></div>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground underline decoration-accent/50 underline-offset-8 transition-colors hover:text-accent"
              >
                {GOOGLE_RATING.count} Google reviews
              </a>
            </Reveal>
          </Parallax>

          <Parallax speed={0.018} className="relative">
            <Reveal variant="up" delay={150} className="mt-9 text-center">
              <blockquote className="relative mx-auto max-w-[34ch] font-display text-xl italic leading-relaxed text-foreground sm:text-2xl">
                <span className="absolute -left-3 -top-5 text-5xl text-accent/45 sm:-left-8" aria-hidden>&ldquo;</span>
                {pullQuote}
                <span className="ml-1 text-3xl text-accent/45" aria-hidden>&rdquo;</span>
              </blockquote>
              <div className="mx-auto mt-5 flex w-fit items-center gap-2 text-secondary/65" aria-hidden="true">
                <span className="h-px w-20 bg-secondary/30" />
                <Icon name="leaf-outline" size={18} />
                <span className="h-px w-20 bg-secondary/30" />
              </div>
            </Reveal>
          </Parallax>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {GOOGLE_RATING.topics.map((topic, i) => {
              const style = TOPIC_STYLE[topic] ?? { icon: "sparkles-outline" as IconName, accent: "#b5643b" };
              return (
                <Reveal key={topic} variant="up" delay={220 + i * 70}>
                  <div className={`group relative flex min-h-32 flex-col items-center justify-center border px-3 py-4 text-center shadow-[0_8px_24px_rgba(75,55,35,0.06)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:z-20 hover:border-accent/55 hover:shadow-[0_12px_30px_rgba(75,55,35,0.13)] ${TOPIC_CARD_STYLE[i % TOPIC_CARD_STYLE.length]}`}>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-current/10 bg-background/80 shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" style={{ color: style.accent }}>
                      <Icon name={style.icon} size={20} />
                    </span>
                    <span className="mt-2.5 text-[11px] font-semibold leading-snug text-foreground">{topic}</span>
                    <span className="mt-2.5 h-px w-7 opacity-45" style={{ backgroundColor: style.accent }} aria-hidden="true" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}