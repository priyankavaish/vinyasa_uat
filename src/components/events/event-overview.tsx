"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./event-detail.module.css";

export default function EventOverview({ children }: { children: ReactNode }) {
  const id = useId();
  const body = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const measure = () => {
      setCompact(media.matches);
      setOverflowing((body.current?.scrollHeight ?? 0) > 260);
    };
    const observer = new ResizeObserver(measure);
    if (body.current) observer.observe(body.current);
    media.addEventListener("change", measure);
    measure();
    return () => { observer.disconnect(); media.removeEventListener("change", measure); };
  }, []);

  return <div className={styles.overview}>
    <div id={id} ref={body} className={styles.overviewBody} data-collapsed={compact && overflowing && !expanded}>{children}</div>
    {compact && overflowing && <button type="button" aria-controls={id} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
      {expanded ? "Read less" : "Read more"} <span aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>}
  </div>;
}
