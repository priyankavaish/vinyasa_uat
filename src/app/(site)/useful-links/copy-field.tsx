"use client";

import { useState } from "react";

// A single detail row (account no., IFSC, GST…) with a tap-to-copy control.
export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the text is still selectable */
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
        <p className="mt-0.5 select-all font-display text-base tracking-wide text-clay-ink">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="shrink-0 border border-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent transition-colors hover:border-accent hover:bg-accent hover:text-surface"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
