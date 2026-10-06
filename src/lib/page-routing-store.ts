import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { ROUTING_KEY, readSettingsMap, type PageSettingsMap } from "./page-routing";
/** Middleware reads directly so routing changes are effective on the next request. */
export async function readPageSettings(): Promise<PageSettingsMap> {
  if (!hasDb()) return {};
  try {
    const [row] = await getDb().select({ value: siteContent.value }).from(siteContent).where(eq(siteContent.key, ROUTING_KEY)).limit(1);
    return readSettingsMap(row?.value);
  } catch { return {}; }
}
export const getPageSettings = unstable_cache(readPageSettings, ["page-routing:v1"], { tags: ["page-routing"] });
