"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import { normalizeCouponCode } from "@/lib/coupons";
import { deleteCoupon, saveCoupon } from "@/lib/coupon-store";
import { addStayBlock, removeStayBlock } from "@/lib/stay-blocks";

type State = { error?: string; success?: string };
const signedIn = async () => isValidSessionToken((await cookies()).get(SESSION_COOKIE)?.value);
const optionalDate = z.preprocess((v) => v === "" || v == null ? null : v, z.string().date().nullable());

const couponForm = z.object({
  code: z.string().transform(normalizeCouponCode).pipe(z.string().regex(/^[A-Z0-9_-]{3,30}$/, "Code must be 3-30 letters, numbers, - or _.")),
  type: z.enum(["percent", "flat"]),
  value: z.coerce.number().positive("Enter a discount greater than 0."),
  expiresOn: optionalDate,
}).refine((c) => c.type !== "percent" || c.value <= 100, { path: ["value"], message: "Percent discount cannot exceed 100." });

export async function createCoupon(_state: State, form: FormData): Promise<State> {
  if (!await signedIn()) return { error: "Please sign in again." };
  const parsed = couponForm.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await saveCoupon({ ...parsed.data, active: true });
  } catch {
    return { error: "Could not save the coupon. Please try again." };
  }
  revalidatePath("/admin/offers");
  return { success: `Coupon ${parsed.data.code} saved.` };
}

export async function setCouponActive(code: string, active: boolean, coupon: { type: "percent" | "flat"; value: number; expiresOn?: string | null }) {
  if (!await signedIn()) return;
  await saveCoupon({ code: normalizeCouponCode(code), ...coupon, active });
  revalidatePath("/admin/offers");
}

export async function removeCoupon(code: string) {
  if (!await signedIn()) return;
  await deleteCoupon(code);
  revalidatePath("/admin/offers");
}

const blockForm = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,80}$/, "Choose a stay."),
  from: z.string().date("Choose the first closed date."),
  to: z.string().date("Choose the last closed date."),
  reason: z.string().trim().max(200).optional(),
}).refine((b) => b.to >= b.from, { path: ["to"], message: "Last date cannot be before the first date." });

export async function blockStayDates(_state: State, form: FormData): Promise<State> {
  if (!await signedIn()) return { error: "Please sign in again." };
  const parsed = blockForm.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await addStayBlock(parsed.data);
  } catch {
    return { error: "Could not save. Please try again." };
  }
  revalidatePath("/admin/availability");
  return { success: "Dates closed. Guests will see this stay as not available for them." };
}

export async function unblockStayDates(id: string) {
  if (!await signedIn()) return;
  await removeStayBlock(id);
  revalidatePath("/admin/availability");
}
