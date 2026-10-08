
import FormattedText from "@/components/editorial/formatted-text";
import { plainText } from "@/lib/editorial/text";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import RichContent from "@/components/ui/rich-content";
import {
  coerceBlocks,
  LAYOUT_CLASS,
  PAD_Y_CLASS,
  WIDTH_CLASS,
  type Block,
  type BlockBase,
  type PageLayout,
} from "@/lib/blocks";

/** Custom-HTML block: allows embeds (iframes from a host allowlist) but never
 *  <script>. Sanitised again here as defence in depth. */
function cleanEmbed(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "figure",
      "figcaption",
      "iframe",
      "span",
      "h1",
      "h2",
      "section",
      "video",
      "source",
    ]),
    allowedAttributes: {
      "*": ["style", "class", "id"],
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      video: ["src", "controls", "poster", "width", "height", "loop", "muted", "playsinline"],
      source: ["src", "type"],
      iframe: [
        "src",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "frameborder",
        "loading",
        "title",
        "style",
      ],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
      "www.google.com",
      "maps.google.com",
      "www.openstreetmap.org",
      "open.spotify.com",
    ],
    allowIframeRelativeUrls: false,
  });
}

function sectionStyle(b: BlockBase): React.CSSProperties {
  return { background: b.bg || undefined, color: b.color || undefined };
}

function widthClass(b: BlockBase, layout: PageLayout) {
  if (!b.width || b.width === "inherit") return LAYOUT_CLASS[layout];
  return WIDTH_CLASS[b.width];
}

function Anchor({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function BlockView({ block, layout }: { block: Block; layout: PageLayout }) {
  const pad = PAD_Y_CLASS[block.padY ?? "md"];
  const inner = `mx-auto w-full px-5 sm:px-8 ${widthClass(block, layout)} ${
    block.align === "center" ? "text-center" : ""
  }`;

  if (block.type === "rich-text") {
    return (
      <section className={pad} style={sectionStyle(block)}>
        <div className={inner}>
          <RichContent html={block.html} />
        </div>
      </section>
    );
  }

  if (block.type === "html") {
    return (
      <section className={pad} style={sectionStyle(block)}>
        <div className={inner} dangerouslySetInnerHTML={{ __html: cleanEmbed(block.html) }} />
      </section>
    );
  }

  if (block.type === "image") {
    if (!block.src) return null;
    // eslint-disable-next-line @next/next/no-img-element
    const img = (
      <img
        src={block.src}
        alt={block.alt ?? ""}
        loading="lazy"
        className="block h-auto w-full border border-line object-cover"
      />
    );
    return (
      <section className={pad} style={sectionStyle(block)}>
        <figure className={inner}>
          {block.href ? <Anchor href={block.href}>{img}</Anchor> : img}
          {block.caption ? (
            <figcaption className="mt-2 text-xs text-foreground-soft"><FormattedText value={block.caption} /></figcaption>
          ) : null}
        </figure>
      </section>
    );
  }

  // card-grid
  const cols = block.cols ?? 3;
  const colClass = cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className={pad} style={sectionStyle(block)}>
      <div className={inner}>
        {block.heading ? (
          <h2 className="mb-8 font-display text-3xl leading-tight sm:text-4xl"><FormattedText value={block.heading} /></h2>
        ) : null}
        <div className={`grid gap-5 ${colClass}`}>
          {block.cards.map((card) => {
            const body = (
              <div
                className="flex h-full flex-col overflow-hidden border border-line bg-surface"
                style={{ background: card.bg || undefined, color: card.color || undefined }}
              >
                {card.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.image} alt={plainText(card.title ?? "")} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  {card.title ? <h3 className="font-display text-xl leading-snug"><FormattedText value={card.title} /></h3> : null}
                  {card.text ? <p className="mt-2 text-sm leading-relaxed opacity-90"><FormattedText value={card.text} /></p> : null}
                </div>
              </div>
            );
            return card.href ? (
              <Anchor key={card.id} href={card.href} className="group block transition-transform hover:-translate-y-0.5">
                {body}
              </Anchor>
            ) : (
              <div key={card.id}>{body}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function BlockRenderer({
  blocks,
  layout = "boxed",
}: {
  blocks: unknown[];
  layout?: PageLayout;
}) {
  const list = coerceBlocks(blocks);
  if (!list.length) return null;
  return (
    <>
      {list.map((b) => (
        <BlockView key={b.id} block={b} layout={layout} />
      ))}
    </>
  );
}
