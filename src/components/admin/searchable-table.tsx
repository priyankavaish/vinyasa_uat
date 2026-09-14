"use client";
import { useId, useState, type ReactNode } from "react";
type Item = { id: string; search: string; content: ReactNode };
export default function SearchableTable({ label, items, header, columns, emptyMessage }: { label: string; items: Item[]; header: ReactNode; columns: number; emptyMessage: string }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = items.filter(item => item.search.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pageCount);
  const offset = (currentPage - 1) * 10;
  const visible = filtered.slice(offset, offset + 10);
  const buttonClass = "min-h-10 border border-line px-3 py-2 text-sm font-semibold hover:bg-[#eae1d4] disabled:cursor-not-allowed disabled:opacity-40";
  return <section className="mt-6 min-w-0" aria-label={label + " table"}>
    <div className="flex flex-wrap items-end gap-3"><label htmlFor={inputId} className="grid w-full gap-2 text-sm font-semibold sm:max-w-md">Search {label}<input id={inputId} type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Search by name, URL or details" className="min-w-0 border border-line bg-white px-3 py-3 font-normal focus:outline-accent" /></label>{query && <button type="button" className={buttonClass} onClick={() => { setQuery(""); setPage(1); }}>Clear search</button>}</div>
    <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full text-left text-sm"><caption className="sr-only">{label}</caption>{header}<tbody>{visible.map(item => item.content)}{visible.length === 0 && <tr><td colSpan={columns} className="px-4 py-8 text-center text-sm text-foreground-soft">{query.trim() ? "No matches found. Try another search." : emptyMessage}</td></tr>}</tbody></table></div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><p role="status" aria-live="polite" className="text-sm text-foreground-soft">Showing {filtered.length ? offset + 1 : 0}-{offset + visible.length} of {filtered.length} {label}</p><nav aria-label={label + " pagination"} className="flex flex-wrap items-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={buttonClass}>Previous</button><span className="px-2 text-sm">Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className={buttonClass}>Next</button></nav></div>
  </section>;
}
