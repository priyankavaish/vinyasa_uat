import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { Icon, type IconName } from "./icon";
import { GOOGLE_RATING, GOOGLE_MAPS_LINK } from "@/lib/site";

function Stars({ score }: { score: number }) {
  const full = Math.round(score);
  return (
    <span aria-hidden className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name={i < full ? "star" : "star-outline"} size={15} className={i < full ? "text-accent" : "text-line"} />
      ))}
    </span>
  );
}

// One icon + accent per topic instead of a plain text pill — the palette
// matches the hero's earth-cycle tones so it reads as one system.
const TOPIC_STYLE: Record<string, { icon: IconName; accent: string }> = {
  "Peaceful atmosphere": { icon: "moon-outline", accent: "#6b7a9e" },
  Sustainability: { icon: "leaf-outline", accent: "#7c8f5a" },
  "Dance studio": { icon: "musical-notes-outline", accent: "#c9713f" },
  "Outside amphitheatre": { icon: "sunny-outline", accent: "#d99a2b" },
};
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

// Just the single strongest line, not the full review — everything else
// (topics, rating) carries the rest visually instead of in prose.
const pullQuote = GOOGLE_RATING.summary.split(/(?<=\.)\s+/)[0]!.replace(/\.$/, "");

export default function ReviewsSection() {
  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <span
        className="pointer-events-none absolute -left-8 -top-20 font-display text-[18rem] italic leading-none text-foreground/[0.035] select-none"
        aria-hidden
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal variant="fade" className="flex justify-center">
          <SectionEyebrow icon="ribbon-outline">Verified on Google</SectionEyebrow>
        </Reveal>

        <Reveal variant="scale" delay={80} className="mx-auto mt-9 flex w-fit flex-col items-center">
          <div>
            <span className="font-display text-8xl italic leading-none sm:text-9xl">{GOOGLE_RATING.score}</span>
          </div>
          <div className="mt-3">
            <Stars score={GOOGLE_RATING.score} />
          </div>
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-xs tracking-[0.06em] uppercase text-foreground-soft underline underline-offset-4"
          >
            {GOOGLE_RATING.count} Google reviews
          </a>
        </Reveal>

        <Reveal variant="up" delay={180}>
          <p className="mx-auto mt-12 max-w-[30ch] font-display text-3xl italic leading-snug sm:text-4xl">
            &ldquo;{pullQuote}&rdquo;
          </p>
        </Reveal>

        <div className="mt-16 flex flex-wrap justify-center gap-5">
          {GOOGLE_RATING.topics.map((topic, i) => {
            const style = TOPIC_STYLE[topic] ?? { icon: "sparkles-outline" as IconName, accent: "#b5643b" };
            return (
              <Reveal key={topic} variant={i % 2 === 0 ? "left" : "right"} delay={260 + i * 90}>
                <div
                  className={`flex w-32 flex-col items-center gap-2 border border-line bg-surface px-4 py-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 ${TILT[i % TILT.length]}`}
                >
                  <span style={{ color: style.accent }}>
                    <Icon name={style.icon} size={24} />
                  </span>
                  <span className="text-xs font-medium leading-tight text-foreground-soft">{topic}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
