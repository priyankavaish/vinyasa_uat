"use client";
import Link from "next/link";
import { useState } from "react";
import DeleteButton from "./delete-button";
import { deletePage } from "@/lib/admin/actions";
type PageRow = { id: string; title: string; path: string; kind: string; href: string; deleteId: string };
const PAGE_SIZE = 10;
export default function ManagePagesTable({ rows }: { rows: PageRow[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const search = query.trim().toLocaleLowerCase();
  const filteredRows = rows.filter(row => [row.title, row.path, row.kind].some(value => value.toLocaleLowerCase().includes(search)));
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = filteredRows.slice(offset, offset + PAGE_SIZE);
  const buttonClass = "min-h-10 border border-line px-3 py-2 text-sm font-semibold hover:bg-[#eae1d4] disabled:cursor-not-allowed disabled:opacity-40";
  return <section className="mt-6" aria-label="Manage pages table">
    <div className="flex flex-wrap items-end gap-3"><label className="grid w-full gap-2 text-sm font-semibold sm:max-w-md" htmlFor="page-search">Search pages<input id="page-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Search by page name, URL or type" className="min-w-0 border border-line bg-white px-3 py-3 font-normal focus:outline-accent" /></label>{query && <button type="button" onClick={() => { setQuery(""); setPage(1); }} className={buttonClass}>Clear search</button>}</div>
    <div className="mt-6 overflow-x-auto border border-line bg-white"><table className="w-full text-left text-sm"><caption className="sr-only">Website pages and their editors</caption><thead className="bg-[#eae1d4] text-xs uppercase tracking-wider"><tr><th scope="col" className="p-4">Page</th><th scope="col" className="hidden p-4 sm:table-cell">URL</th><th scope="col" className="hidden p-4 md:table-cell">Type</th><th scope="col" className="p-4 text-right">Action</th></tr></thead><tbody>{visibleRows.map(p => <tr key={p.id} className="border-t border-line hover:bg-[#f8f3eb]"><td className="p-4"><Link href={p.href} className="font-semibold text-accent hover:underline">{p.title}</Link><p className="mt-1 break-all text-xs text-foreground-soft sm:hidden">{p.path}</p></td><td className="hidden break-all p-4 text-foreground-soft sm:table-cell">{p.path}</td><td className="hidden p-4 text-foreground-soft md:table-cell">{p.kind}</td><td className="p-4"><div className="flex flex-wrap items-center justify-end gap-3"><Link href={p.href} aria-label={"Edit " + p.title} className="font-semibold text-accent underline">Edit</Link>{p.deleteId && <DeleteButton id={p.deleteId} action={deletePage} />}</div></td></tr>)}{filteredRows.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-foreground-soft">No pages found. Try another search.</td></tr>}</tbody></table></div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><p role="status" aria-live="polite" className="text-sm text-foreground-soft">Showing {filteredRows.length ? offset + 1 : 0}-{offset + visibleRows.length} of {filteredRows.length} pages</p><nav aria-label="Pages pagination" className="flex flex-wrap items-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={buttonClass}>Previous</button><span className="px-2 text-sm">Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className={buttonClass}>Next</button></nav></div>
  </section>;
}
