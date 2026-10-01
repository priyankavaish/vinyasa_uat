// Date labels support single days and inclusive ranges, including month/year boundaries.
const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};
const PART = /^(\d{1,2})(?:\s+([A-Za-z]+))?(?:\s+(\d{4}))?$/;

function validDate(day: number, month: number, year: number): Date | null {
  const date = new Date(Date.UTC(year, month, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month &&
    date.getUTCDate() === day ? date : null;
}

export function parseEventDates(label: string | null | undefined): { start: Date; end: Date } | null {
  if (!label) return null;
  const parts = label.trim().split(/\s*(?:[-\u2013\u2014]|\bto\b)\s*/i);
  if (parts.length > 2) return null;
  const first = parts[0].match(PART);
  const last = (parts[1] ?? parts[0]).match(PART);
  if (!first || !last) return null;
  const startMonth = MONTHS[(first[2] ?? last[2] ?? "").slice(0, 3).toLowerCase()];
  const endMonth = MONTHS[(last[2] ?? first[2] ?? "").slice(0, 3).toLowerCase()];
  if (startMonth === undefined || endMonth === undefined) return null;
  let startYear = Number(first[3] ?? last[3]);
  let endYear = Number(last[3] ?? first[3]);
  if (!startYear || !endYear) return null;
  if (endMonth < startMonth) {
    if (!first[3]) startYear--;
    else if (!last[3]) endYear++;
  }
  const start = validDate(Number(first[1]), startMonth, startYear);
  const end = validDate(Number(last[1]), endMonth, endYear);
  return start && end && end >= start ? { start, end } : null;
}

export function parseEventStart(label: string | null | undefined): Date | null {
  return parseEventDates(label)?.start ?? null;
}

export function parseEventEnd(label: string | null | undefined): Date | null {
  return parseEventDates(label)?.end ?? null;
}

// Keep an event through its final calendar day at the venue (India).
export function isEventActive(label: string | null | undefined, now = new Date()): boolean {
  const end = parseEventEnd(label);
  if (!end) return false;
  const indiaDate = new Date(now.getTime() + 330 * 60 * 1000);
  const today = Date.UTC(indiaDate.getUTCFullYear(), indiaDate.getUTCMonth(), indiaDate.getUTCDate());
  return end.getTime() >= today;
}
