"use client";

import { useEffect, useRef } from "react";

export type RevealVariant = "up" | "fade" | "scale" | "left" | "right" | "clip";

const VARIANT_STYLE: Record<RevealVariant, { hidden: React.CSSProperties; transition: string }> = {
  up: {
    hidden: { opacity: 0, transform: "translate3d(0, 34px, 0)" },
    transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)",
  },
  fade: {
    hidden: { opacity: 0 },
    transition: "opacity 0.9s ease-out",
  },
  scale: {
    hidden: { opacity: 0, transform: "scale(0.92)" },
    transition: "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
  },
  left: {
    hidden: { opacity: 0, transform: "translate3d(-36px, 0, 0)" },
    transition: "opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
  },
  right: {
    hidden: { opacity: 0, transform: "translate3d(36px, 0, 0)" },
    transition: "opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
  },
  clip: {
    hidden: { opacity: 1, clipPath: "inset(0 0 100% 0)" },
    transition: "clip-path 0.6s cubic-bezier(0.65,0,0.35,1)",
  },
};

/** Reveals content once it scrolls into view. Plays once, respects
 *  prefers-reduced-motion, and accepts a `delay` (ms) for staggered grids.
 *  `variant` picks the motion — mix these across a page instead of reusing one. */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { hidden, transition } = VARIANT_STYLE[variant];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The site wrapper handles whole sections, avoiding stacked entrance delays.
    if (el.closest("[data-section-motion]")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.clipPath = "none";
      return;
    }

    // Progressive enhancement: content is visible in SSR and without JS.
    // Apply the entrance state only after hydration, so a slow script/audio
    // load can never leave the rest of the page blank.
    Object.assign(el.style, hidden);
    el.style.transition = transition;

    const show = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.clipPath = "inset(0 0 0 0)";
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          window.setTimeout(show, delay);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    // Failsafe: an element that never intersects (missed observer callback,
    // never scrolled past, a hydration hiccup) must not stay invisible forever.
    const forceTimer = window.setTimeout(show, 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(forceTimer);
    };
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
