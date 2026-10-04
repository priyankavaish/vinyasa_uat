"use client";

import { useState } from "react";
import { PAYMENT_COLORS } from "@/lib/payment-buttons";

export default function ThemeColorControl({ name, label, value, onChange }: {
  name: string; label: string; value: string; onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = PAYMENT_COLORS.find((color) => color.value === value);
  return <div className="rounded-md border border-line bg-surface">
    <input type="hidden" name={name} value={value} />
    <button type="button" aria-expanded={open} aria-controls={`palette-${name}`}
      onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 p-4 text-left">
      <span className="h-9 w-9 shrink-0 rounded border border-foreground/20" style={{ background: `var(--${value})` }} />
      <span className="flex-1"><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-muted">{selected?.label}</span></span>
      <span aria-hidden>{open ? "−" : "+"}</span>
    </button>
    {open && <div id={`palette-${name}`} className="border-t border-line p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Theme colors</p>
      <div role="group" aria-label={label} className="grid grid-cols-3 gap-2">
        {PAYMENT_COLORS.map((color) => <button key={color.value} type="button" aria-pressed={value === color.value}
          aria-label={color.label} onClick={() => { onChange(color.value); setOpen(false); }}
          className="flex flex-col items-center gap-2 rounded border border-line p-2 text-center text-xs hover:border-accent focus-visible:outline-2 focus-visible:outline-accent aria-pressed:border-accent aria-pressed:bg-clay-surface">
          <span className="h-8 w-8 rounded border border-foreground/20" style={{ background: `var(--${color.value})` }} />
          {color.label}
        </button>)}
      </div>
    </div>}
  </div>;
}
