"use client";
import styles from "./form-loader.module.css";

/** Full-screen animated-logo loader. Render it with `active` tied to the submitting state so it
 *  disappears as soon as the request settles (success dialog or error message takes over). */
export default function FormLoader({ active, label = "Sending…" }: { active: boolean; label?: string }) {
  if (!active) return null;
  return <div className={styles.overlay} role="status" aria-live="polite" aria-label={label}>
    <div className={styles.box}>
      <div className={styles.ring}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-transparent.png" alt="" className={styles.logo} />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  </div>;
}
