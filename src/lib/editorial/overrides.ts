import { mudhouseContent } from "@/lib/mudhouse-wording";
import { unstable_cache } from "next/cache";
import { like } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import type { EditorialOverrides } from "./merge";
export const getEditorialOverrides = unstable_cache(async (): Promise<EditorialOverrides> => {
  if (!hasDb()) return {};
  try {
  const rows = await getDb().select().from(siteContent).where(like(siteContent.key, "editorial:%"));
  return Object.fromEntries(rows.map(row => [row.key.slice(10), mudhouseContent(row.value)]));
  } catch { return {}; }
}, ["editorial:overrides:mudhouse-v1"], { tags: ["content"] });
