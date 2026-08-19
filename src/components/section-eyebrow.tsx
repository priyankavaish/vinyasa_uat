import { Icon, type IconName } from "./icon";

export default function SectionEyebrow({
  children,
  tone = "accent",
  icon = "leaf-outline",
}: {
  children: React.ReactNode;
  tone?: "accent" | "secondary";
  icon?: IconName;
}) {
  const color = tone === "secondary" ? "var(--secondary)" : "var(--accent)";
  return (
    <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.18em]" style={{ color }}>
      <Icon name={icon} size={14} />
      {children}
    </p>
  );
}
