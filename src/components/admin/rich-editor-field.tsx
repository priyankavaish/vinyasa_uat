"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("./rich-editor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-line bg-white p-4 text-sm text-foreground-soft">
      Loading editor…
    </div>
  ),
});

/** Bridges the TipTap editor to a plain <form>: mirrors the HTML into a
 *  hidden input so the parent server-action form submits it as `name`. */
export default function RichEditorField({
  name,
  label,
  defaultValue = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft">
        {label}
      </label>
      <input type="hidden" name={name} value={html} />
      <div className="mt-1.5">
        <RichEditor value={defaultValue} onChange={setHtml} />
      </div>
    </div>
  );
}
