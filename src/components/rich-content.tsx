import sanitizeHtml from "sanitize-html";

/** Renders admin-authored HTML (blog posts, cottage/event detail bodies).
 *  Sanitised again at render time as defence in depth. Styling lives in the
 *  `.rich` block in globals.css.
 *  Uses sanitize-html (pure JS, htmlparser2) rather than isomorphic-dompurify:
 *  dompurify's jsdom dependency crashes at runtime on Vercel's serverless
 *  functions. */
export default function RichContent({ html, className = "" }: { html: string; className?: string }) {
  if (!html) return null;
  const clean = sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li",
      "blockquote", "a", "img", "span", "hr", "figure", "figcaption",
    ],
    allowedAttributes: {
      "*": ["style", "class"],
      a: ["href", "title", "target", "rel", "data-btn", "data-variant"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
  });
  return (
    <div className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
