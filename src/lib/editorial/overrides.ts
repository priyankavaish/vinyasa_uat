import { unstable_cache } from "next/cache";
import { like } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { mergeEditorial, type EditorialOverrides } from "./merge";
import { defaults as headerDefaults } from "./defaults/components_layout_site_header";
import { getPageSettings } from "@/lib/page-routing-store";
import { applyPageLinks } from "@/lib/page-routing";
export const getEditorialOverrides = unstable_cache(async (): Promise<EditorialOverrides> => {
  if (!hasDb()) return {};
  try {
  const rows = await getDb().select().from(siteContent).where(like(siteContent.key, "editorial:%"));
  const values = Object.fromEntries(rows.map(row => [row.key.slice(10), row.value]));
  const settings = await getPageSettings();
  if (!Object.keys(settings).length) return values;
  const headerKey = "components/layout/site-header";
  values[headerKey] = mergeEditorial(headerDefaults, values[headerKey]);
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, applyPageLinks(value, settings, key === headerKey || key === "components/layout/site-footer")]));
  } catch { return {}; }
}, ["editorial:overrides:plain-v3"], { tags: ["content", "page-routing"] });
