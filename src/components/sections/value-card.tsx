"use client";

import { useState } from "react";
import Image from "@/components/editorial/image";
import { Icon, type IconName } from "@/components/ui/icon";

export default function ValueCard({
  icon,
  title,
  body,
  image,
  imageAlt,
}: {
  icon: IconName;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(30,20,12,0.4)]">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 640px) 24vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
        <span className="absolute bottom-3 left-4 grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-accent backdrop-blur-sm">
          <Icon name={icon} size={15} />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
        <h3 className="font-display italic text-xl">{title}</h3>
        <p
          className={`mt-2 pr-1 text-[13.5px] leading-relaxed text-foreground-soft [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            expanded ? "max-h-32 overflow-y-auto" : "line-clamp-5"
          }`}
        >
          {body}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 self-start text-[11px] font-bold uppercase tracking-[0.16em] text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-clay-ink"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
}
