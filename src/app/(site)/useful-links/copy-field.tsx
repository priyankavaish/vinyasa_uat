"use client";

import { useState } from "react";

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — nothing to fall back to gracefully here
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-0.5 truncate text-sm text-foreground">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-accent underline"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
