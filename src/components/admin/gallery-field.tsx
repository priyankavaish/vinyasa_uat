"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const isValidSrc = (v: string) => /^(\/|https?:|data:|blob:)/i.test(v);

function toWebPath(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (/^(https?:|data:|blob:)/i.test(v)) return v;
  let p = v.replace(/^file:\/\/\/?/i, "").replace(/\\/g, "/");
  const pub = p.match(/(?:^|\/)public\/(.+)$/i);
  if (pub) p = pub[1];
  p = p.replace(/^[a-zA-Z]:\//, "");
  p = p.startsWith("/") ? p : `/${p}`;
  return p.replace(/^\/uploads\//, "/media/");
}

/** Multiple-image field: upload several photos at once (picker, drag-drop, or
 *  paste), each shown as a same-size thumbnail with drag-to-reorder and
 *  remove. Submits as one newline-separated value, same shape the save
 *  action already expects from the old one-URL-per-line textarea. */
export default function GalleryField({
  name,
  label = "Gallery",
  defaultValue = [],
}: {
  name: string;
  label?: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(() => defaultValue.map(toWebPath).filter(Boolean));
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragFrom = useRef<number | null>(null);

  async function uploadOne(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) return null;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error ?? "Upload failed.");
    return body.url as string;
  }

  async function uploadMany(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setErr(null);
    setBusy(list.length);
    const uploaded: string[] = [];
    for (const f of list) {
      try {
        const url = await uploadOne(f);
        if (url) uploaded.push(url);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy((n) => Math.max(0, n - 1));
      }
    }
    if (uploaded.length) setUrls((prev) => [...prev, ...uploaded]);
  }

  function remove(i: number) {
    setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  function reorder(from: number, to: number) {
    setUrls((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft">
        {label}
      </label>
      <input type="hidden" name={name} value={urls.join("\n")} />

      {urls.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((u, i) =>
            isValidSrc(u) ? (
              <div
                key={`${u}-${i}`}
                draggable
                onDragStart={() => { dragFrom.current = i; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragFrom.current !== null && dragFrom.current !== i) reorder(dragFrom.current, i);
                  dragFrom.current = null;
                }}
                className="group relative aspect-square cursor-grab overflow-hidden rounded border border-line bg-[#f4efe6] active:cursor-grabbing"
              >
                <Image src={u} alt="" fill sizes="140px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute right-1 top-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ) : null
          )}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files?.length) void uploadMany(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          if (e.clipboardData.files?.length) void uploadMany(e.clipboardData.files);
        }}
        className={`mt-2 rounded border border-dashed px-4 py-4 text-center transition-colors ${
          drag ? "border-accent bg-accent/5" : "border-line bg-background"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy > 0}
          onChange={(e) => {
            if (e.target.files?.length) void uploadMany(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy > 0}
          className="btn btn-outline btn-sm"
        >
          {busy > 0 ? `Uploading ${busy}…` : "Add images from computer"}
        </button>
        <p className="mt-2 text-[11px] text-muted">
          select several at once, drag &amp; drop, or paste · drag a thumbnail to reorder
        </p>
        {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
      </div>
    </div>
  );
}
