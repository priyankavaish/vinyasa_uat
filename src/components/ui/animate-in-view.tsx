"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Plays an animate.css entrance once the block scrolls into view.
 *  Kept subtle on purpose — short duration, plays once, and respects
 *  prefers-reduced-motion (content just shows, no motion). */
export default function AnimateInView({
  children,
  className = "",
  animation = "animate__slideInUp",
  threshold = 0.12,
}: {
  children: ReactNode;
  className?: string;
  animation?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    // Failsafe: never leave a block hidden if the observer misses.
    const t = window.setTimeout(() => setShown(true), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} ${shown ? `animate__animated ${animation}` : "aiv-pre"}`.trim()}
    >
      {children}
    </div>
  );
}
