import laceBorderBrown from "@/app/assets/ChatGPT Image Aug 26, 2026, 02_21_03 PM (1).png";
import laceBorderWhite from "@/app/assets/ChatGPT Image Aug 26, 2026, 02_21_03 PM (2).png";

const VARIANT_SRC = {
  brown: laceBorderBrown.src,
  white: laceBorderWhite.src,
} as const;

/** Full-width lace/jharokha trim used as a decorative seam between home page
 *  sections. `flip` mirrors the motif so consecutive dividers don't look identical. */
export function LaceDivider({
  variant = "brown",
  flip = false,
  className = "",
}: {
  variant?: keyof typeof VARIANT_SRC;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative z-10 h-7 opacity-80 sm:h-9 ${className}`}
      style={{
        backgroundImage: `url(${VARIANT_SRC[variant]})`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "top center",
        backgroundSize: "auto 100%",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    />
  );
}
