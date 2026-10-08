"use client";

import { useMemo, useState } from "react";
import { savePage } from "@/lib/admin/actions";
import {
  BLOCK_LABELS,
  coerceBlocks,
  newId,
  type Block,
  type Card,
} from "@/lib/blocks";
import type { BuilderPage } from "@/lib/cms";
import RichEditor from "./rich-editor";
import FormattedTextField from "./formatted-text-field";
import ImageField from "./image-field";
import BlockInserter from "./block-inserter";
import { useFormStatus } from "react-dom";
function SaveButton() { const { pending } = useFormStatus(); return <button type="submit" disabled={pending} className="bg-accent px-4 py-2 text-sm font-semibold text-accent-ink disabled:opacity-50">{pending ? "Saving..." : "Save page"}</button>; }

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
  const duplicate = (block: Block) => setBlocks(bs => { const index = bs.findIndex(b => b.id === block.id); const copy = structuredClone(block); copy.id = newId(); if (copy.type === "card-grid") copy.cards = copy.cards.map(c => ({ ...c, id: newId("c") })); return [...bs.slice(0, index + 1), copy, ...bs.slice(index + 1)]; });

  return (
    <form action={savePage} className="max-w-4xl space-y-6 pb-24">
      {page && <input type="hidden" name="id" value={page.id} />}
      <input type="hidden" name="blocks" value={blocksJson} />

      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl italic">{page ? "Edit page" : "New page"}</h1>
        <SaveButton />
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
          <select name="status" defaultValue={page?.status ?? "draft"} className={field}>
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

      <BlockInserter onAdd={block => setBlocks(bs => [...bs, block])} />
      <p className="text-sm text-foreground-soft">Add blocks and edit visually. Text tools include bold, font family, colours, headings, lists, links and images.</p>
      <div className="space-y-4">
        {blocks.length === 0 && <p className="border border-dashed border-line p-8 text-center">Choose a block above to start.</p>}
        {blocks.map((b, i) => (
          <div key={b.id} className="border border-line">
            <div className="flex items-center gap-2 border-b border-line bg-line/30 px-3 py-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                {BLOCK_LABELS[b.type]}
              </span>
              <span className="flex-1" />
              <button type="button" aria-label="Move block up" disabled={i === 0} onClick={() => move(i, -1)} className={chip}>
                ↑
              </button>
              <button type="button" aria-label="Move block down" disabled={i === blocks.length - 1} onClick={() => move(i, 1)} className={chip}>
                ↓
              </button>
              <button type="button" onClick={() => duplicate(b)} className={chip}>Duplicate</button>
              <button
                type="button"
                onClick={() => { if (window.confirm("Remove this block?")) remove(b.id); }}
                className="px-2 py-1.5 text-[11px] font-semibold uppercase text-red-700 underline"
              >
                Remove
              </button>
            </div>

            <div className="space-y-3 p-3">
              <details><summary className="cursor-pointer text-sm text-foreground-soft">Block appearance (optional)</summary>
              <div className="mt-3 flex flex-wrap items-center gap-4">
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

              </details>
              {b.type === "rich-text" && <RichEditor value={b.html} onChange={html => patch(b.id, { html })} />}
              {b.type === "html" && (
                <div>
                  <label className={label}>
                    Custom HTML (embeds allowed, no scripts)
                  </label>
                  <textarea
                    value={b.html}
                    onChange={(e) => patch(b.id, { html: e.target.value })}
                    rows={6}
                    className={`${field} font-mono text-xs`}
                  />
                </div>
              )}

              {b.type === "image" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <ImageField value={b.src} onChange={src => patch(b.id, { src })} />
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
                    <FormattedTextField label="Caption" value={b.caption ?? ""} onChange={caption => patch(b.id, { caption })} />
                  </div>
                </div>
              )}

              {b.type === "card-grid" && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <FormattedTextField label="Heading (optional)" value={b.heading ?? ""} onChange={heading => patch(b.id, { heading })} />
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
                          {k === "image" ? <ImageField value={c.image ?? ""} onChange={image => patch(b.id, { cards: b.cards.map(x => x.id === c.id ? { ...x, image } : x) } as Partial<Block>)} /> : k === "title" || k === "text" ? <FormattedTextField label={lbl} value={c[k] ?? ""} onChange={value => patch(b.id, { cards: b.cards.map(x => x.id === c.id ? { ...x, [k]: value } : x) } as Partial<Block>)} /> : <input
                            value={(c[k] as string) ?? ""}
                            onChange={(e) => {
                              const cards = b.cards.map((x) =>
                                x.id === c.id ? { ...x, [k]: e.target.value } : x,
                              );
                              patch(b.id, { cards } as Partial<Block>);
                            }}
                            className={field}
                          />}
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

      <BlockInserter onAdd={block => setBlocks(bs => [...bs, block])} />
    </form>
  );
}
