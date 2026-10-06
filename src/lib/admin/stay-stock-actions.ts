"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { stayQuantitySchema, stayStockKey } from "@/lib/stay-stock";

export async function saveStayQuantity(_state: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  const store = await cookies();
  if (!await isValidSessionToken(store.get(SESSION_COOKIE)?.value)) return { error: "Please sign in again." };
  const slug = String(form.get("slug") ?? "");
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return { error: "Invalid stay." };
  const parsed = stayQuantitySchema.safeParse(form.get("quantity"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await getDb().insert(siteContent).values({ key: stayStockKey(slug), value: { quantity: parsed.data } })
      .onConflictDoUpdate({ target: siteContent.key, set: { value: { quantity: parsed.data }, updatedAt: new Date() } });
  } catch {
    return { error: "Could not save quantity. Please try again." };
  }
  revalidateTag("stay-inventory");
  revalidatePath("/stays");
  revalidatePath(`/stays/${slug}`);
  revalidatePath("/book");
  revalidatePath("/");
  revalidatePath("/admin/stays");
  return { success: parsed.data === 0 ? "Saved — sold out." : "Quantity saved." };
}
