import type { ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "scale" | "left" | "right" | "clip";

/** Was a scroll-in animation wrapper; now a plain pass-through.
 *  Section entrance motion is handled by <AnimateInView> only, so this
 *  no longer adds its own transitions (kept to avoid touching every caller). */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}) {
  return className ? <div className={className}>{children}</div> : <>{children}</>;
}
