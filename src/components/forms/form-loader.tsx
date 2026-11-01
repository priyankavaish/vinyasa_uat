"use client";
import { useEffect, useRef } from "react";
import styles from "./form-loader.module.css";

/** Full-screen animated-logo loader. Render it with `active` tied to the submitting state so it
 *  disappears as soon as the request settles (success dialog or error message takes over).
 *  It uses the popover top layer so it also shows above forms that live inside a modal <dialog>. */
export default function FormLoader({ active, label = "Sending…" }: { active: boolean; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    try { if (typeof el.showPopover === "function" && !el.matches(":popover-open")) el.showPopover(); } catch { /* falls back to fixed positioning */ }
    return () => { try { if (typeof el.hidePopover === "function" && el.matches(":popover-open")) el.hidePopover(); } catch { /* already hidden */ } };
  }, [active]);
  if (!active) return null;
  return <div ref={ref} popover="manual" className={styles.overlay} role="status" aria-live="polite" aria-label={label}>
    <div className={styles.box}>
      <div className={styles.ring}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-transparent.png" alt="" className={styles.logo} />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  </div>;
}
