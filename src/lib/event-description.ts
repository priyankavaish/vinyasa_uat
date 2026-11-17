import { cleanInlineText, plainText } from "./editorial/text";

/** Preserve the editor's paragraph breaks while fitting inline description slots. */
export function eventDescriptionHtml(value: string): string {
  const isHtml = /<\/?[a-z][^>]*>/i.test(value);
  const html = isHtml
    ? value.replace(/<\/(?:p|h[234]|li|blockquote)>/gi, "<br>")
    : value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, "<br>");
  return cleanInlineText(html).replace(/(?:<br\s*\/?>\s*)+$/gi, "");
}
export function eventDescriptionText(value: string): string {
  return plainText("<span>" + eventDescriptionHtml(value).replace(/<br\s*\/?>/gi, " ") + "</span>").replace(/\s+/g, " ").trim();
}
