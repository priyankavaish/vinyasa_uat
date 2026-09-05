// Events only carry a free-text `dateLabel` ("18–20 Sep 2026", "1 Jun – 30
// Sep 2026", "29 Dec 2026 – 1 Jan 2027", "17–22 Jan 2027"...). To sort/filter
// by "upcoming" we pull the first real date out of that label instead of
// adding a schema column just for this. Handles every shape currently in
// use; falls back to `null` ("no known date") for anything it can't parse.
const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const FULL = /(\d{1,2})\s+([A-Za-z]{3,})(?:\s+(\d{4}))?/;
const BARE_DAY = /^(\d{1,2})$/;

export function parseEventStart(dateLabel: string | null | undefined): Date | null {
  if (!dateLabel) return null;
  // First segment before an en-dash / hyphen range separator, e.g.
  // "18–20 Sep 2026" -> ["18", "20 Sep 2026"], "1 Jun – 30 Sep 2026" -> ["1 Jun", "30 Sep 2026"].
  const [firstRaw, restRaw] = dateLabel.split(/\s*[–-]\s*/);
  const first = firstRaw?.trim() ?? "";
  const rest = restRaw?.trim() ?? "";

  const full1 = first.match(FULL);
  let day: number, monthName: string, year: number | undefined;

  if (full1) {
    day = Number(full1[1]);
    monthName = full1[2];
    year = full1[3] ? Number(full1[3]) : undefined;
  } else if (BARE_DAY.test(first) && rest) {
    // "18–20 Sep 2026": day-only start, month/year live on the end segment.
    const fromRest = rest.match(FULL);
    if (!fromRest) return null;
    day = Number(first);
    monthName = fromRest[2];
    year = fromRest[3] ? Number(fromRest[3]) : undefined;
  } else {
    return null;
  }

  const month = MONTHS[monthName.slice(0, 3).toLowerCase()];
  if (month === undefined) return null;
  if (year === undefined) year = Number(rest.match(/(\d{4})/)?.[1]);
  if (!year) return null;

  const d = new Date(Date.UTC(year, month, day));
  return Number.isNaN(d.getTime()) ? null : d;
}
