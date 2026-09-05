const VARIANT_SRC = {
  brown: "/images/lace-border-brown.png",
  white: "/images/lace-border-white.png",
} as const;

/** Full-width lace/jharokha trim used as a decorative seam between home page
 *  sections. `flip` mirrors the motif horizontally, `upsideDown` flips it
 *  vertically so it hangs from the section above instead of sitting on top
 *  of the one below. */
export function LaceDivider({
  variant = "brown",
  flip = false,
  upsideDown = false,
  className = "",
}: {
  variant?: keyof typeof VARIANT_SRC;
  flip?: boolean;
  upsideDown?: boolean;
  className?: string;
}) {
  const scaleX = flip ? -1 : 1;
  const scaleY = upsideDown ? -1 : 1;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative z-10 h-9 opacity-80 sm:h-10 ${className}`}
      style={{
        backgroundImage: `url(${VARIANT_SRC[variant]})`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "top center",
        backgroundSize: "auto 100%",
        transform: scaleX !== 1 || scaleY !== 1 ? `scale(${scaleX}, ${scaleY})` : undefined,
      }}
    />
  );
}
