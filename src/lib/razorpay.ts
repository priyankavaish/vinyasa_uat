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
    // Degrade to mock rather than blocking the demo on a Razorpay outage.
    return {
      id: `order_mock_fallback_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
      mock: true,
    };
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
