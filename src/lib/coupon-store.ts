import "server-only";
import { eq, like } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { couponDiscount, couponKey, normalizeCouponCode, type Coupon } from "@/lib/coupons";

const toCoupon = (value: unknown): Coupon | null => {
  const v = value as Partial<Coupon> | null;
  if (!v || typeof v.code !== "string" || (v.type !== "percent" && v.type !== "flat") || typeof v.value !== "number") return null;
  return { code: v.code, type: v.type, value: v.value, active: v.active !== false, expiresOn: v.expiresOn ?? null };
};

export async function listCoupons(): Promise<Coupon[]> {
  if (!hasDb()) return [];
  const rows = await getDb().select().from(siteContent).where(like(siteContent.key, "coupon:%"));
  return rows.map((row) => toCoupon(row.value)).filter((c): c is Coupon => !!c).sort((a, b) => a.code.localeCompare(b.code));
}

export async function saveCoupon(coupon: Coupon) {
  await getDb().insert(siteContent).values({ key: couponKey(coupon.code), value: coupon })
    .onConflictDoUpdate({ target: siteContent.key, set: { value: coupon, updatedAt: new Date() } });
}

export async function deleteCoupon(code: string) {
  await getDb().delete(siteContent).where(eq(siteContent.key, couponKey(code)));
}

/** Checks a code against the pre-GST amount; returns the discount or a guest-facing error. */
export async function applyCoupon(rawCode: unknown, baseAmount: number): Promise<{ ok: true; coupon: Coupon; discount: number } | { ok: false; error: string }> {
  const code = normalizeCouponCode(rawCode);
  if (!code || !hasDb()) return { ok: false, error: "This coupon code is not valid." };
  const [row] = await getDb().select().from(siteContent).where(eq(siteContent.key, couponKey(code))).limit(1);
  const coupon = row ? toCoupon(row.value) : null;
  const today = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
  if (!coupon || !coupon.active || (coupon.expiresOn && coupon.expiresOn < today)) return { ok: false, error: "This coupon code is not valid." };
  return { ok: true, coupon, discount: couponDiscount(coupon, baseAmount) };
}
