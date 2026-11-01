import "server-only";
import { getContent, getPartners } from "@/lib/cms";
import { mergeEditorial } from "./merge";
import { plainText } from "./text";
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
  // Bring previously saved residency copy onto the event's confirmed Oct-Jan period.
  if (key === "app/(site)/events/[slug]/page" && value && typeof value === "object") {
    const fields = value as Record<string, unknown>;
    function period(node: unknown): unknown {
      if (typeof node === "string") return node.replace(/1 June - 30 September 2026/g, "1 October 2026 - 31 January 2027").replace(/between June and September/g, "between October and January").replace(/June[\u2013-]September/g, "October\u2013January");
      if (Array.isArray(node)) return node.map(period);
      if (node && typeof node === "object") return Object.fromEntries(Object.entries(node).map(([name, entry]) => [name, period(entry)]));
      return node;
    }
    if (fields.ARTIST_IN_RESIDENCE) fields.ARTIST_IN_RESIDENCE = period(fields.ARTIST_IN_RESIDENCE);
  }
  // Replace the original heading even when an older version was saved in the CMS.
  if (key === "app/(site)/work-from-farm/page" && value && typeof value === "object") {
    const fields = value as Record<string, unknown>;
    const oldHeading = (text: unknown) => typeof text === "string" ? plainText(text).toLowerCase().replace(/[^a-z]/g, "") : "";
    if (oldHeading(fields.heroTitle) === "alittlelessrush") fields.heroTitle = "Stay, work and slow down";
    if (oldHeading(fields.heroTitleAccent) === "alittlemoreroom") fields.heroTitleAccent = "outside Jaipur";
  }
  // Saved stay-page buttons still say "Check availability"/"Enquire"; stays are booked directly now.
  if (key === "app/(site)/stays/[slug]/page" && value && typeof value === "object") {
    const fields = value as Record<string, unknown>;
    if (typeof fields.text_20 === "string" && /^check availability$/i.test(plainText(fields.text_20).trim())) fields.text_20 = "Book now";
    if (typeof fields.text_21 === "string" && /^share your dates to confirm availability/i.test(plainText(fields.text_21).trim())) fields.text_21 = "Choose your dates and book online. Prices exclude 18% GST.";
    if (typeof fields.text_6 === "string") fields.text_6 = fields.text_6.replace(/&middot;/g, "·");
    if (typeof fields.text_19 === "string" && /^enquire about a bed$/i.test(plainText(fields.text_19).trim())) fields.text_19 = "Book a bed";
  }
  // Keep older Work from Farm buttons on its own rates and enquiry flow.
  const workStayLink = key === "app/(site)/work-from-farm/page" ? "href_22" : key === "components/sections/work-from-farm-section" ? "href_6" : null;
  if (workStayLink && value && typeof value === "object") {
    const fields = value as Record<string, unknown>;
    if (typeof fields[workStayLink] === "string" && /^(?:\/book(?:[?#].*)?|\/contact(?:#contact-form)?)$/.test(fields[workStayLink] as string)) fields[workStayLink] = "/work-from-farm/book";
    if (key === "app/(site)/work-from-farm/page" && typeof fields.text_23 === "string" && plainText(fields.text_23).trim().toLowerCase() === "request a booking") fields.text_23 = "Check Availability & Book";
  }
  return applyPageLinks(value, await getPageSettings(), key === "components/layout/site-header" || key === "components/layout/site-footer");
}
