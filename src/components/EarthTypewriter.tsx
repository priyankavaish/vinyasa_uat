"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "Earth";
const TYPE_DELAY = 0.42; // seconds between letters — slow, deliberate
const TYPE_DURATION = 0.5; // per-letter reveal length

/**
 * "Earth" typed out one letter at a time, filled with a garden photo via
 * background-clip: text. Once fully typed, the whole word settles into a
 * slow breathing pulse instead of sitting static.
 */
export default function EarthTypewriter({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const letters = WORD.split("");
  const typingTotal = TYPE_DELAY * (letters.length - 1) + TYPE_DURATION;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const t = setTimeout(() => setTypingDone(true), (typingTotal + 0.5) * 1000);
    return () => clearTimeout(t);
  }, [visible, reducedMotion, typingTotal]);

  return (
    <span
      ref={ref}
      className={`relative inline-flex items-baseline font-display italic ${className}`}
      style={{
        backgroundImage: "url(/images/property-kitchen-garden.jpg)",
        backgroundSize: "220% auto",
        backgroundPosition: "center 38%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        filter: "brightness(1.1) saturate(1.35)",
        animation:
          visible && !reducedMotion ? `earth-breathe 3.6s ease-in-out ${typingTotal}s infinite` : undefined,
      }}
    >
      {letters.map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: reducedMotion || visible ? 1 : 0,
            transform: reducedMotion || visible ? "none" : "translateY(0.15em)",
            transition: reducedMotion
              ? "none"
              : `opacity ${TYPE_DURATION}s ease, transform ${TYPE_DURATION}s ease`,
            transitionDelay: `${i * TYPE_DELAY}s`,
          }}
        >
          {ch}
        </span>
      ))}
      {/* Blinking caret — types alongside the word, fades once it's done. */}
      {!reducedMotion && (
        <span
          aria-hidden
          className="ml-[0.04em] inline-block w-[0.06em] self-stretch"
          style={{
            backgroundColor: "var(--secondary)",
            opacity: visible && !typingDone ? 1 : 0,
            animation: visible && !typingDone ? "earth-caret-blink 0.85s step-end infinite" : undefined,
            transition: "opacity 0.4s ease",
          }}
        />
      )}
    </span>
  );
}
