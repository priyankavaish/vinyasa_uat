"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "vinyasa-earth-music-muted";

export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userActivatedRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const savedMuted = window.localStorage.getItem(STORAGE_KEY) === "true";
    audio.muted = savedMuted;
    setMuted(savedMuted);

    const markPlaying = () => {
      userActivatedRef.current = true;
      shouldPlayRef.current = true;
      setPlaying(true);
    };
    const markPaused = () => {
      setPlaying(false);
      if (shouldPlayRef.current && userActivatedRef.current) {
        window.setTimeout(() => void audio.play().catch(() => undefined), 250);
      }
    };
    const resumeWhenVisible = () => {
      if (document.visibilityState === "visible" && shouldPlayRef.current && userActivatedRef.current) {
        void audio.play().catch(() => undefined);
      }
    };
    audio.addEventListener("playing", markPlaying);
    audio.addEventListener("pause", markPaused);
    audio.addEventListener("ended", markPaused);
    document.addEventListener("visibilitychange", resumeWhenVisible);

    const playbackWatchdog = window.setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        shouldPlayRef.current &&
        userActivatedRef.current &&
        audio.paused
      ) {
        void audio.play().catch(() => undefined);
      }
    }, 1000);

    const startOnFirstInteraction = async (event: Event) => {
      if (userActivatedRef.current) return;
      if (event.target instanceof Element && event.target.closest(".music-toggle")) return;
      if (window.localStorage.getItem(STORAGE_KEY) === "true") return;
      userActivatedRef.current = true;
      shouldPlayRef.current = true;
      audio.muted = false;
      setMuted(false);
      await audio.play().catch(() => undefined);
    };

    window.addEventListener("pointerdown", startOnFirstInteraction, { once: true });
    window.addEventListener("touchstart", startOnFirstInteraction, { once: true, passive: true });
    window.addEventListener("wheel", startOnFirstInteraction, { once: true, passive: true });
    window.addEventListener("scroll", startOnFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", startOnFirstInteraction, { once: true });
    return () => {
      audio.removeEventListener("playing", markPlaying);
      audio.removeEventListener("pause", markPaused);
      audio.removeEventListener("ended", markPaused);
      document.removeEventListener("visibilitychange", resumeWhenVisible);
      window.clearInterval(playbackWatchdog);
      window.removeEventListener("pointerdown", startOnFirstInteraction);
      window.removeEventListener("touchstart", startOnFirstInteraction);
      window.removeEventListener("wheel", startOnFirstInteraction);
      window.removeEventListener("scroll", startOnFirstInteraction);
      window.removeEventListener("keydown", startOnFirstInteraction);
    };
  }, []);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userActivatedRef.current = true;
      shouldPlayRef.current = true;
      audio.muted = false;
      setMuted(false);
      window.localStorage.setItem(STORAGE_KEY, "false");
      await audio.play().catch(() => undefined);
      return;
    }

    const nextMuted = !audio.muted;
    userActivatedRef.current = true;
    audio.muted = nextMuted;
    setMuted(nextMuted);
    window.localStorage.setItem(STORAGE_KEY, String(nextMuted));
  }

  const audible = playing && !muted;
  const label = !playing ? "Play background music" : muted ? "Unmute background music" : "Mute background music";

  return (
    <>
      <audio ref={audioRef} src="/audio/desert-echoes.mp3" loop preload="auto" playsInline />
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
