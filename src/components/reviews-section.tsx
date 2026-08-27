import Image from "next/image";
import vine1 from "@/app/assets/vine1.png";
import vine2 from "@/app/assets/vine2.png";
import { Reveal } from "./reveal";
import { Icon, type IconName } from "./icon";
import { Parallax } from "./parallax";
import { GOOGLE_RATING, GOOGLE_MAPS_LINK } from "@/lib/site";

function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

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
  "border-dusk-ink/15 bg-dusk-surface/90",
  "border-secondary/20 bg-secondary-surface/90",
  "border-accent/20 bg-clay-surface/90",
  "border-line bg-surface/90",
] as const;
const pullQuote = GOOGLE_RATING.summary.split(/(?<=\.)\s+/)[0]!.replace(/\.$/, "");

export default function ReviewsSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28">
      <Parallax speed={-0.025} className="pointer-events-none absolute -left-16 -top-16 z-[1] w-[13rem] opacity-25 sm:-left-20 sm:-top-20 sm:w-[18rem]" aria-hidden="true">
        <Image src={vine2} alt="" className="w-full -rotate-12" />
      </Parallax>
      <Parallax speed={0.02} className="pointer-events-none absolute -bottom-16 -right-16 z-[1] w-[13rem] scale-x-[-1] opacity-25 sm:-bottom-20 sm:-right-20 sm:w-[18rem]" aria-hidden="true">
        <Image src={vine1} alt="" className="w-full rotate-6" />
      </Parallax>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal variant="up" className="relative mx-auto max-w-2xl border border-line/70 bg-surface/90 px-6 py-6 text-center shadow-[0_2rem_5rem_rgba(75,55,35,0.09)] backdrop-blur-sm sm:px-14 sm:py-9">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GoogleLogo size={20} />
            <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-accent">
              Verified on Google
            </span>
          </div>
          <p className="mt-1.5 text-xs text-foreground-soft">
            {GOOGLE_RATING.category} <span className="mx-1.5 text-line">&middot;</span> {GOOGLE_RATING.hours}
          </p>

          <Parallax speed={-0.025} className="relative">
            <Reveal variant="scale" delay={70} className="mt-4 text-center">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-secondary/45 sm:w-24" aria-hidden="true" />
                <Icon name="leaf-outline" size={20} className="-rotate-45 text-secondary/70" />
                <span className="font-display text-5xl leading-none text-secondary-ink sm:text-6xl">
                  {GOOGLE_RATING.score}
                </span>
                <Icon name="leaf-outline" size={20} className="rotate-45 scale-x-[-1] text-secondary/70" />
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-secondary/45 sm:w-24" aria-hidden="true" />
              </div>
              <div className="mt-2.5"><Stars score={GOOGLE_RATING.score} /></div>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 border border-line bg-background/70 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {GOOGLE_RATING.count} Google reviews
                <Icon name="arrow-forward-outline" size={11} />
              </a>
            </Reveal>
          </Parallax>

          <Parallax speed={0.018} className="relative">
            <Reveal variant="up" delay={150} className="mt-5 text-center">
              <blockquote className="relative mx-auto max-w-[34ch] font-display text-lg leading-snug text-foreground sm:text-xl">
                <span className="absolute -left-3 -top-4 text-4xl text-accent/45 sm:-left-8" aria-hidden>&ldquo;</span>
                {pullQuote}
                <span className="ml-1 text-2xl text-accent/45" aria-hidden>&rdquo;</span>
              </blockquote>
              <div className="mx-auto mt-3 flex w-fit items-center gap-2 text-secondary/65" aria-hidden="true">
                <span className="h-px w-20 bg-secondary/30" />
                <Icon name="leaf-outline" size={18} />
                <span className="h-px w-20 bg-secondary/30" />
              </div>
            </Reveal>
          </Parallax>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {GOOGLE_RATING.topics.map((topic, i) => {
              const style = TOPIC_STYLE[topic] ?? { icon: "sparkles-outline" as IconName, accent: "#8f3b31" };
              return (
                <Reveal key={topic} variant="up" delay={220 + i * 70}>
                  <div className={`group relative flex min-h-24 flex-col items-center justify-center border px-3 py-3 text-center shadow-[0_8px_24px_rgba(75,55,35,0.06)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:z-20 hover:border-accent/55 hover:shadow-[0_12px_30px_rgba(75,55,35,0.13)] ${TOPIC_CARD_STYLE[i % TOPIC_CARD_STYLE.length]}`}>
                    <span className="grid h-8 w-8 place-items-center border border-current/10 bg-background/80 shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" style={{ color: style.accent }}>
                      <Icon name={style.icon} size={16} />
                    </span>
                    <span className="mt-2 text-[11px] font-semibold leading-snug text-foreground">{topic}</span>
                    <span className="mt-2 h-px w-7 opacity-45" style={{ backgroundColor: style.accent }} aria-hidden="true" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
