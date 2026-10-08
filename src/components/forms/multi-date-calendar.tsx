"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

type Props = { id: string; value: string[]; onChange: (dates: string[]) => void; error?: string };
const dateKey = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export default function MultiDateCalendar({ id, value, onChange, error }: Props) {
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLFieldSetElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) { setRangeStart(null); setHoverDate(null); return; }
    function outside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const sortedDates = [...value].sort();
  const selectedDates = sortedDates.length === 0 ? "" : sortedDates.length === 1 ? formatDate(sortedDates[0]) : `${formatDate(sortedDates[0])} to ${formatDate(sortedDates[sortedDates.length - 1])}`;
  const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const year = month.getFullYear();
  const index = month.getMonth();
  const count = new Date(year, index + 1, 0).getDate();
  const label = month.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  function addPeriod(first: string, last: string) {
    const [start, end] = [first, last].sort();
    const dates = new Set<string>();
    const current = new Date(`${start}T00:00:00`);
    while (dateKey(current.getFullYear(), current.getMonth(), current.getDate()) <= end) {
      dates.add(dateKey(current.getFullYear(), current.getMonth(), current.getDate()));
      current.setDate(current.getDate() + 1);
    }
    onChange([...dates].sort());
    setRangeStart(null);
    setHoverDate(null);
  }
  function selectDate(date: string) {
    if (!rangeStart) { onChange([date]); setRangeStart(date); setHoverDate(null); }
    else { addPeriod(rangeStart, date); setOpen(false); inputRef.current?.focus(); }
  }
  return (
    <fieldset ref={containerRef} className="relative min-w-0" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); inputRef.current?.focus(); } }}>
      <legend className="text-xs uppercase tracking-[0.08em] text-foreground-soft">Volunteering Period <span className="text-accent" aria-hidden="true">*</span></legend>
      <label htmlFor={id} className="sr-only">Select volunteering dates</label>
      <div className="relative mt-1">
        <input ref={inputRef} id={id} type="text" readOnly required value={selectedDates} placeholder="Select date or date range" aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-calendar`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onClick={() => setOpen(current => !current)} onKeyDown={event => { if (["Enter", " ", "ArrowDown"].includes(event.key)) { event.preventDefault(); setOpen(true); } }} className="w-full cursor-pointer border border-line bg-background py-2.5 pl-4 pr-11 text-sm outline-none focus:border-accent" />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-accent"><Icon name="calendar-outline" size={18} /></span>
      </div>
      {open && <div id={`${id}-calendar`} role="dialog" aria-label="Choose volunteering dates" className="absolute inset-x-0 top-full z-30 mt-2 border border-line bg-surface p-3 shadow-lg">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(year, index - 1, 1))} className="px-3 py-2 text-accent focus-visible:outline-2">&#8249;</button>
          <span aria-live="polite" className="text-sm font-semibold">{label}</span>
          <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(year, index + 1, 1))} className="px-3 py-2 text-accent focus-visible:outline-2">&#8250;</button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <span key={day} className="py-1 text-center text-[11px] text-foreground-soft">{day}</span>)}
          {Array.from({ length: month.getDay() }, (_, day) => <span key={`blank-${day}`} />)}
          {Array.from({ length: count }, (_, offset) => {
            const day = offset + 1;
            const date = dateKey(year, index, day);
            const selected = value.includes(date) || date === rangeStart;
            const preview = rangeStart && hoverDate && date >= [rangeStart, hoverDate].sort()[0] && date <= [rangeStart, hoverDate].sort()[1];
            return <button key={date} type="button" aria-label={`${day} ${label}`} aria-pressed={selected} onClick={() => selectDate(date)} onMouseEnter={() => setHoverDate(date)} onFocus={() => setHoverDate(date)} className={`min-h-10 border text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected ? "border-accent bg-accent text-white" : preview ? "border-accent/30 bg-clay-surface" : "border-transparent hover:border-accent hover:bg-clay-surface"}`}>{day}</button>;
          })}
        </div>
        <button type="button" className="btn btn-accent mt-3 w-full" onClick={() => { setRangeStart(null); setOpen(false); inputRef.current?.focus(); }}>Done</button>
      </div>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
    </fieldset>
  );
}
