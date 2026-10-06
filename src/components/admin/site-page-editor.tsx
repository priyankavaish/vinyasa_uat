"use client";
import { useState } from "react";
import Link from "next/link";
import EditorialEditor from "./editorial-editor";
import PageSettingsForm from "./page-settings-form";
import type { PageSettings } from "@/lib/page-routing";
type Section = { key: string; label: string; hint?: string; shared: string; defaults: unknown; value: unknown };
export default function SitePageEditor({ id, title: initialTitle, path: initialPath, sections, settings }: { id: string; title: string; path: string; sections: Section[]; settings?: PageSettings }) {
  const [{ title, path }, setPageInfo] = useState({ title: initialTitle, path: initialPath });
  const [selected, setSelected] = useState(sections[0]?.key);
  const [preview, setPreview] = useState(false);
  const [revision, setRevision] = useState(0);
  const canPreview = path.startsWith("/") && !path.includes("[");
  return <div className="pt-8 lg:pt-0">
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#f4efe6] py-4">
      <div><Link href="/admin/pages" className="text-sm text-accent underline">All pages</Link><h1 className="mt-2 text-2xl font-semibold">{title}</h1></div>
      {canPreview && <div className="flex gap-3"><button type="button" className="btn btn-outline" onClick={() => { setPreview(v => !v); setRevision(v => v + 1); }}>{preview ? "Hide preview" : "Preview page"}</button><Link href={path} target="_blank" className="btn btn-outline">View website</Link></div>}
    </div>
    {settings && <PageSettingsForm id={id} settings={settings} onSaved={next => setPageInfo({ title: next.title, path: next.path })} />}
    <p className="my-4 text-sm text-foreground-soft">Choose a section, edit its text or photos, then Save content. The page keeps its existing design.</p>
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Page sections" className="self-start border border-line bg-white p-3 lg:sticky lg:top-28"><p className="mb-3 px-2 text-xs font-semibold uppercase">Page sections</p>{sections.map((s, i) => <button type="button" key={s.key} aria-pressed={s.key === selected} onClick={() => setSelected(s.key)} className={"mb-1 block w-full px-3 py-3 text-left text-sm " + (s.key === selected ? "bg-accent text-white" : "hover:bg-background")}>{i + 1}. {s.label}</button>)}</nav>
      <div className="min-w-0">{sections.map(s => <section key={s.key} hidden={s.key !== selected} className="border border-line bg-white p-4 sm:p-6"><h2 className="text-xl font-semibold">{s.label}</h2>{s.hint && <p className="mt-2 text-sm text-foreground-soft">{s.hint}</p>}{s.shared && <p className="mt-3 border border-line p-3 text-sm">Shared content: saving also updates {s.shared}.</p>}<EditorialEditor sections={[s]} /></section>)}</div>
    </div>
    {preview && canPreview && <section className="mt-6 border border-line bg-white p-3"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><p className="text-sm">Published preview. Save your content, then refresh to see changes.</p><button type="button" className="btn btn-outline" onClick={() => setRevision(v => v + 1)}>Refresh preview</button></div><iframe key={revision} src={path} title={title + " preview"} className="h-[650px] w-full border border-line" /></section>}
  </div>;
}
