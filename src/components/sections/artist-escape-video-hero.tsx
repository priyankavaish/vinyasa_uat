"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { useYoutubeMuteToggle } from "@/lib/hooks/use-youtube-mute-toggle";

export default function ArtistEscapeVideoHero({
  youtubeId,
  eyebrow,
  title,
  description,
}: {
  youtubeId: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const { iframeRef, muted, toggleMute } = useYoutubeMuteToggle();

  return (
    <section data-hero className="relative flex min-h-[86svh] flex-col overflow-hidden text-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&enablejsapi=1`}
          title="Artist Escape"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(20,12,6,0.35) 0%, rgba(20,12,6,0.35) 55%, rgba(20,12,6,0.85) 100%)",
        }}
      />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        className="absolute bottom-6 right-6 z-20 grid h-11 w-11 place-items-center rounded-full border border-background/40 bg-black/35 text-background backdrop-blur-sm transition-colors hover:bg-black/55 sm:bottom-8 sm:right-8"
      >
        <Icon name={muted ? "volume-mute-outline" : "volume-high-outline"} size={18} />
      </button>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-5 pt-28 text-center sm:px-8">
        <Reveal variant="fade">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-background/85">{eyebrow}</p>
          <h1 className="mt-4 font-display italic text-5xl leading-[1.05] sm:text-7xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/90 sm:text-lg">{description}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="#apply" className="btn btn-accent">
              Apply now
            </Link>
            <Link href="#artists" className="btn btn-outline-light">
              Meet the artists
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
