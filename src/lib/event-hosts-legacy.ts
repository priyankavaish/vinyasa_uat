import { eventHostsSchema, isLegacyHostSection, type EventHost } from "./event-hosts";
import { plainText } from "./editorial/text";

/** Keep existing portraits and edited biographies until hosts are explicitly saved. */
export function legacyEventHosts(details: unknown): EventHost[] {
  if (!details || typeof details !== "object" || !("sections" in details) || !Array.isArray(details.sections)) return [];
  return details.sections.filter(isLegacyHostSection).flatMap(section => {
    if (!Array.isArray(section.portraits)) return [];
    const paragraphs = String(section.bodyHtml || "").match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
    return section.portraits.flatMap((host: Record<string, string>, index: number) => {
      const parsed = eventHostsSchema.element.safeParse({
        name: plainText(host.name || ""), role: "", image: host.image || "",
        bio: plainText(paragraphs[index] || ""),
        socials: host.href ? [{ label: "Instagram", url: host.href }] : [],
      });
      return parsed.success ? [parsed.data] : [];
    });
  });
}
