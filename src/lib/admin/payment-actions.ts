"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { paymentButtonSchema, paymentKey } from "@/lib/payment-buttons";

export type PaymentSaveState = { error?: string; success?: string };

export async function savePaymentButton(_previous: PaymentSaveState, form: FormData): Promise<PaymentSaveState> {
  const cookieStore = await cookies();
  if (!await isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    return { error: "Please sign in again before saving." };
  }
  const target = String(form.get("target") ?? "");
  if (!/^(stay|event):[a-z0-9-]{1,80}$/.test(target) && target !== "general") {
    return { error: "Choose an event or stay first." };
  }
  const parsed = paymentButtonSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const key = paymentKey(target);
    await getDb().insert(siteContent).values({ key, value: parsed.data })
      .onConflictDoUpdate({ target: siteContent.key, set: { value: parsed.data, updatedAt: new Date() } });
  } catch {
    return { error: "Could not save. Please try again; your changes are still here." };
  }
  revalidateTag("content");
  if (target === "general") revalidatePath("/useful-links");
  else {
    const [kind, slug] = target.split(":");
    revalidatePath(`/${kind === "stay" ? "stays" : "events"}/${slug}`);
  }
  revalidatePath("/admin/payment-buttons");
  return { success: parsed.data.url ? "Saved. Your payment button is live." : "Saved. The original link will be used." };
}
