// An organic seam between two colour bands. The wrapper paints `from` (any CSS
// colour OR gradient — match it to the band above so the top join is invisible)
// and the SVG path paints `to` as the shaped edge that flows into the band
// below. No negative margins, so it never clips a neighbour.
type Variant = "wave" | "slant" | "arch" | "hill";

const PATHS: Record<Variant, string> = {
  // gentle double S-curve
  wave: "M0 80 V38 C 240 2 480 2 720 38 C 960 74 1200 74 1440 34 V80 Z",
  // soft diagonal
  slant: "M0 80 V24 L1440 56 V80 Z",
  // one wide dome, like a low mud mound
  arch: "M0 80 V58 Q 720 2 1440 58 V80 Z",
  // a long, lazily off-centre rise
  hill: "M0 80 V54 C 380 54 520 10 900 14 C 1160 16 1300 44 1440 40 V80 Z",
};

export default function SectionWave({
  from,
  to,
  variant = "wave",
  flip = false,
  className = "",
}: {
  from: string;
  to: string;
  variant?: Variant;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full leading-[0] ${className || "h-12 sm:h-16"}`}
      style={{ background: from }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`block h-full w-full ${flip ? "-scale-y-100" : ""}`}
      >
        <path d={PATHS[variant]} fill={to} />
      </svg>
    </div>
  );
}
