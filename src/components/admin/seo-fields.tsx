"use client";
import { useId } from "react";
type Seo = { title?: string; description?: string; keywords?: string; alternates?: { canonical?: string } };
export default function SeoFields({ value, onChange }: { value: Seo; onChange: (value: Seo) => void }) {
  const id = useId();
  const field = "w-full border border-line bg-white px-3 py-3 text-sm focus:outline-accent";
  const update = (key: "title" | "description" | "keywords", text: string) => onChange({ ...value, [key]: text });
  return <fieldset className="min-w-0 space-y-5 border border-line p-4">
    <legend className="px-2 font-semibold">SEO settings</legend>
    <p className="text-sm text-foreground-soft">Edit this page's title and meta tags. These settings do not change the page's visible design.</p>
    <div className="grid gap-2"><label htmlFor={id + "-title"} className="text-sm font-semibold">SEO title / meta title</label><input id={id + "-title"} className={field} value={value.title ?? ""} onChange={e => update("title", e.target.value)} placeholder="Page title for search results" /><p className="text-xs text-foreground-soft">{(value.title ?? "").length} characters. Used in the browser tab and search results.</p></div>
    <div className="grid gap-2"><label htmlFor={id + "-description"} className="text-sm font-semibold">Meta description</label><textarea id={id + "-description"} className={field} rows={3} value={value.description ?? ""} onChange={e => update("description", e.target.value)} placeholder="A short description of this page" /><p className="text-xs text-foreground-soft">{(value.description ?? "").length} characters. Summarise what visitors will find on this page.</p></div>
    <div className="grid gap-2"><label htmlFor={id + "-keywords"} className="text-sm font-semibold">Meta keywords</label><input id={id + "-keywords"} className={field} value={value.keywords ?? ""} onChange={e => update("keywords", e.target.value)} placeholder="mudhouse stay Jaipur, art residency, Vinyasa Earth" /><p className="text-xs text-foreground-soft">Separate keywords with commas. Saved as this page's keywords meta tag.</p></div>
    <div className="grid gap-2"><label htmlFor={id + "-canonical"} className="text-sm font-semibold">Canonical URL (preferred page URL)</label><input id={id + "-canonical"} className={field} value={value.alternates?.canonical ?? ""} onChange={e => onChange({ ...value, alternates: { ...value.alternates, canonical: e.target.value } })} placeholder="/about or https://your-domain.com/about" /><p className="text-xs text-foreground-soft">The main URL for this page when the same content has multiple URLs. Home uses /. Usually you can keep the existing value.</p></div>
    <div className="border border-line bg-background p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wide">Search result preview</p><p className="break-all text-xs text-foreground-soft">{value.alternates?.canonical || "Page URL"}</p><p className="mt-1 break-words text-lg text-[#1a0dab]">{value.title || "Page title"}</p><p className="mt-1 break-words text-sm text-foreground-soft">{value.description || "Add a meta description to preview this page's summary."}</p><p className="mt-3 text-xs text-foreground-soft">Illustrative preview. Search engines may show different text.</p></div>
  </fieldset>;
}
