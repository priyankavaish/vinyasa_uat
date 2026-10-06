"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "@/components/editorial/image";
import { Reveal } from "@/components/ui/reveal";

export default function FounderStory({
  eyebrow,
  title,
  role,
  paragraphs,
  pullquote,
  image,
  imageAlt,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  role: React.ReactNode;
  paragraphs: string[];
  pullquote: string;
  image: string | StaticImageData;
  imageAlt: string;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const imageEl = imageRef.current;
    if (!imageEl) return;
    const update = () => {
      const headerH = headerRef.current?.offsetHeight ?? 0;
      const buttonH = buttonRef.current?.offsetHeight ?? 0;
      setMaxHeight(Math.max(imageEl.offsetHeight - headerH - buttonH - 24, 60));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(imageEl);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <Reveal variant="left">
        <div ref={headerRef}>
          {eyebrow}
          {title}
          {role}
        </div>

        <div
          className="relative mt-6 overflow-hidden transition-[max-height] duration-300"
          style={!expanded && maxHeight ? { maxHeight } : undefined}
        >
          {expanded ? (
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-foreground-soft">{p}</p>
              ))}
            </div>
          ) : (
            <p className="leading-relaxed text-foreground-soft">{paragraphs.join(" ")}</p>
          )}

        {expanded && (
          <blockquote className="mt-8 border-l-2 border-accent/40 pl-5 font-display italic text-xl leading-snug text-clay-ink">
            {pullquote}
          </blockquote>
        )}

          {!expanded && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent underline underline-offset-4"
        >
          {expanded ? "Read less" : "Read more"}
        </button>


      </Reveal>

      <Reveal variant="right" delay={100} className="lg:sticky lg:top-28">
        <div ref={imageRef} className="relative flex aspect-[4/5] flex-col items-center justify-center gap-6">
          <div className="relative aspect-square w-full max-w-[26rem]">
            <span
              aria-hidden
              className="absolute inset-0 border border-dashed border-accent/25"
              style={{ borderRadius: "50%", rotate: "12deg" }}
            />
            <span
              aria-hidden
              className="absolute -bottom-3 -right-3 h-full w-full border border-clay-ink/15 bg-background"
              style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%", rotate: "-6deg" }}
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-accent shadow-[0_30px_60px_-24px_rgba(143,59,49,0.55)]"
              style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%", rotate: "-6deg" }}
            />
            <div className="group relative h-full w-full p-6">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 30vw, 60vw"
                className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-background px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            Founder · Est. 2018
          </span>
        </div>
      </Reveal>
    </div>
  );
}
