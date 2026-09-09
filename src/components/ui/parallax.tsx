"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Translates its content vertically as the page scrolls, slower or faster than
 *  natural scroll depending on `speed` (negative drifts up, positive drifts down). */
export function Parallax({
  children,
  speed = 0.15,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(centerOffset * speed).toFixed(2)}px, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/** Full-bleed hero media that drifts slower than scroll and eases back to rest as
 *  the hero scrolls out. The layer is oversized via negative insets (not a CSS
 *  scale) so the drift never exposes an edge AND the media is never upscaled —
 *  scaling a <video>/<img> up is what made it look soft. */
export function ParallaxHeroImage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    const update = () => {
      const rect = el.parentElement!.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
      el.style.transform = `translate3d(0, ${(progress * 56).toFixed(2)}px, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={wrapRef}
        className={`absolute ${className}`}
        style={{ inset: "-9%", willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
