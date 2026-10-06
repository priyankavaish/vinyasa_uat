import type { MetadataRoute } from "next";
import { cottages } from "@/lib/content";
import { getEvents, getPublishedBlogs } from "@/lib/cms";
import { SITE_ORIGIN } from "@/lib/site";
import { getPageSettings } from "@/lib/page-routing-store";
import { resolvePageHref, routablePages } from "@/lib/page-routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, settings, blogs] = await Promise.all([getEvents(), getPageSettings(), getPublishedBlogs()]);
  const routes = routablePages.map(page => resolvePageHref(page.path, settings));
  return [
    ...routes.map((route) => ({ url: `${SITE_ORIGIN}${route}`, changeFrequency: "monthly" as const, priority: route === resolvePageHref("/", settings) ? 1 : 0.8 })),
    ...cottages.map((c) => ({ url: `${SITE_ORIGIN}/stays/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...blogs.map(blog => ({ url: `${SITE_ORIGIN}/blogs/${blog.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...events.map((e) => ({ url: `${SITE_ORIGIN}/events/${e.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
