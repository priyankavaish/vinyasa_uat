"use client";
import { useEffect } from "react";

// Keeps a #hash target in view while images and fonts finish loading above it,
// so a link like /events/artist-in-residence#residency-application lands on the form.
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let stopped = false;
    const stop = () => { stopped = true; };
    const align = () => {
      if (stopped) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    };
    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    events.forEach(name => window.addEventListener(name, stop, { once: true, passive: true }));
    align();
    const timers = [150, 400, 900, 1600].map(ms => window.setTimeout(align, ms));
    window.addEventListener("load", align);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", align);
      events.forEach(name => window.removeEventListener(name, stop));
    };
  }, []);
  return null;
}
