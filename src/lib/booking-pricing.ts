/** All catalogue rates are base prices in INR, excluding GST. */
export const BOOKING_GST_PERCENT = 18;
export function bookingPrice(baseAmount: number) {
  if (!Number.isFinite(baseAmount) || baseAmount < 0) throw new Error("Invalid base price.");
  const basePaise = Math.round(baseAmount * 100);
  const gstPaise = Math.round(basePaise * BOOKING_GST_PERCENT / 100);
  return { baseAmount: basePaise / 100, gstAmount: gstPaise / 100, totalAmount: (basePaise + gstPaise) / 100, totalPaise: basePaise + gstPaise };
}
