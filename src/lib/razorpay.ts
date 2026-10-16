import { createHmac, timingSafeEqual } from "crypto";

const RAZORPAY_API = "https://api.razorpay.com/v1";

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  mock: boolean;
};

function hasRealKeys(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/**
 * Creates a Razorpay order. Falls back to a mock order (clearly marked)
 * when no keys are configured, so the demo booking flow still completes.
 */
export async function createOrder(amountInPaise: number, receipt: string): Promise<RazorpayOrder> {
  if (!hasRealKeys()) {
    if (process.env.NODE_ENV === "production") throw new Error("Payment service is not configured.");
    return {
      id: `order_mock_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
      mock: true,
    };
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const res = await fetch(`${RAZORPAY_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amountInPaise, currency: "INR", receipt }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[razorpay] create-order failed", res.status, body);
    throw new Error("Payment service is unavailable. Please try again later.");
  }

  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return { id: order.id, amount: order.amount, currency: order.currency, mock: false };
}

/**
 * Verifies a Razorpay checkout success callback server-side via HMAC
 * signature. This MUST pass before a booking is ever marked "paid" — an
 * unverified client callback can be faked by anyone.
 */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    // No real secret configured: mock orders never verify as paid via this
    // path (see the API route's mock branch, which handles that case).
    return false;
  }
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

/** Razorpay Payment Links sign link id, reference, status and payment id. */
export function verifyPaymentLinkSignature(params: URLSearchParams): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const id = params.get("razorpay_payment_link_id");
  const payment = params.get("razorpay_payment_id");
  const status = params.get("razorpay_payment_link_status");
  const signature = params.get("razorpay_signature") || "";
  if (!secret || !id || !payment || !status || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const payload = [id, params.get("razorpay_payment_link_reference_id") || "", status, payment].join("|");
  const expected = createHmac("sha256", secret).update(payload).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export async function fetchRazorpayPayment(paymentId: string) {
  if (!/^pay_[a-zA-Z0-9]+$/.test(paymentId) || !hasRealKeys()) throw new Error("Payment service is not configured.");
  const response = await fetch(`${RAZORPAY_API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64") },
    cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Payment could not be confirmed.");
  return response.json();
}
