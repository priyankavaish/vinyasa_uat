"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "@/components/editorial/image";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";

export default function ConstructionStory({
  eyebrow,
  title,
  paragraphs,
  image,
  imageAlt,
  accentImage,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  paragraphs: { label: string; body: string }[];
  image: string | StaticImageData;
  imageAlt: string;
  accentImage: string | StaticImageData;
}) {
  const [first, ...rest] = paragraphs;
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
      setMaxHeight(Math.max(imageEl.offsetHeight - headerH - buttonH - 32, 60));
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
        </div>

        <div
          className="relative mt-8 overflow-hidden transition-[max-height] duration-300"
          style={!expanded && maxHeight ? { maxHeight } : undefined}
        >
          <div className="space-y-8">
            <div className="border-l-2 border-accent/30 pl-5">
              <span className="font-display italic text-3xl leading-tight sm:text-[2.15rem]">{first.label}</span>
              <p className="mt-2 leading-relaxed text-foreground-soft">{first.body}</p>
            </div>

            {expanded &&
              rest.map((p) => (
                <div key={p.label} className="border-l-2 border-accent/30 pl-5">
                  <span className="font-display italic text-3xl leading-tight sm:text-[2.15rem]">{p.label}</span>
                  <p className="mt-2 leading-relaxed text-foreground-soft">{p.body}</p>
                </div>
              ))}
          </div>

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
          {expanded ? "See less" : "See more"}
        </button>
      </Reveal>

      <Reveal variant="right" delay={100} className="lg:sticky lg:top-28">
        <div ref={imageRef} className="relative aspect-[4/5]">
          <div aria-hidden className="absolute -bottom-4 -left-4 h-full w-full border border-clay-ink/15 bg-clay-surface" />
          <div aria-hidden className="absolute -bottom-2 -left-2 h-full w-full bg-accent/10" />
          <div className="group relative h-full w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(30,20,12,0.4)]">
            <Parallax enabled speed={-0.06} className="absolute inset-[-9%]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Parallax>
          </div>
          <div className="absolute -right-6 -top-6 hidden h-28 w-28 overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] border-4 border-background shadow-lg sm:block">
            <Image src={accentImage} alt="" fill sizes="112px" className="object-cover" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
