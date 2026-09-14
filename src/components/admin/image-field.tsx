"use client";

import Image from "@/components/editorial/image";
import { useEffect, useId, useRef, useState } from "react";
import { compressImage } from "@/lib/image-compress";

// Accept anything a human might paste — a full Windows path, a file:// URL, a
// bare filename — and reduce it to something next/image can load: an http(s)
// URL or a root-relative `/…` path. Everything up to and including `public/`
// is dropped and backslashes are flattened to `/`.
function toWebPath(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (/^(https?:|data:|blob:)/i.test(v)) return v;
  let p = v.replace(/^file:\/\/\/?/i, "").replace(/\\/g, "/");
  const pub = p.match(/(?:^|\/)public\/(.+)$/i);
  if (pub) p = pub[1];
  p = p.replace(/^[a-zA-Z]:\//, ""); // strip leftover drive letter
  p = p.startsWith("/") ? p : `/${p}`;
  return p.replace(/^\/uploads\//, "/media/"); // legacy local-upload path

}

const isValidSrc = (v: string) => /^(\/|https?:|data:|blob:)/i.test(v);

export default function ImageField({
  name,
  label = "Image",
  defaultValue = "",
  value,
  onChange,
}: {
  name?: string;
  label?: string;
  defaultValue?: string;
  /** Controlled mode: pass value + onChange instead of name/defaultValue (used
   *  outside a plain <form>, e.g. the block-builder's React state). */
  value?: string;
  onChange?: (v: string) => void;
}) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(() => toWebPath(defaultValue));
  useEffect(() => {
    if (!controlled) setInternal(toWebPath(defaultValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, controlled]);
  const url = controlled ? value : internal;
  const setUrl = (v: string) => {
    if (controlled) onChange?.(v);
    else setInternal(v);
  };
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      setErr("That file is not an image.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed);
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
      {name ? <input type="hidden" name={name} value={url} /> : null}

      <div className="mt-1.5 flex flex-wrap items-start gap-4">
        <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded border border-line bg-[#f4efe6]">
          {isValidSrc(url) ? (
            <>
              <Image src={url} alt="" fill sizes="160px" className="object-cover" />
              <button
                type="button"
                onClick={() => setUrl("")}
                className="absolute right-1 top-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white"
              >
                Remove
              </button>
            </>
          ) : (
            <span className="grid h-full w-full place-items-center text-[10px] text-muted">
              no image
            </span>
          )}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) void upload(f);
          }}
          onPaste={(e) => {
            const f = e.clipboardData.files?.[0];
            if (f) void upload(f);
          }}
          className={`min-w-[16rem] flex-1 rounded border border-dashed px-4 py-4 text-center transition-colors ${
            drag ? "border-accent bg-accent/5" : "border-line bg-background"
          }`}
        >
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="btn btn-outline btn-sm"
          >
            {busy ? "Uploading…" : "Choose image from computer"}
          </button>
          <p className="mt-2 text-[11px] text-muted">
            or drag &amp; drop / paste an image here · JPG, PNG, WEBP or GIF — large photos are shrunk automatically
          </p>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={(e) => setUrl(toWebPath(e.target.value))}
            placeholder="…or paste an image URL"
            className="mt-3 w-full border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
          />
          {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
        </div>
      </div>
    </div>
  );
}
