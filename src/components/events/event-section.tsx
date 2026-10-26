"use client";

import { useEffect, useState, type ReactNode } from "react";
import FormattedText from "@/components/editorial/formatted-text";
import styles from "./event-detail.module.css";

export default function EventSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const targetMatches = () => {
      try { return decodeURIComponent(window.location.hash.slice(1)) === id; }
      catch { return false; }
    };
    const resize = () => setOpen(!media.matches || targetMatches());
    const followHash = () => { if (targetMatches()) setOpen(true); };
    const followLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const target = new URL(link.href, window.location.href);
      if (target.origin === location.origin && target.pathname === location.pathname && target.hash === "#" + id) setOpen(true);
    };
    resize();
    media.addEventListener("change", resize);
    window.addEventListener("hashchange", followHash);
    document.addEventListener("click", followLink);
    return () => {
      media.removeEventListener("change", resize);
      window.removeEventListener("hashchange", followHash);
      document.removeEventListener("click", followLink);
    };
  }, [id]);

  return <details id={id} className={styles.contentSection} open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary><h2><FormattedText value={title} /></h2><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
    <div className={styles.sectionBody}>{children}</div>
  </details>;
}
