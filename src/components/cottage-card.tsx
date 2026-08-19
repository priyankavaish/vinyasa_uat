import Image from "next/image";
import Link from "next/link";
import type { Cottage } from "@/lib/content";
import { Reveal } from "./reveal";

const IMAGE_ROTATION = [
  "/images/property-cottages-day.jpg",
  "/images/property-night-gathering.jpg",
  "/images/property-lawn-gazebo.jpg",
];

export default function CottageCard({
  cottage,
  featured = false,
  index = 0,
}: {
  cottage: Cottage;
  featured?: boolean;
  index?: number;
}) {
  const image = IMAGE_ROTATION[index % IMAGE_ROTATION.length];
  return (
    <Reveal variant="scale" delay={(index % 3) * 90} className={featured ? "sm:col-span-2" : ""}>
      <Link
        href={`/stays/${cottage.slug}`}
        className="group block overflow-hidden border border-line bg-surface transition-shadow hover:shadow-md"
      >
        <div className={`relative ${featured ? "h-80" : "h-56"}`}>
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 border border-background/50 bg-black/35 px-3 py-1 text-[11px] tracking-[0.1em] uppercase text-background backdrop-blur-sm">
            {cottage.tagline}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display italic text-xl">{cottage.name}</h3>
          <p className="mt-2 text-sm text-foreground-soft leading-relaxed">{cottage.description}</p>
          <p className="mt-3 tabular-nums text-foreground">
            <span className="text-xs font-medium uppercase tracking-[0.04em] text-foreground-soft">from </span>
            <span className="text-lg font-semibold">₹{cottage.pricePerNight.toLocaleString("en-IN")}</span>
            <span className="text-xs text-foreground-soft"> / night</span>
            {cottage.placeholder && <span className="text-xs text-muted"> (placeholder)</span>}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
