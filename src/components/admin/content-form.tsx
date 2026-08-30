"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveContent } from "@/lib/admin/actions";

type FieldDef = { path: string; label: string; multiline?: boolean };

export type ContentGroup = {
  key: string;
  title: string;
  fields?: FieldDef[]; // structured string fields (dot paths)
  json?: boolean; // edit the whole value as JSON instead
};

function getPath(obj: unknown, path: string): string {
  let cur: unknown = obj;
  for (const p of path.split(".")) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else return "";
  }
  return typeof cur === "string" ? cur : "";
}

function setPath(obj: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ?? {};
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

export default function ContentForm({
  group,
  value,
}: {
  group: ContentGroup;
  value: unknown;
}) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (group.fields ?? []).forEach((f) => (init[f.path] = getPath(value, f.path)));
    return init;
  });
  const [json, setJson] = useState(() => JSON.stringify(value ?? null, null, 2));
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMsg(null);
    try {
      let payload: unknown;
      if (group.json) {
        payload = JSON.parse(json);
      } else {
        const obj: Record<string, unknown> = {};
        for (const [path, v] of Object.entries(state)) setPath(obj, path, v);
        payload = obj;
      }
      await saveContent(group.key, payload);
      setStatus("done");
      setMsg("Saved.");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Could not save.");
    }
  }

  const field =
    "mt-1 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg italic">{group.title}</h3>
        <code className="text-[11px] text-muted">{group.key}</code>
      </div>

      <div className="mt-3 space-y-3">
        {group.json ? (
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={12}
            spellCheck={false}
            className={`${field} font-mono text-xs`}
          />
        ) : (
          (group.fields ?? []).map((f) => (
            <div key={f.path}>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-soft">
                {f.label}
              </label>
              {f.multiline ? (
                <textarea
                  rows={4}
                  value={state[f.path] ?? ""}
                  onChange={(e) => setState((s) => ({ ...s, [f.path]: e.target.value }))}
                  className={field}
                />
              ) : (
                <input
                  value={state[f.path] ?? ""}
                  onChange={(e) => setState((s) => ({ ...s, [f.path]: e.target.value }))}
                  className={field}
                />
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn btn-accent btn-sm disabled:opacity-60">
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {msg && (
          <span className={`text-xs ${status === "error" ? "text-red-700" : "text-secondary"}`}>
            {msg}
          </span>
        )}
      </div>
    </form>
  );
}
