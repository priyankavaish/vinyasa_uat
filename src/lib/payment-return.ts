export const PAYMENT_RETURN_PARAMS = ["payment", "razorpay_payment_id", "razorpay_payment_link_id", "razorpay_payment_link_reference_id", "razorpay_payment_link_status", "razorpay_signature"];
export type PaymentReturnStatus = "success" | "failed" | "cancelled" | "unverified";
export function hasPaymentReturn(params: URLSearchParams) {
  return PAYMENT_RETURN_PARAMS.some(name => params.has(name));
}
export function unsignedPaymentReturn(params: URLSearchParams): PaymentReturnStatus {
  const status = params.get("payment") || params.get("razorpay_payment_link_status");
  if (status === "failed") return "failed";
  if (status === "cancelled" || status === "canceled") return "cancelled";
  return "unverified";
}
