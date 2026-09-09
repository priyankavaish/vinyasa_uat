"use client";

import { useMemo, useState } from "react";
import { savePage } from "@/lib/admin/actions";
import {
  BLOCK_LABELS,
  coerceBlocks,
  emptyBlock,
  newId,
  type Block,
  type BlockType,
  type Card,
} from "@/lib/blocks";
import type { BuilderPage } from "@/lib/cms";

const field =
  "mt-1 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-soft";
const chip =
  "border border-line px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] hover:bg-line/40";

function ColorInput({
  value,
  onChange,
  title,
}: {
  value?: string;
  onChange: (v: string) => void;
  title: string;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px]">
      <span className={label}>{title}</span>
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-9 cursor-pointer border border-line bg-transparent"
      />
      <input
        type="text"
        value={value ?? ""}
        placeholder="inherit"
        onChange={(e) => onChange(e.target.value)}
        className="w-24 border border-line bg-background px-1.5 py-1 text-xs"
      />
      {value ? (
        <button type="button" onClick={() => onChange("")} className="text-xs underline">
          clear
        </button>
      ) : null}
    </label>
  );
}

export default function PageBuilder({ page }: { page?: BuilderPage }) {
  const [blocks, setBlocks] = useState<Block[]>(() => coerceBlocks(page?.blocks ?? []));
  const blocksJson = useMemo(() => JSON.stringify(blocks), [blocks]);

  const patch = (id: string, next: Partial<Block>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? ({ ...b, ...next } as Block) : b)));
  const move = (i: number, dir: -1 | 1) =>
    setBlocks((bs) => {
      const j = i + dir;
      if (j < 0 || j >= bs.length) return bs;
      const copy = [...bs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const remove = (id: string) => setBlocks((bs) => bs.filter((b) => b.id !== id));
  const add = (type: BlockType) => setBlocks((bs) => [...bs, emptyBlock(type)]);

  return (
    <form action={savePage} className="max-w-4xl space-y-6 pb-24">
      {page && <input type="hidden" name="id" value={page.id} />}
      <input type="hidden" name="blocks" value={blocksJson} />

      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl italic">{page ? "Edit page" : "New page"}</h1>
        <button
          type="submit"
          className="bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink"
        >
          Save
        </button>
      </div>

      <div className="grid gap-4 border border-line p-4 sm:grid-cols-2">
        <div>
          <label className={label}>Title</label>
          <input name="title" required defaultValue={page?.title} className={field} />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input name="slug" defaultValue={page?.slug} placeholder="auto from title" className={field} />
        </div>
        <div>
          <label className={label}>Status</label>
          <select name="status" defaultValue={page ? undefined : "draft"} className={field}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className={label}>Layout</label>
          <select name="layout" defaultValue={page?.layout ?? "boxed"} className={field}>
            <option value="boxed">Boxed (max 1152px)</option>
            <option value="narrow">Narrow (max 672px)</option>
            <option value="full">Full width</option>
          </select>
        </div>
        <div>
          <label className={label}>SEO title</label>
          <input name="seoTitle" defaultValue={page?.seoTitle} className={field} />
        </div>
        <div>
          <label className={label}>SEO description</label>
          <input name="seoDescription" defaultValue={page?.seoDescription} className={field} />
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((b, i) => (
          <div key={b.id} className="border border-line">
            <div className="flex items-center gap-2 border-b border-line bg-line/30 px-3 py-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                {BLOCK_LABELS[b.type]}
              </span>
              <span className="flex-1" />
              <button type="button" onClick={() => move(i, -1)} className={chip}>
                ↑
              </button>
              <button type="button" onClick={() => move(i, 1)} className={chip}>
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(b.id)}
                className="px-2 py-1.5 text-[11px] font-semibold uppercase text-red-700 underline"
              >
                Remove
              </button>
            </div>

            <div className="space-y-3 p-3">
              <div className="flex flex-wrap items-center gap-4">
                <ColorInput title="BG" value={b.bg} onChange={(v) => patch(b.id, { bg: v })} />
                <ColorInput title="Text" value={b.color} onChange={(v) => patch(b.id, { color: v })} />
                <label className="text-[11px]">
                  <span className={label}>Padding</span>
                  <select
                    value={b.padY ?? "md"}
                    onChange={(e) => patch(b.id, { padY: e.target.value as Block["padY"] })}
                    className="ml-1 border border-line bg-background px-1.5 py-1 text-xs"
                  >
                    <option value="none">none</option>
                    <option value="sm">small</option>
                    <option value="md">medium</option>
                    <option value="lg">large</option>
                  </select>
                </label>
                <label className="text-[11px]">
                  <span className={label}>Align</span>
                  <select
                    value={b.align ?? "left"}
                    onChange={(e) => patch(b.id, { align: e.target.value as Block["align"] })}
                    className="ml-1 border border-line bg-background px-1.5 py-1 text-xs"
                  >
                    <option value="left">left</option>
                    <option value="center">center</option>
                  </select>
                </label>
                <label className="text-[11px]">
                  <span className={label}>Width</span>
                  <select
                    value={b.width ?? "inherit"}
                    onChange={(e) => patch(b.id, { width: e.target.value as Block["width"] })}
                    className="ml-1 border border-line bg-background px-1.5 py-1 text-xs"
                  >
                    <option value="inherit">page default</option>
                    <option value="narrow">narrow</option>
                    <option value="boxed">boxed</option>
                    <option value="full">full</option>
                  </select>
                </label>
              </div>

              {(b.type === "rich-text" || b.type === "html") && (
                <div>
                  <label className={label}>
                    {b.type === "html" ? "Custom HTML (embeds allowed, no scripts)" : "HTML / text"}
                  </label>
                  <textarea
                    value={b.html}
                    onChange={(e) => patch(b.id, { html: e.target.value })}
                    rows={b.type === "html" ? 6 : 4}
                    className={`${field} font-mono text-xs`}
                  />
                </div>
              )}

              {b.type === "image" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={label}>Image URL</label>
                    <input
                      value={b.src}
                      onChange={(e) => patch(b.id, { src: e.target.value })}
                      className={field}
                    />
                  </div>
                  <div>
                    <label className={label}>Alt text</label>
                    <input
                      value={b.alt ?? ""}
                      onChange={(e) => patch(b.id, { alt: e.target.value })}
                      className={field}
                    />
                  </div>
                  <div>
                    <label className={label}>Link (optional)</label>
                    <input
                      value={b.href ?? ""}
                      onChange={(e) => patch(b.id, { href: e.target.value })}
                      className={field}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Caption</label>
                    <input
                      value={b.caption ?? ""}
                      onChange={(e) => patch(b.id, { caption: e.target.value })}
                      className={field}
                    />
                  </div>
                </div>
              )}

              {b.type === "card-grid" && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={label}>Heading (optional)</label>
                      <input
                        value={b.heading ?? ""}
                        onChange={(e) => patch(b.id, { heading: e.target.value })}
                        className={field}
                      />
                    </div>
                    <label className="text-[11px]">
                      <span className={label}>Columns</span>
                      <select
                        value={b.cols ?? 3}
                        onChange={(e) => patch(b.id, { cols: Number(e.target.value) as 2 | 3 | 4 })}
                        className="ml-1 border border-line bg-background px-1.5 py-1 text-xs"
                      >
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </label>
                  </div>

                  {b.cards.map((c, ci) => (
                    <div key={c.id} className="grid gap-2 border border-line p-2 sm:grid-cols-2">
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase">Card {ci + 1}</span>
                        <span className="flex-1" />
                        <button
                          type="button"
                          onClick={() =>
                            patch(b.id, {
                              cards: b.cards.filter((x) => x.id !== c.id),
                            } as Partial<Block>)
                          }
                          className="text-[11px] text-red-700 underline"
                        >
                          remove
                        </button>
                      </div>
                      {(
                        [
                          ["image", "Image URL"],
                          ["title", "Title"],
                          ["text", "Text"],
                          ["href", "Link"],
                        ] as const
                      ).map(([k, lbl]) => (
                        <div key={k} className={k === "text" ? "sm:col-span-2" : ""}>
                          <label className={label}>{lbl}</label>
                          <input
                            value={(c[k] as string) ?? ""}
                            onChange={(e) => {
                              const cards = b.cards.map((x) =>
                                x.id === c.id ? { ...x, [k]: e.target.value } : x,
                              );
                              patch(b.id, { cards } as Partial<Block>);
                            }}
                            className={field}
                          />
                        </div>
                      ))}
                      <div className="sm:col-span-2 flex flex-wrap gap-4">
                        <ColorInput
                          title="Card BG"
                          value={c.bg}
                          onChange={(v) =>
                            patch(b.id, {
                              cards: b.cards.map((x) => (x.id === c.id ? { ...x, bg: v } : x)),
                            } as Partial<Block>)
                          }
                        />
                        <ColorInput
                          title="Card text"
                          value={c.color}
                          onChange={(v) =>
                            patch(b.id, {
                              cards: b.cards.map((x) => (x.id === c.id ? { ...x, color: v } : x)),
                            } as Partial<Block>)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      patch(b.id, {
                        cards: [...b.cards, { id: newId("c"), title: "Card title" } as Card],
                      } as Partial<Block>)
                    }
                    className={chip}
                  >
                    + Add card
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <span className={label}>Add block:</span>
        {(Object.keys(BLOCK_LABELS) as BlockType[]).map((t) => (
          <button key={t} type="button" onClick={() => add(t)} className={chip}>
            + {BLOCK_LABELS[t]}
          </button>
        ))}
      </div>
    </form>
  );
}
