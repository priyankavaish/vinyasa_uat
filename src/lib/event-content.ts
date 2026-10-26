import { plainText } from "@/lib/editorial/text";

export type EventContentSection = { title: string; bodyHtml: string };
export type EventContent = { introductionHtml: string; sections: EventContentSection[] };

/** Admin-authored headings become sections in the shared event template.
 * RichContent sanitizes every resulting HTML fragment before rendering. */
export function splitEventContent(html: string): EventContent {
  const headings = [...html.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi)];
  if (!headings.length) return { introductionHtml: html, sections: [] };
  return {
    introductionHtml: html.slice(0, headings[0].index),
    sections: headings.map((heading, index) => ({
      title: plainText("<span>" + heading[2] + "</span>").trim() || "Event details",
      bodyHtml: html.slice((heading.index ?? 0) + heading[0].length, headings[index + 1]?.index ?? html.length),
    })),
  };
}
