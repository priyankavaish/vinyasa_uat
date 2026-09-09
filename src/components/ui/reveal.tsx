"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "scale" | "left" | "right" | "clip";

/** Subtle scroll-in: a short opacity-only fade (no transform — a moving
 *  element reads as "shake" while the page scrolls), driven by a CSS
 *  transition so it never replays. Always renders one wrapping <div> so it
 *  can't alter a parent grid/flex layout. `variant` is kept for call-site
 *  compatibility; every reveal now uses the same quiet fade. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "idle" = server / pre-hydration: fully visible, no styles (works without JS)
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip when an ancestor already animates this block, or motion is reduced.
    if (
      el.closest("[data-animate-inview]") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setState("hidden");
    let io: IntersectionObserver | null = null;
    // Let the hidden state paint before we start observing, so an element that
    // is already on screen transitions in cleanly instead of snapping.
    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setState("shown");
              io?.disconnect();
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
      );
      io.observe(el);
    });
    const failsafe = window.setTimeout(() => setState("shown"), 3000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      io?.disconnect();
    };
  }, []);

  const style: CSSProperties | undefined =
    state === "idle"
      ? undefined
      : {
          opacity: state === "shown" ? 1 : 0,
          transition: `opacity 460ms ease-out ${delay}ms`,
        };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
