import Image from "next/image";
import Link from "next/link";
import type { Cottage } from "@/lib/content";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import cottageIndigoImage from "@/app/assets/IMG_1068.JPG";

const IMAGE_ROTATION = [
  "/images/property-cottages-day.jpg",
  "/images/property-night-gathering.jpg",
  "/images/property-lawn-gazebo.jpg",
];

const COTTAGE_IMAGE_OVERRIDES: Record<string, typeof cottageIndigoImage | string> = {
  indigo: cottageIndigoImage,
};

export default function CottageCard({
  cottage,
  featured = false,
  index = 0,
}: {
  cottage: Cottage;
  featured?: boolean;
  index?: number;
}) {
  const image = COTTAGE_IMAGE_OVERRIDES[cottage.slug] ?? IMAGE_ROTATION[index % IMAGE_ROTATION.length];
  const price = (
    <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
      <div className="leading-none">
        <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-muted">From</span>
        <span className="font-display text-3xl text-foreground sm:text-4xl">
          ₹{cottage.pricePerNight.toLocaleString("en-IN")}
        </span>
        <span className="ml-1 text-xs text-foreground-soft">/ night</span>
        {cottage.placeholder && <span className="ml-1 text-xs text-muted">(placeholder)</span>}
      </div>
      <span className="inline-flex shrink-0 items-center rounded-full bg-secondary-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-secondary-ink">
        Breakfast included
      </span>
    </div>
  );

  const cta = (
    <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-[.12em] text-accent">
      View cottage
      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
    </span>
  );

  if (featured) {
    return (
      <Reveal variant="scale" className="sm:col-span-2">
        <Link
          href={`/stays/${cottage.slug}`}
          className="stay-card group grid overflow-hidden border border-line bg-surface sm:grid-cols-[1.25fr_1fr]"
        >
          <div className="relative h-64 overflow-hidden sm:h-auto sm:min-h-[22rem]">
            <Parallax speed={0.05} className="absolute inset-0">
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 640px) 55vw, 100vw"
                className="scale-110 object-cover transition-transform duration-500 group-hover:scale-[1.16]"
              />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 sm:bg-gradient-to-r" />
            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/25 bg-black/45 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
              {cottage.tagline}
            </span>
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-9">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Earth cottage</span>
              <h3 className="mt-1.5 font-display text-3xl leading-tight sm:text-4xl">{cottage.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-soft">{cottage.description}</p>
            </div>
            {price}
            {cta}
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal variant="scale" delay={(index % 3) * 90}>
      <Link
        href={`/stays/${cottage.slug}`}
        className="stay-card group flex h-full flex-col overflow-hidden border border-line bg-surface"
      >
        <div className="relative h-56 overflow-hidden">
          <Parallax speed={0.05} className="absolute inset-0">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="scale-110 object-cover transition-transform duration-500 group-hover:scale-[1.16]"
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
          <span className="absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)] rounded-full border border-white/25 bg-black/45 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
            {cottage.tagline}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Earth cottage</span>
            <h3 className="mt-1 font-display text-2xl">{cottage.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground-soft">{cottage.description}</p>
          </div>
          <div className="mt-auto">
            {price}
            <div className="mt-4">{cta}</div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
