import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { Icon } from "./icon";
import { GOOGLE_RATING, GOOGLE_MAPS_LINK } from "@/lib/site";

function Stars({ score }: { score: number }) {
  const full = Math.round(score);
  return (
    <span aria-hidden className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name={i < full ? "star" : "star-outline"} size={16} className={i < full ? "text-accent" : "text-line"} />
      ))}
    </span>
  );
}

// Break the long review summary into short standalone lines instead of one
// dense paragraph — each sentence gets room to breathe.
const fragments = GOOGLE_RATING.summary.split(/(?<=\.)\s+/);
const fragmentIndent = ["", "sm:pl-10", "sm:pl-20"];

export default function ReviewsSection() {
  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <span
        className="pointer-events-none absolute -left-6 -top-16 font-display text-[16rem] italic leading-none text-foreground/[0.04] select-none"
        aria-hidden
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal variant="fade" className="mb-14 flex justify-center sm:justify-start">
          <SectionEyebrow icon="trophy-outline">Verified on Google</SectionEyebrow>
        </Reveal>

        <div className="grid gap-10 text-center sm:grid-cols-[auto_1fr] sm:items-start sm:gap-16 sm:text-left">
          <Reveal variant="scale" className="flex flex-col items-center gap-3 sm:items-start">
            <span className="font-display text-7xl italic leading-none">{GOOGLE_RATING.score}</span>
            <Stars score={GOOGLE_RATING.score} />
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.06em] uppercase text-foreground-soft underline"
            >
              {GOOGLE_RATING.count} Google reviews
            </a>
          </Reveal>

          <div className="space-y-7">
            {fragments.map((line, i) => (
              <Reveal
                key={line}
                variant={i % 2 === 0 ? "left" : "right"}
                delay={i * 130}
                className={fragmentIndent[i % fragmentIndent.length]}
              >
                <p className="max-w-[42ch] font-display text-2xl italic leading-snug sm:text-3xl">{line}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal variant="fade" delay={260} className="mt-16 flex flex-wrap justify-center gap-2 sm:justify-start">
          {GOOGLE_RATING.topics.map((topic) => (
            <span key={topic} className="border border-line px-3 py-1.5 text-xs tracking-[0.04em] text-foreground-soft">
              {topic}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
