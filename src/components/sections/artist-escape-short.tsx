"use client";

import { Icon } from "@/components/ui/icon";
import { useYoutubeMuteToggle } from "@/lib/hooks/use-youtube-mute-toggle";

export default function ArtistEscapeShort({ youtubeId }: { youtubeId: string }) {
  const { iframeRef, muted, toggleMute } = useYoutubeMuteToggle();

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-lg shadow-[0_30px_60px_-28px_rgba(30,20,12,0.45)]">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&enablejsapi=1`}
        title="A moment at Artist Escape"
        allow="autoplay; encrypted-media"
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-background/40 bg-black/40 text-background backdrop-blur-sm transition-colors hover:bg-black/60"
      >
        <Icon name={muted ? "volume-mute-outline" : "volume-high-outline"} size={16} />
      </button>
    </div>
  );
}
