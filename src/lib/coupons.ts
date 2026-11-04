/** Pure coupon helpers shared by the booking form (preview) and the server (authoritative). */
export type Coupon = { code: string; type: "percent" | "flat"; value: number; active: boolean; expiresOn?: string | null };
export const normalizeCouponCode = (code: unknown) => String(code ?? "").trim().toUpperCase();
export const couponKey = (code: string) => `coupon:${normalizeCouponCode(code)}`;

/** Discount on the pre-GST amount, never taking the payable base below ₹1. */
export function couponDiscount(coupon: Pick<Coupon, "type" | "value">, baseAmount: number) {
  if (!(baseAmount > 1)) return 0;
  const raw = coupon.type === "percent" ? baseAmount * coupon.value / 100 : coupon.value;
  return Math.min(Math.round(raw * 100) / 100, baseAmount - 1);
}
