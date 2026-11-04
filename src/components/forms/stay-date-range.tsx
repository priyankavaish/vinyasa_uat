"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Props = {
  checkIn: string; checkOut: string; unavailable: ReadonlySet<string>; minDate: string;
  onChange: (checkIn: string, checkOut: string) => void;
  checkInLabel: ReactNode; checkOutLabel: ReactNode; checkInError?: ReactNode; checkOutError?: ReactNode;
};
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const key = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const addDay = (date: string) => new Date(Date.parse(date) + 86_400_000).toISOString().slice(0, 10);
const show = (date: string) => date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Select date";
const field = "mt-1 w-full border border-line bg-background px-4 py-2.5 text-left text-sm";

/** Check-in / check-out picker that shows nights the stay cannot be booked. */
export default function StayDateRange({ checkIn, checkOut, unavailable, minDate, onChange, checkInLabel, checkOutLabel, checkInError, checkOutError }: Props) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => { const base = checkIn || minDate; return new Date(Number(base.slice(0, 4)), Number(base.slice(5, 7)) - 1, 1); });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  // Choosing a check-out: nights from check-in must all be free, so the first closed night is the last allowed check-out.
  const lastCheckOut = useMemo(() => {
    if (!checkIn || checkOut) return "";
    let day = checkIn;
    for (let i = 0; i < 400; i++) { if (unavailable.has(day)) return day; day = addDay(day); }
    return "9999-12-31";
  }, [checkIn, checkOut, unavailable]);
  const choosingOut = !!checkIn && !checkOut;

  function pick(date: string) {
    if (choosingOut && date > checkIn && date <= lastCheckOut) { onChange(checkIn, date); setOpen(false); return; }
    onChange(date, "");
  }

  const year = month.getFullYear(), index = month.getMonth();
  const lead = (new Date(year, index, 1).getDay() + 6) % 7;
  const count = new Date(year, index + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)] as (number | null)[];

  return <div ref={ref} className="relative">
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <span className="block text-xs tracking-[0.08em] uppercase text-foreground-soft">{checkInLabel}</span>
        <button type="button" onClick={() => setOpen(true)} className={field}>{show(checkIn)}</button>
        {checkInError}
      </div>
      <div>
        <span className="block text-xs tracking-[0.08em] uppercase text-foreground-soft">{checkOutLabel}</span>
        <button type="button" onClick={() => setOpen(true)} className={field}>{show(checkOut)}</button>
        {checkOutError}
      </div>
    </div>
    {open && <div role="dialog" aria-label="Choose your dates" className="absolute left-0 z-30 mt-2 w-full max-w-sm border border-line bg-surface p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(year, index - 1, 1))} className="px-2 py-1">‹</button>
        <p className="text-sm font-semibold">{month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
        <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(year, index + 1, 1))} className="px-2 py-1">›</button>
      </div>
      <p className="mt-1 text-center text-xs text-foreground-soft">{choosingOut ? "Now choose your check-out date" : "Choose your check-in date"}</p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((d) => <div key={d} className="py-1 font-semibold text-muted">{d}</div>)}
        {cells.map((d, i) => {
          if (d === null) return <div key={`b${i}`} />;
          const date = key(year, index, d);
          const past = date < minDate;
          const closed = unavailable.has(date);
          const outOk = choosingOut && date > checkIn && date <= lastCheckOut;
          const disabled = past || (closed && !outOk) || (choosingOut && date > lastCheckOut);
          const inRange = !!checkIn && !!checkOut && date > checkIn && date < checkOut;
          const selected = date === checkIn || date === checkOut;
          return <button key={date} type="button" disabled={disabled} onClick={() => pick(date)}
            title={closed ? "Not available" : undefined}
            className={`rounded py-2 text-sm ${selected ? "bg-accent text-white" : inRange ? "bg-clay-surface" : closed && !outOk ? "bg-red-50 text-red-300 line-through" : past ? "text-muted/50" : "hover:bg-clay-surface"} disabled:cursor-not-allowed`}>{d}</button>;
        })}
      </div>
      <p className="mt-3 text-xs text-foreground-soft"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-red-100" />Struck-through dates are not available.</p>
    </div>}
  </div>;
}
