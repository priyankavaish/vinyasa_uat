"use client";

import { useState } from "react";
import { plainText } from "@/lib/editorial/text";
import styles from "./event-detail.module.css";

export default function EventShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState("");
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: plainText(title), url: window.location.href.split("#")[0] });
      } else {
        await navigator.clipboard.writeText(window.location.href.split("#")[0]);
        setStatus("Link copied");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("Please copy the page URL to share.");
    }
  }
  return <div className={styles.share}>
    <button type="button" onClick={share} aria-label="Share this event" title="Share this event">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M6 11H4.5V21h15V11H18" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    <span role="status">{status}</span>
  </div>;
}
