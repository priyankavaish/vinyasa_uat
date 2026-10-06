"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePageSettings } from "@/lib/page-settings-actions";
import type { PageSettings } from "@/lib/page-routing";
export default function PageSettingsForm({ id, settings, onSaved }: { id: string; settings: PageSettings; onSaved: (next: PageSettings) => void }) {
  const router = useRouter();
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const field = "mt-2 w-full border border-line bg-white p-3 text-sm";
  const edit = (key: "title" | "path" | "menuLabel" | "menuHref", value: string) => { setDraft(v => ({ ...v, [key]: value })); setMessage("Unsaved changes"); };
  return <details className="my-5 border border-line bg-white p-4" open><summary className="cursor-pointer font-semibold">Page name, URL & navigation</summary>
    <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={async e => { e.preventDefault(); setSaving(true); setMessage(""); try { const next = await savePageSettings(id, draft); setDraft(next); onSaved(next); setMessage("Saved. Page URL and existing navigation links are updated."); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save. Try again."); } finally { setSaving(false); } }}>
      <label className="text-sm font-semibold">Page name<input required maxLength={160} disabled={saving} className={field} value={draft.title} onChange={e => edit("title", e.target.value)} /><span className="mt-1 block text-xs font-normal text-foreground-soft">Name in Manage Pages. Edit visible headings and SEO in the sections below.</span></label>
      <label className="text-sm font-semibold">Page URL / slug<input required disabled={saving} className={field} value={draft.path} onChange={e => edit("path", e.target.value)} placeholder="/our-story" /><span className="mt-1 block text-xs font-normal text-foreground-soft">Example: /our-story. Existing URLs redirect here; page content and design stay the same.</span></label>
      <label className="text-sm font-semibold">Navigation label<input maxLength={120} disabled={saving} className={field} value={draft.menuLabel} onChange={e => edit("menuLabel", e.target.value)} placeholder="Keep existing menu text" /><span className="mt-1 block text-xs font-normal text-foreground-soft">Updates existing header and footer menu labels for this page. Leave blank to keep their current text.</span></label>
      <label className="text-sm font-semibold">Navigation link<input disabled={saving} className={field} value={draft.menuHref} onChange={e => edit("menuHref", e.target.value)} placeholder="Automatically use this page's URL" /><span className="mt-1 block text-xs font-normal text-foreground-soft">Leave blank to follow the page URL, or enter another destination such as /contact or https://example.com.</span></label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2"><button type="submit" disabled={saving} className="btn btn-accent">{saving ? "Saving..." : "Save page settings"}</button><p role="status" className="text-sm">{message}</p></div>
    </form>
  </details>;
}
