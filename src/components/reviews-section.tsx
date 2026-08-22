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

const pullQuote = GOOGLE_RATING.summary.split(/(?<=\.)\s+/)[0]!.replace(/\.$/, "");

export default function ReviewsSection() {
  return (
    <section className="relative isolate overflow-hidden border-y border-accent/10 bg-[#f6f0e5] py-20 sm:py-24 lg:min-h-[760px]">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[56%] lg:w-[51%]" aria-hidden="true">
        <ParallaxHeroImage>
          <Image
            src={hut}
            alt=""
            fill
            sizes="(min-width: 1024px) 51vw, (min-width: 640px) 56vw, 100vw"
            className="object-cover object-right opacity-20 sm:opacity-75 lg:opacity-95"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,.4) 18%, #000 48%)",
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,.4) 18%, #000 48%)",
            }}
          />
        </ParallaxHeroImage>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(246,240,229,1)_0%,rgba(246,240,229,.97)_48%,rgba(246,240,229,.18)_72%,transparent_100%)]" aria-hidden="true" />

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
            <Reveal variant="scale" delay={70} className="mt-8 text-center">
              <div className="flex items-center justify-center gap-5 sm:gap-8">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-secondary/45 sm:w-24" aria-hidden="true" />
                <Icon name="leaf-outline" size={30} className="-rotate-45 text-secondary/70" />
                <span className="font-display text-8xl italic leading-none text-secondary-ink sm:text-9xl">
                  {GOOGLE_RATING.score}
                </span>
                <Icon name="leaf-outline" size={30} className="rotate-45 scale-x-[-1] text-secondary/70" />
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-secondary/45 sm:w-24" aria-hidden="true" />
              </div>
              <div className="mt-4"><Stars score={GOOGLE_RATING.score} /></div>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground underline decoration-accent/50 underline-offset-8 transition-colors hover:text-accent"
              >
                {GOOGLE_RATING.count} Google reviews
              </a>
            </Reveal>
          </Parallax>

          <Parallax speed={0.018} className="relative">
            <Reveal variant="up" delay={150} className="mt-12 text-center">
              <blockquote className="relative mx-auto max-w-[34ch] font-display text-2xl italic leading-relaxed text-foreground sm:text-3xl">
                <span className="absolute -left-4 -top-6 text-6xl text-accent/45 sm:-left-8" aria-hidden>&ldquo;</span>
                {pullQuote}
                <span className="ml-1 text-4xl text-accent/45" aria-hidden>&rdquo;</span>
              </blockquote>
              <div className="mx-auto mt-7 flex w-fit items-center gap-2 text-secondary/65" aria-hidden="true">
                <span className="h-px w-20 bg-secondary/30" />
                <Icon name="leaf-outline" size={18} />
                <span className="h-px w-20 bg-secondary/30" />
              </div>
            </Reveal>
          </Parallax>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {GOOGLE_RATING.topics.map((topic, i) => {
              const style = TOPIC_STYLE[topic] ?? { icon: "sparkles-outline" as IconName, accent: "#b5643b" };
              return (
                <Reveal key={topic} variant="up" delay={220 + i * 70}>
                  <div className="group flex min-h-36 flex-col items-center justify-center rounded-[1.25rem_1.25rem_2.5rem_1.25rem] border border-[#d9cbb6] bg-[#fbf7ef]/90 px-3 py-5 text-center shadow-[0_8px_24px_rgba(75,55,35,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-md">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/65 transition-transform duration-300 group-hover:rotate-6" style={{ color: style.accent }}>
                      <Icon name={style.icon} size={24} />
                    </span>
                    <span className="mt-3 text-xs font-semibold leading-snug text-foreground">{topic}</span>
                    <span className="mt-3 h-px w-8 bg-accent/35" aria-hidden="true" />
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