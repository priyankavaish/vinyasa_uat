// Shared block model for builder-made pages. Pure types + helpers, no server
// deps — imported by both the admin editor and the public renderer.

export type BlockType = "rich-text" | "image" | "card-grid" | "html";

export type PageLayout = "boxed" | "full" | "narrow";
export type PadY = "none" | "sm" | "md" | "lg";
export type BlockWidth = "inherit" | "full" | "boxed" | "narrow";

export type BlockBase = {
  id: string;
  bg?: string;
  color?: string;
  padY?: PadY;
  align?: "left" | "center";
  width?: BlockWidth;
};

export type RichTextBlock = BlockBase & { type: "rich-text"; html: string };
export type ImageBlock = BlockBase & {
  type: "image";
  src: string;
  alt?: string;
  href?: string;
  caption?: string;
};
export type HtmlBlock = BlockBase & { type: "html"; html: string };

export type Card = {
  id: string;
  image?: string;
  title?: string;
  text?: string;
  href?: string;
  bg?: string;
  color?: string;
};
export type CardGridBlock = BlockBase & {
  type: "card-grid";
  heading?: string;
  cols?: 2 | 3 | 4;
  cards: Card[];
};

export type Block = RichTextBlock | ImageBlock | HtmlBlock | CardGridBlock;

export const BLOCK_LABELS: Record<BlockType, string> = {
  "rich-text": "Text",
  image: "Image",
  "card-grid": "Card grid",
  html: "Custom HTML",
};

let counter = 0;
export function newId(prefix = "b") {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

export function emptyBlock(type: BlockType): Block {
  const base = { id: newId(), padY: "md" as PadY, align: "left" as const, width: "inherit" as BlockWidth };
  switch (type) {
    case "rich-text":
      return { ...base, type, html: "<p></p>" };
    case "image":
      return { ...base, type, src: "", alt: "" };
    case "html":
      return { ...base, type, html: "" };
    case "card-grid":
      return {
        ...base,
        type,
        cols: 3,
        cards: [
          { id: newId("c"), title: "Card title", text: "Short description." },
          { id: newId("c"), title: "Card title", text: "Short description." },
          { id: newId("c"), title: "Card title", text: "Short description." },
        ],
      };
  }
}

export const PAD_Y_CLASS: Record<PadY, string> = {
  none: "",
  sm: "py-6 sm:py-8",
  md: "py-12 sm:py-16",
  lg: "py-20 sm:py-28",
};

export const WIDTH_CLASS: Record<Exclude<BlockWidth, "inherit">, string> = {
  full: "max-w-none",
  boxed: "max-w-6xl",
  narrow: "max-w-2xl",
};

export const LAYOUT_CLASS: Record<PageLayout, string> = {
  full: "max-w-none",
  boxed: "max-w-6xl",
  narrow: "max-w-2xl",
};

/** Normalise any parsed JSON into a Block[] we can trust to render. */
export function coerceBlocks(input: unknown): Block[] {
  if (!Array.isArray(input)) return [];
  const out: Block[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as Record<string, unknown>;
    const type = b.type as BlockType;
    if (!["rich-text", "image", "card-grid", "html"].includes(type)) continue;
    const base: BlockBase = {
      id: typeof b.id === "string" ? b.id : newId(),
      bg: typeof b.bg === "string" ? b.bg : undefined,
      color: typeof b.color === "string" ? b.color : undefined,
      padY: (["none", "sm", "md", "lg"] as const).includes(b.padY as PadY) ? (b.padY as PadY) : "md",
      align: b.align === "center" ? "center" : "left",
      width: (["inherit", "full", "boxed", "narrow"] as const).includes(b.width as BlockWidth)
        ? (b.width as BlockWidth)
        : "inherit",
    };
    if (type === "rich-text" || type === "html") {
      out.push({ ...base, type, html: typeof b.html === "string" ? b.html : "" });
    } else if (type === "image") {
      out.push({
        ...base,
        type,
        src: typeof b.src === "string" ? b.src : "",
        alt: typeof b.alt === "string" ? b.alt : "",
        href: typeof b.href === "string" ? b.href : undefined,
        caption: typeof b.caption === "string" ? b.caption : undefined,
      });
    } else {
      const cards = Array.isArray(b.cards)
        ? b.cards
            .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
            .map((c) => ({
              id: typeof c.id === "string" ? c.id : newId("c"),
              image: typeof c.image === "string" ? c.image : undefined,
              title: typeof c.title === "string" ? c.title : undefined,
              text: typeof c.text === "string" ? c.text : undefined,
              href: typeof c.href === "string" ? c.href : undefined,
              bg: typeof c.bg === "string" ? c.bg : undefined,
              color: typeof c.color === "string" ? c.color : undefined,
            }))
        : [];
      out.push({
        ...base,
        type,
        heading: typeof b.heading === "string" ? b.heading : undefined,
        cols: b.cols === 2 || b.cols === 4 ? b.cols : 3,
        cards,
      });
    }
  }
  return out;
}
