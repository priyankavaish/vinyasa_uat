"use client";
import { useState } from "react";
import { emptyBlock, type Block } from "@/lib/blocks";
const choices = [
  { name: "Button", description: "A button with a link and optional custom colours", html: '<p><a href="/contact" data-btn="true" data-variant="accent">Learn more</a></p>' },
  { name: "Paragraph", description: "Text with formatting, links and lists", html: "<p>Write your text here.</p>" },
  { name: "Heading", description: "A section title", html: "<h2>Your heading</h2>" },
  { name: "List", description: "Bullet points", html: "<ul><li>First item</li><li>Second item</li></ul>" },
  { name: "Quote", description: "A testimonial or quotation", html: "<blockquote><p>Your quote</p></blockquote>" },
  { name: "Separator", description: "A horizontal divider", html: "<hr>" },
  { name: "Image", description: "Upload a photo with a caption", type: "image" as const },
  { name: "Cards / columns", description: "Photos, titles, text and links", type: "card-grid" as const },
  { name: "Custom HTML / embed", description: "Advanced: video, map or custom embed", type: "html" as const },
];
export default function BlockInserter({ onAdd }: { onAdd: (block: Block) => void }) {
  const [query, setQuery] = useState("");
  return <details className="border border-line bg-white p-4" open>
    <summary className="cursor-pointer font-semibold">+ Add a block</summary>
    <input aria-label="Search blocks" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search blocks..." className="mt-4 w-full border border-line p-3 text-sm" />
    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{choices.filter(c => (c.name + c.description).toLowerCase().includes(query.toLowerCase())).map(c => <button type="button" key={c.name} className="border border-line p-3 text-left hover:bg-background" onClick={() => onAdd(c.type ? emptyBlock(c.type) : { ...emptyBlock("rich-text"), type: "rich-text", html: c.html! })}><span className="block text-sm font-semibold">{c.name}</span><span className="mt-1 block text-xs text-foreground-soft">{c.description}</span></button>)}</div>
  </details>;
}
