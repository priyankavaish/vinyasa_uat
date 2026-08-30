"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageField({
  name,
  label = "Image",
  defaultValue = "",
}: {
  name: string;
  label?: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? "Upload failed.");
      setUrl(body.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft">
        {label}
      </label>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1.5 flex items-center gap-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded border border-line bg-[#f4efe6]">
          {url ? (
            <Image src={url} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-[10px] text-muted">
              none
            </span>
          )}
        </div>
        <div className="min-w-0">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-xs"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="or paste an image URL / path"
            className="mt-1.5 w-full border border-line bg-background px-2 py-1 text-xs outline-none focus:border-accent"
          />
          {busy && <p className="mt-1 text-xs text-foreground-soft">Uploading…</p>}
          {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
        </div>
      </div>
    </div>
  );
}
