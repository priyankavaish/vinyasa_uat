import sanitizeHtml from "sanitize-html";

export const hasTextFormatting = (value: string) => /<\/?(?:strong|b|em|i|u|s|span|a|p|br)\b/i.test(value);

/** Inline formatting inherits the surrounding page's layout and typography. */
export function cleanInlineText(value: string, links = true): string {
  return sanitizeHtml(value, {
    allowedTags: ["strong", "b", "em", "i", "u", "s", "span", "br", ...(links ? ["a"] : [])],
    allowedAttributes: { span: ["style"], a: ["href", "title", "target", "rel"] },
    allowedStyles: { span: {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([0-9.,%\s]+\)$/i, /^[a-z]+$/i, /^var\(--[a-z0-9-]+\)$/i],
      "font-family": [/^[a-z0-9 ,\-'"()]+$/i],
    } },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });
}

/** Metadata and image descriptions remain plain, even when a heading is formatted. */
export function plainText(value: string): string {
  if (!hasTextFormatting(value)) return value;
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity: string) => {
      if (entity[0] === "#") {
        const number = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
        return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : "";
      }
      return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " } as Record<string, string>)[entity.toLowerCase()] ?? match;
    });
}
