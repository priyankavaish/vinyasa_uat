import "server-only";
import { unstable_cache } from "next/cache";
import { like } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { stayQuantitySchema } from "@/lib/stay-stock";

// Booking requests use the uncached reader so an old form cannot bypass sold out.
export async function readStayInventory(): Promise<Record<string, number | null>> {
  if (!hasDb()) return {};
  const rows = await getDb().select().from(siteContent).where(like(siteContent.key, "stay-stock:%"));
  return Object.fromEntries(rows.map((row) => {
    const parsed = stayQuantitySchema.safeParse((row.value as { quantity?: unknown })?.quantity);
    if (!parsed.success) throw new Error("Invalid stay inventory.");
    return [row.key.slice("stay-stock:".length), parsed.data];
  }));
}
export const getStayInventory = unstable_cache(readStayInventory, ["stay-inventory:v1"], { tags: ["stay-inventory"] });
