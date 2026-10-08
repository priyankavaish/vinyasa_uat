import { cleanInlineText, hasTextFormatting } from "@/lib/editorial/text";

export default function FormattedText({ value, links = true }: { value?: string | null; links?: boolean }) {
  if (!value || !hasTextFormatting(value)) return value ?? null;
  return <span className="formatted-text" dangerouslySetInnerHTML={{ __html: cleanInlineText(value, links) }} />;
}
