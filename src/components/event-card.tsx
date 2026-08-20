import Image from "next/image";
import Link from "next/link";
import type { EventProgram } from "@/lib/content";
import { Reveal } from "./reveal";

const IMAGE_ROTATION = [
  "/images/property-night-gathering.jpg",
  "/images/property-kitchen-garden.jpg",
  "/images/amer-fort-lake.jpg",
];

export default function EventCard({ event, index = 0 }: { event: EventProgram; index?: number }) {
  const image = IMAGE_ROTATION[index % IMAGE_ROTATION.length];
  return (
    <Reveal variant={index % 2 === 0 ? "left" : "right"} delay={(index % 3) * 90}>
      <Link
        href={`/events/${event.slug}`}
        className={`event-card event-card-${(index % 3) + 1} group flex h-full flex-col overflow-hidden border border-line bg-surface transition-all hover:shadow-xl`}
      >
        <div className="relative h-44 shrink-0">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="eyebrow">{event.kind}</p>
          <h3 className="mt-2 font-display italic text-xl">{event.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground-soft">{event.description}</p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="text-xs text-muted">{event.durationLabel}</span>
            <span className="event-price tabular-nums text-foreground">
              <span className="price-from">from</span>
              <span className="price-value">₹{event.priceFrom.toLocaleString("en-IN")}</span>
              <span className="price-unit">full experience</span>
              {event.placeholder && <span className="text-xs text-muted"> (placeholder)</span>}
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
