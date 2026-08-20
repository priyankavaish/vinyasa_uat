import type { MetadataRoute } from "next";
import { cottages, events } from "@/lib/content";
import { SITE_ORIGIN } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/stays", "/events", "/corporate", "/contact", "/book"];
  return [
    ...routes.map((route) => ({ url: `${SITE_ORIGIN}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 })),
    ...cottages.map((c) => ({ url: `${SITE_ORIGIN}/stays/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...events.map((e) => ({ url: `${SITE_ORIGIN}/events/${e.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
