import DOMPurify from "isomorphic-dompurify";

/** Renders admin-authored HTML (blog posts, cottage/event detail bodies).
 *  Sanitised again at render time as defence in depth. Styling lives in the
 *  `.rich` block in globals.css. */
export default function RichContent({ html, className = "" }: { html: string; className?: string }) {
  if (!html) return null;
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li",
      "blockquote", "a", "img", "span", "hr", "figure", "figcaption",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "target", "rel", "style", "class",
      "data-btn", "data-variant",
    ],
    ALLOWED_URI_REGEXP: /^(https?:|mailto:|tel:|\/|#)/i,
  });
  return (
    <div className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
