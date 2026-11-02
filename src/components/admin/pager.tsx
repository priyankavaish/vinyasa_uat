"use client";
const buttonClass = "min-h-10 border border-line px-3 py-2 text-sm font-semibold hover:bg-[#eae1d4] disabled:cursor-not-allowed disabled:opacity-40";
export function paginate<T>(items: T[], page: number, size: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pageCount);
  const offset = (current - 1) * size;
  return { current, pageCount, offset, visible: items.slice(offset, offset + size) };
}
export default function Pager({ label, total, offset, shown, current, pageCount, onPage }: { label: string; total: number; offset: number; shown: number; current: number; pageCount: number; onPage: (page: number) => void }) {
  if (total <= shown && current === 1) return null;
  return <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><p role="status" aria-live="polite" className="text-sm text-foreground-soft">Showing {total ? offset + 1 : 0}-{offset + shown} of {total} {label}</p><nav aria-label={label + " pagination"} className="flex flex-wrap items-center gap-2"><button type="button" disabled={current === 1} onClick={() => onPage(current - 1)} className={buttonClass}>Previous</button><span className="px-2 text-sm">Page {current} of {pageCount}</span><button type="button" disabled={current === pageCount} onClick={() => onPage(current + 1)} className={buttonClass}>Next</button></nav></div>;
}
