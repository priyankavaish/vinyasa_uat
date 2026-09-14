"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveEditorial } from "@/lib/editorial/actions";
import ImageField from "./image-field";
import { isEditorialImageField, isEditorialVideoField, isEditorialAdvancedField } from "@/lib/editorial/fields";
type Section = { key: string; defaults: unknown; value: unknown };
type Data = Record<string, unknown>;
// Generated field names look like "text_12", "href_5", "aria_label_6" — the
// number is meaningless to an editor. Give the common generated prefixes a
// plain-English label instead of showing the raw key.
const GENERATED_FIELD_LABELS: Record<string, string> = {
  text: "Text",
  heading: "Heading",
  title: "Title",
  href: "Link",
  src: "Image",
  alt: "Image description",
  aria_label: "Accessibility label",
  label: "Label",
};
const titleCase = (s: string) =>
  s.replace(/[-_]+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());

// Only ever show the last step of a field's path, never the full
// "Content.testimonials / 1.name" breadcrumb — that's internal bookkeeping,
// not something an editor needs to read.
const human = (path: string) => {
  // Section-picker dropdown passes a catalog key like "app/(site)/about/page".
  if (path.includes("/") && !path.includes(" / ")) {
    return path
      .replace(/app\/\(site\)\//, "Page / ")
      .replace(/components\/(sections|layout|forms)\//, "Shared / ")
      .replace(/\/page$/, "")
      .replace(/[-_]/g, " ");
  }
  const last = path.split(".").pop() ?? path;
  const arrayItem = last.match(/^(.*) \/ (\d+)$/);
  if (arrayItem) {
    const parentWord = arrayItem[1].split(/[/.]/).pop() ?? arrayItem[1];
    const singular = titleCase(parentWord).replace(/s$/i, "");
    return `${singular} ${arrayItem[2]}`;
  }
  const generated = last.match(/^([a-z_]+?)_\d+$/i);
  if (generated && GENERATED_FIELD_LABELS[generated[1]]) return GENERATED_FIELD_LABELS[generated[1]];
  return titleCase(last);
};
function Fields({ value, template, path, onChange }: { value: unknown; template: unknown; path: string; onChange: (value: unknown) => void }) {
  if (Array.isArray(value)) return <fieldset className="min-w-0 space-y-3 border border-line p-4">{path !== "Content" && <legend className="max-w-full break-words px-2 font-semibold">{human(path)}</legend>}{value.map((entry, index) => <div key={index} className="space-y-2 border-b border-line pb-4"><Fields value={entry} template={Array.isArray(template) ? template[index] ?? template[0] : entry} path={`${path} / ${index + 1}`} onChange={next => onChange(value.map((old, i) => i === index ? next : old))} /><button type="button" className="text-sm text-accent underline" onClick={() => onChange(value.filter((_, i) => i !== index))}>Remove item</button></div>)}<button type="button" className="btn btn-outline" onClick={() => onChange([...value, structuredClone(Array.isArray(template) ? template[0] : "")])}>Add item</button></fieldset>;
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([key]) => !["blurDataURL", "blurWidth", "blurHeight"].includes(key));
    const main = entries.filter(([key]) => !isEditorialAdvancedField(`${path}.${key}`));
    const advanced = entries.filter(([key]) => isEditorialAdvancedField(`${path}.${key}`));
    const renderField = ([key, child]: [string, unknown]) => (
      <Fields key={key} value={child} template={(template as Data)?.[key]} path={`${path}.${key}`} onChange={next => onChange({ ...value, [key]: next })} />
    );
    return (
      <fieldset className={path === "Content" ? "min-w-0 grid gap-4" : "min-w-0 grid gap-4 border border-line p-4"}>
        {path !== "Content" && <legend className="max-w-full break-words px-2 font-semibold">{human(path)}</legend>}
        {main.map(renderField)}
        {advanced.length > 0 && (
          <details>
            <summary className="cursor-pointer text-sm text-foreground-soft">Advanced (rarely needed)</summary>
            <div className="mt-3 grid gap-4">{advanced.map(renderField)}</div>
          </details>
        )}
      </fieldset>
    );
  }
  if (typeof value === "boolean") return <label className="flex gap-3 text-sm"><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />{human(path)}</label>;
  if (typeof value === "number") return <label className="grid min-w-0 gap-2 break-words text-sm">{human(path)}<input className="border border-line bg-white p-3" type="number" value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
  const text = String(value ?? "");
  if (isEditorialImageField(path, text)) return <div><ImageField name={path} label={human(path)} defaultValue={text} /></div>;
  if (isEditorialVideoField(path, text)) {
    return (
      <div className="min-w-0">
        <label className="block text-sm font-semibold">{human(path)}</label>
        {text ? (
          <video src={text} muted loop controls className="mt-2 max-h-48 w-full max-w-sm rounded border border-line bg-black object-cover" />
        ) : null}
        <input
          name={path}
          data-field={path}
          type="text"
          placeholder="Paste a video URL (mp4)"
          className="mt-2 w-full border border-line bg-white p-3 text-sm"
          value={text}
          onChange={e => onChange(e.target.value)}
        />
        <p className="mt-1 text-xs text-foreground-soft">Upload this file to your video host or Vercel Blob first, then paste its URL here — videos are too large for the image uploader.</p>
      </div>
    );
  }
  return <label className="grid min-w-0 gap-2 break-words text-sm">{human(path)}<textarea name={path} data-field={path} className="w-full border border-line bg-white p-3 leading-relaxed" rows={text.length > 160 ? 4 : 2} value={text} onChange={e => onChange(e.target.value)} /></label>;
}
export default function EditorialEditor({ sections, initialSection }: { sections: Section[]; initialSection?: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const [selected, setSelected] = useState(sections.some(s => s.key === initialSection) ? initialSection! : sections[0]?.key ?? "");
  const section = sections.find(s => s.key === selected)!;
  const [draft, setDraft] = useState(section?.value);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  async function save(form: HTMLFormElement) {
    setSaving(true); setStatus("");
    try {
      // Uploaded images keep their current URL in the named field.
      const data = structuredClone(draft) as Data;
      const values = new FormData(form);
      function syncMedia(current: unknown, prefix: string): unknown {
        if (Array.isArray(current)) return current.map((v, i) => syncMedia(v, `${prefix} / ${i + 1}`));
        if (current && typeof current === "object") return Object.fromEntries(Object.entries(current).map(([k,v]) => [k, syncMedia(v, `${prefix}.${k}`)]));
        return values.has(prefix) ? String(values.get(prefix)) : current;
      }
      const payload = syncMedia(data, "Content");
      await saveEditorial(selected, payload);
      setDraft(payload);
      setStatus("Saved. Your website now uses this content."); router.refresh();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Could not save."); }
    finally { setSaving(false); }
  }
  return <div className="mt-8 min-w-0 [&_input]:max-w-full [&_textarea]:min-w-0">{sections.length > 1 && <label className="grid gap-2 text-sm font-semibold">Section<select value={selected} className="w-full border border-line bg-white p-3" onChange={e => { const next = sections.find(s => s.key === e.target.value)!; setSelected(next.key); setDraft(next.value); setStatus(""); setRevision(v=>v+1); }} disabled={!ready || saving}>{sections.map(s => <option key={s.key} value={s.key}>{human(s.key)}</option>)}</select></label>}<form className="mt-6 space-y-5" onSubmit={e => { e.preventDefault(); void save(e.currentTarget); }}><fieldset className="min-w-0" disabled={!ready || saving}><Fields key={`${selected}:${revision}`} value={draft} template={section.defaults} path="Content" onChange={setDraft} /></fieldset><div className="sticky bottom-0 flex flex-wrap items-center gap-4 border border-line bg-[#f4efe6] p-4"><button disabled={!ready || saving} className="btn btn-accent" type="submit">{saving ? "Saving…" : "Save content"}</button><button type="button" disabled={!ready || saving} className="text-sm underline" onClick={() => { setDraft(section.defaults); setRevision(v=>v+1); setStatus("Defaults loaded. Save to apply."); }}>Load original content</button><p role="status" className="text-sm">{status}</p></div></form></div>;
}
