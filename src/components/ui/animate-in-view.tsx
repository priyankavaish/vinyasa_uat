"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Plays an animate.css entrance once, *before* the block reaches the
 *  viewport, so the motion finishes off-screen and scrolling stays smooth.
 *  Plays once, clears itself when done, and respects prefers-reduced-motion. */
export default function AnimateInView({
  children,
  className = "",
  animation = "animate__slideInUp",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  animation?: string;
  /** Small pause (ms) before the entrance starts — staggers sections so they
   *  settle in one after another instead of all snapping in at once. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"pre" | "playing" | "done">("pre");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase("playing");
            io.disconnect();
          }
        }
      },
      // fire while the block is still ~35% of a screen below the fold
      { threshold: 0, rootMargin: "0px 0px 35% 0px" },
    );
    io.observe(el);
    const t = window.setTimeout(() => setPhase("done"), 3500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-animate-inview
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setPhase("done");
      }}
      style={phase === "playing" && delay ? { animationDelay: `${delay}ms` } : undefined}
      className={`${className} ${
        phase === "pre" ? "aiv-pre" : phase === "playing" ? `animate__animated ${animation}` : ""
      }`.trim()}
    >
      {children}
    </div>
  );
}
