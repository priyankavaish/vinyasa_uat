"use client";

import { useState } from "react";

type Stay = { slug: string; name: string };
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AvailabilityCalendar({ stays, days, startMonth, months }: {
  stays: Stay[]; days: Record<string, Record<string, number | null>>; startMonth: string; months: number;
}) {
  const [slug, setSlug] = useState(stays[0]?.slug ?? "");
  const [offset, setOffset] = useState(0);
  const [y, m] = startMonth.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1 + offset, 1));
  const year = first.getUTCFullYear(), month = first.getUTCMonth();
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const mine = days[slug] ?? {};
  const cells = [...Array(lead).fill(null), ...Array.from({ length }, (_, i) => i + 1)];
  const iso = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return <section className="rounded-lg border border-line bg-surface p-5 sm:p-6">
    <h2 className="font-display text-2xl italic">Availability calendar</h2>
    <p className="mt-2 text-sm text-foreground-soft">Pick a stay to see which dates are free, fully booked or closed. Numbers show units still free for that night.</p>
    <div className="mt-4 flex flex-wrap gap-2">
      {stays.map((s) => <button key={s.slug} type="button" onClick={() => setSlug(s.slug)} aria-pressed={slug === s.slug}
        className={`rounded border px-3 py-1.5 text-sm ${slug === s.slug ? "border-accent bg-accent text-white" : "border-line bg-background"}`}>{s.name}</button>)}
    </div>
    <div className="mt-5 flex items-center justify-between">
      <button type="button" disabled={offset === 0} onClick={() => setOffset(offset - 1)} className="rounded border border-line px-3 py-1 text-sm disabled:opacity-40">‹ Prev</button>
      <p className="font-semibold">{first.toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })}</p>
      <button type="button" disabled={offset >= months - 1} onClick={() => setOffset(offset + 1)} className="rounded border border-line px-3 py-1 text-sm disabled:opacity-40">Next ›</button>
    </div>
    <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
      {WEEKDAYS.map((d) => <div key={d} className="py-1 font-semibold uppercase text-muted">{d}</div>)}
      {cells.map((d, i) => {
        if (d === null) return <div key={`b${i}`} />;
        const date = iso(d);
        const free = mine[date];
        const known = date in mine;
        const full = known && free === 0;
        return <div key={date} title={!known ? "" : full ? "Not available" : free === null ? "Available" : `${free} free`}
          className={`rounded border px-1 py-2 ${!known ? "border-line bg-background text-muted" : full ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-900"}`}>
          <div className="text-sm font-semibold">{d}</div>
          <div className="text-[10px] leading-tight">{!known ? "" : full ? "Full" : free === null ? "Open" : `${free} free`}</div>
        </div>;
      })}
    </div>
    <p className="mt-3 flex gap-4 text-xs text-foreground-soft"><span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-green-200" />Available</span><span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-red-200" />Currently not available (booked or closed)</span></p>
  </section>;
}
