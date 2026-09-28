import type { IconName } from "@/components/ui/icon";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";

/** Centered eyebrow + title (+ optional description) used to open a content section. */
export default function SectionHeading({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: IconName;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
      <SectionEyebrow icon={icon} className="justify-center">{eyebrow}</SectionEyebrow>
      <h2 className="mt-3 font-display italic text-4xl leading-tight">{title}</h2>
      {description && <p className="mt-3 text-foreground-soft">{description}</p>}
    </Reveal>
  );
}
