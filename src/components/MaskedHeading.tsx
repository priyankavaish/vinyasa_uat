"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  text: string;
  mediaType?: "image" | "video";
  src: string;
  poster?: string;
  /** Zoom on the background media, 1 = fit, >1 = cropped in tighter. */
  fillScale?: number;
  /** Scroll-linked vertical drift of the media, in px. */
  parallax?: number;
  reveal?: "rise" | "none";
  trigger?: "view" | "mount";
  /** Continuous ambient sway of the media, in px. */
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  /** Reveal transition duration, seconds. */
  duration?: number;
  /** Per-word reveal delay, seconds. */
  stagger?: number;
  align?: "left" | "center" | "right";
  weight?: number;
  /** Letter-spacing, em. */
  tracking?: number;
  lineHeight?: number;
  /** Font-size as a fraction of the container's width. */
  textScale?: number;
  className?: string;
};

/**
 * A heading whose letterforms are filled with a photo or video instead of a
 * flat colour. Images use `background-clip: text` directly. Video can't be
 * a CSS background, so it's masked the other way round: the video plays
 * full-bleed underneath, and an opaque page-coloured overlay sits on top
 * with the text shape cut out of it (an inverted SVG mask), so the video
 * only shows through inside the letters.
 */
export default function MaskedHeading({
  text,
  mediaType = "image",
  src,
  poster,
  fillScale = 1,
  parallax = 0,
  reveal = "rise",
  trigger = "view",
  drift = 0,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  duration = 1.2,
  stagger = 0,
  align = "center",
  weight = 600,
  tracking = 0,
  lineHeight = 1.1,
  textScale = 0.1,
  className = "",
}: Props) {
  const maskId = useId().replace(/[:]/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(trigger === "mount");
  const [size, setSize] = useState({ w: 1000, h: 220 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Trigger reveal once the heading scrolls into view.
  useEffect(() => {
    if (trigger !== "view") return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  // Measure the container so the SVG mask's <text> lines up in real pixels.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll-linked parallax — shifts the whole heading block against the
  // page as it scrolls by, independent of media type.
  useEffect(() => {
    if (reducedMotion || !parallax) return;
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = 1 - Math.min(Math.max((rect.top + rect.height / 2) / vh, 0), 1);
      const offset = (progress - 0.5) * 2 * parallax;
      el.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [parallax, reducedMotion]);

  const fontSize = Math.max(24, size.w * textScale);
  const words = text.split(" ");
  const textAnchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
  const anchorX = align === "left" ? "2%" : align === "right" ? "98%" : "50%";

  // Self-contained data-URI mask (rect minus text = a text-shaped hole).
  // Deliberately not a same-document `<mask id>` reference: those resolve
  // unreliably here (stale size on first paint, cross-browser quirks) and
  // silently fail open, showing the full opaque overlay instead of masking.
  // Black background + white text: as a luminance mask, only the white
  // (text) area stays visible — applied straight to the video itself, so
  // the video shows only inside the letters and is fully transparent
  // everywhere else (no flat-colour rectangle behind it).
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.w}" height="${size.h}"><rect width="${size.w}" height="${size.h}" fill="black"/><text x="${anchorX}" y="50%" dominant-baseline="middle" text-anchor="${textAnchor}" font-family="Source Serif 4, Georgia, serif" font-style="italic" font-weight="${weight}" font-size="${fontSize}" letter-spacing="${tracking}em" fill="white">${text}</text></svg>`;
  const maskDataUri = `data:image/svg+xml,${encodeURIComponent(maskSvg)}`;

  const mediaFilter = `brightness(${brightness}) saturate(${grayscale ? 0 : saturation})`;
  const driftName = `masked-drift-${maskId}`;
  const mediaStyle: React.CSSProperties = {
    transform: `scale(${fillScale})`,
    filter: mediaFilter,
    animation: drift && !reducedMotion ? `${driftName} 9s ease-in-out infinite` : undefined,
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ lineHeight, transform: "translateY(var(--parallax-y, 0px))" }}
    >
      {mediaType === "image" ? (
        // Image path: background-clip: text paints straight through every
        // word span in one continuous image, no SVG needed.
        <h2
          className={`m-0 select-none font-display italic ${
            align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
          }`}
          style={{
            fontSize,
            fontWeight: weight,
            letterSpacing: `${tracking}em`,
            lineHeight,
            backgroundImage: `url(${src})`,
            backgroundSize: `${fillScale * 100}% auto`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            filter: mediaFilter,
            animation: drift && !reducedMotion ? `${driftName} 9s ease-in-out infinite` : undefined,
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : reveal === "rise" ? "translateY(0.4em)" : "none",
                transition: reducedMotion
                  ? "none"
                  : `opacity ${duration}s ease, transform ${duration}s cubic-bezier(0.16,1,0.3,1)`,
                transitionDelay: `${i * stagger}s`,
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
      ) : (
        // Video path: the video is masked directly, text-shaped — visible
        // only inside the letters, fully transparent everywhere else. No
        // separate overlay rectangle, so whatever sits behind this heading
        // (the page's own background) shows through untouched.
        <>
          <div
            ref={mediaRef}
            className="absolute inset-0 transition-opacity"
            style={{
              ...mediaStyle,
              WebkitMaskImage: `url("${maskDataUri}")`,
              maskImage: `url("${maskDataUri}")`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              // `match-source` (the default) doesn't reliably resolve
              // luminance for a data-URI SVG mask in every browser — it
              // silently fails open, rendering the whole box unmasked.
              // Force it explicitly.
              maskMode: "luminance",
              ["WebkitMaskMode" as string]: "luminance",
              opacity: visible ? 1 : 0,
              transitionDuration: `${duration}s`,
            }}
            aria-hidden
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={poster}
              className="h-full w-full object-cover"
            >
              <source src={src} type="video/mp4" />
            </video>
          </div>
          {/* Real text for accessibility/SEO — visually hidden, media is decorative. */}
          <h2 className="sr-only">{text}</h2>
          <div aria-hidden style={{ height: fontSize * lineHeight }} />
        </>
      )}
      <style>{`
        @keyframes ${driftName} {
          0%, 100% {
            ${mediaType === "image" ? `background-position: 50% 50%;` : `transform: scale(${fillScale}) translate(0, 0);`}
          }
          50% {
            ${
              mediaType === "image"
                ? `background-position: calc(50% + ${drift}px) calc(50% - ${drift * 0.5}px);`
                : `transform: scale(${fillScale}) translate(${drift}px, ${drift * 0.4}px);`
            }
          }
        }
      `}</style>
    </div>
  );
}
