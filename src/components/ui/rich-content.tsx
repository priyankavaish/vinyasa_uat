import { buttonArrowMarkup } from "@/lib/button-arrow";
import sanitizeHtml from "sanitize-html";

/** Renders admin-authored HTML (blog posts, cottage/event detail bodies).
 *  Sanitised again at render time as defence in depth. Styling lives in the
 *  `.rich` block in globals.css.
 *  Uses sanitize-html (pure JS, htmlparser2) rather than isomorphic-dompurify:
 *  dompurify's jsdom dependency crashes at runtime on Vercel's serverless
 *  functions. */
export default function RichContent({ html, className = "", eventActions = false }: { html: string; className?: string; eventActions?: boolean }) {
  if (!html) return null;
  const clean = sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li",
      "blockquote", "a", "img", "span", "hr", "figure", "figcaption",
    ],
    allowedAttributes: {
      "*": ["style", "class"],
      a: ["href", "title", "target", "rel", "data-btn", "data-variant"],
      img: ["src", "alt", "title", "width", "height"],
    },
    transformTags: eventActions ? { a: (tagName, attribs) => ({tagName, attribs: {...attribs, ...(/(?:#(?:residency|artist-unite)-application|\/book(?:\?|$)|rzp\.io|\/contact(?:#|$))/.test(attribs.href || "") && !/^(mailto|tel):/.test(attribs.href || "") ? {"data-btn":"true","data-variant":"accent"} : {})}}) } : undefined,
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
  });
  const rendered = eventActions ? clean.replace(/(<a\b[^>]*\bdata-btn[^>]*>)([\s\S]*?)(<\/a>)/gi, (_, open, body, close) => open + body.replace(/(?:\u2197|\u2192|&rarr;|&#8599;)/g, "").trim() + " " + buttonArrowMarkup + close) : clean;
  return (
    <div className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: rendered }} />
  );
}
