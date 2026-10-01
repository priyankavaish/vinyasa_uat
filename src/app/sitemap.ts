import type { MetadataRoute } from "next";
import { cottages } from "@/lib/content";
import { getEvents } from "@/lib/cms";
import { SITE_ORIGIN } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();
  const routes = ["", "/about", "/stays", "/events", "/volunteering", "/contact", "/book"];
  return [
    ...routes.map((route) => ({ url: `${SITE_ORIGIN}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 })),
    ...cottages.map((c) => ({ url: `${SITE_ORIGIN}/stays/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...events.map((e) => ({ url: `${SITE_ORIGIN}/events/${e.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
