"use client";
import { useId, useState } from "react";
import dynamic from "next/dynamic";
import { hasTextFormatting, plainText } from "@/lib/editorial/text";
const RichEditor = dynamic(() => import("./rich-editor"), { ssr: false, loading: () => <p className="border border-line p-3 text-sm">Loading text tools...</p> });

export default function FormattedTextField({ label, value, onChange, name, inline = true }: { label: string; value: string; onChange: (value: string) => void; name?: string; inline?: boolean }) {
  const id = useId();
  const [formatting, setFormatting] = useState(!inline || hasTextFormatting(value));
  return <div className="min-w-0 space-y-2">
    <div className="flex flex-wrap items-center justify-between gap-2"><label htmlFor={formatting ? undefined : id} className="text-sm">{label}</label><button type="button" onClick={() => setFormatting(current => !current)} className="text-xs text-accent underline">{formatting ? "Hide text tools" : "Format text"}</button></div>
    {name && <input type="hidden" name={name} value={value} />}
    {formatting ? <RichEditor value={value} onChange={onChange} inline={inline} label={label} /> : <textarea id={id} className="w-full border border-line bg-white p-3 text-sm leading-relaxed" rows={plainText(value).length > 160 ? 4 : 2} value={plainText(value)} onChange={event => onChange(event.target.value)} />}
  </div>;
}
