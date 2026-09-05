import Image from "next/image";
import Link from "next/link";
import type { EventProgram } from "@/lib/content";
import { Reveal } from "../ui/reveal";
import { Icon } from "../ui/icon";

const IMAGE_ROTATION = [
  "/images/property-night-gathering.jpg",
  "/images/property-kitchen-garden.jpg",
  "/images/amer-fort-lake.jpg",
];

export default function EventCard({ event, index = 0 }: { event: EventProgram; index?: number }) {
  const image = IMAGE_ROTATION[index % IMAGE_ROTATION.length];

  return (
    <Reveal variant={index % 2 === 0 ? "left" : "right"} delay={(index % 3) * 90} className="h-full">
      <Link
        href={`/events/${event.slug}`}
        className={`event-card event-card-${(index % 3) + 1} group flex h-full flex-col overflow-hidden border bg-surface`}
      >
        <div className="event-card-image relative h-52 shrink-0 overflow-hidden sm:h-56">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />
          <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/45 bg-black/30 text-white backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <Icon name="arrow-forward-outline" size={16} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <p className="event-kind w-fit px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]">
            {event.kind}
          </p>
          <h3 className="mt-4 font-display text-2xl italic leading-tight text-foreground">
            {event.name}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground-soft">
            {event.description}
          </p>

          <div className="event-card-footer mt-7 flex items-end justify-between gap-5 pt-5">
            <div className="min-w-0">
              <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-muted">Duration</span>
              <span className="mt-1 block text-xs leading-snug text-foreground-soft">{event.durationLabel}</span>
            </div>
            <div className="shrink-0 text-right tabular-nums">
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-accent">From</span>
              <span className="mt-1 block text-2xl font-semibold leading-none tracking-tight text-foreground">
                ₹{event.priceFrom.toLocaleString("en-IN")}
              </span>
              <span className="mt-1 block text-[9px] text-muted">full experience</span>
              {event.placeholder && <span className="mt-0.5 block text-[9px] text-muted">placeholder</span>}
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}