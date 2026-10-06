import "server-only";
import { getContent, getPartners } from "@/lib/cms";
import { mergeEditorial } from "./merge";
import { getPageSettings } from "@/lib/page-routing-store";
import { applyPageLinks } from "@/lib/page-routing";
export async function getEditorial<T>(key: string, defaults: T): Promise<T> {
  let baseline: unknown = defaults;
  if (key === "app/(site)/about/page") {
    const [hero, story, craft] = await Promise.all([getContent<Record<string,string>>("about.hero"), getContent<Record<string,string>>("about.story"), getContent<Record<string,string>>("about.craft")]);
    const legacy: Record<string,unknown> = {};
    if (hero?.eyebrow !== undefined) legacy.text_1 = hero.eyebrow;
    if (hero?.title !== undefined) legacy.text_2 = hero.title;
    if (hero?.description !== undefined) legacy.text_3 = hero.description;
    if (story?.heading !== undefined) legacy.text_8 = story.heading;
    if (story?.body !== undefined) legacy.list_1 = story.body.split(/\n{2,}/).filter(Boolean);
    if (craft?.heading !== undefined) legacy.text_16 = craft.heading;
    if (craft?.body !== undefined) legacy.list_2 = craft.body.split(/\n{2,}/).filter(Boolean);
    baseline = mergeEditorial(defaults, legacy);
  }
  if (key === "app/(site)/contact/page") {
    const [hero, services, faq] = await Promise.all([getContent<Record<string,string>>("contact.hero"), getContent("contact.services"), getContent("contact.faq")]);
    const legacy: Record<string,unknown> = {};
    if (hero?.eyebrow !== undefined) legacy.text_1 = hero.eyebrow;
    if (hero?.title !== undefined) legacy.text_2 = hero.title;
    if (hero?.description !== undefined) legacy.text_3 = hero.description;
    if (Array.isArray(services)) legacy.SERVICES_FALLBACK = services;
    if (Array.isArray(faq)) legacy.FAQ_FALLBACK = faq;
    baseline = mergeEditorial(defaults, legacy);
  }
  if (key === "app/(site)/stays/page") {
    const original = (defaults as Record<string, unknown>).ACCESSORY_PARTNERS;
    if (Array.isArray(original)) {
      const saved = await getPartners();
      const aliases: Record<string, string> = { CarpetLive: "Carpet Live", "Dheer Rugs": "Dheer Exports" };
      const partners = saved.map(partner => {
        const fallback = original.find(item => item.name === partner.name || item.name === aliases[partner.name]);
        const legacySeed = partner.logo === "/images/logo-transparent.png";
        return {
          name: legacySeed && fallback ? fallback.name : partner.name,
          logo: legacySeed && fallback ? fallback.logo : partner.logo,
          blurb: legacySeed && fallback ? fallback.blurb : partner.description,
          about: fallback?.about ?? [partner.description],
        };
      });
      baseline = mergeEditorial(defaults, { ACCESSORY_PARTNERS: partners });
    }
  }
  const value = mergeEditorial(baseline as T, await getContent(`editorial:${key}`));
  return applyPageLinks(value, await getPageSettings(), key === "components/layout/site-header" || key === "components/layout/site-footer");
}
