/** All catalogue rates are base prices in INR, excluding GST. */
export const BOOKING_GST_PERCENT = 18;
export const STAY_GST_PERCENT = 5;
export const gstPercentFor = (type: "stay" | "event") => (type === "stay" ? STAY_GST_PERCENT : BOOKING_GST_PERCENT);
export function bookingPrice(baseAmount: number, gstPercent = BOOKING_GST_PERCENT) {
  if (!Number.isFinite(baseAmount) || baseAmount < 0) throw new Error("Invalid base price.");
  const basePaise = Math.round(baseAmount * 100);
  const gstPaise = Math.round(basePaise * gstPercent / 100);
  return { baseAmount: basePaise / 100, gstAmount: gstPaise / 100, totalAmount: (basePaise + gstPaise) / 100, totalPaise: basePaise + gstPaise };
}
