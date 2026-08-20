"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "vinyasa-earth-music-muted";

export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const savedMuted = window.localStorage.getItem(STORAGE_KEY) === "true";
    audio.muted = savedMuted;
    setMuted(savedMuted);

    const markPlaying = () => setPlaying(true);
    const markPaused = () => setPlaying(false);
    audio.addEventListener("playing", markPlaying);
    audio.addEventListener("pause", markPaused);

    const tryAutoplay = async () => {
      try {
        await audio.play();
      } catch {
        // Audible autoplay is blocked by Safari/Chrome on some devices. Keep
        // the track ready, then begin on the first page interaction.
        setPlaying(false);
      }
    };

    const startOnFirstInteraction = async (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".music-toggle")) return;
      if (window.localStorage.getItem(STORAGE_KEY) === "true") return;
      audio.muted = false;
      setMuted(false);
      await audio.play().catch(() => undefined);
    };

    void tryAutoplay();
    window.addEventListener("pointerdown", startOnFirstInteraction, { once: true });
    window.addEventListener("keydown", startOnFirstInteraction, { once: true });
    return () => {
      audio.removeEventListener("playing", markPlaying);
      audio.removeEventListener("pause", markPaused);
      window.removeEventListener("pointerdown", startOnFirstInteraction);
      window.removeEventListener("keydown", startOnFirstInteraction);
    };
  }, []);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.muted = false;
      setMuted(false);
      window.localStorage.setItem(STORAGE_KEY, "false");
      await audio.play().catch(() => undefined);
      return;
    }

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
    window.localStorage.setItem(STORAGE_KEY, String(nextMuted));
  }

  const audible = playing && !muted;
  const label = !playing ? "Play background music" : muted ? "Unmute background music" : "Mute background music";

  return (
    <>
      <audio ref={audioRef} src="/audio/desert-echoes.mp3" autoPlay loop preload="auto" playsInline />
      <button
        type="button"
        onClick={toggleAudio}
        className={`music-toggle ${audible ? "is-playing" : ""}`}
        aria-label={label}
        title={label}
      >
        <span className="music-note" aria-hidden>♫</span>
        {(!playing || muted) && <span className="music-slash" aria-hidden />}
      </button>
    </>
  );
}
