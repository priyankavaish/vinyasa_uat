import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";
import { verifyPaymentLinkSignature, createOrder } from "../src/lib/razorpay";
import { unsignedPaymentReturn, hasPaymentReturn } from "../src/lib/payment-return";

test("payment link success needs an authentic signature; tampering is rejected", () => {
  const previous = process.env.RAZORPAY_KEY_SECRET;
  process.env.RAZORPAY_KEY_SECRET = "test-only-secret";
  try {
    const params = new URLSearchParams({ razorpay_payment_link_id: "plink_test", razorpay_payment_link_reference_id: "reference", razorpay_payment_link_status: "paid", razorpay_payment_id: "pay_test" });
    assert.equal(verifyPaymentLinkSignature(params), false);
    params.set("razorpay_signature", createHmac("sha256", "test-only-secret").update("plink_test|reference|paid|pay_test").digest("hex"));
    assert.equal(verifyPaymentLinkSignature(params), true);
    params.set("razorpay_payment_id", "pay_other");
    assert.equal(verifyPaymentLinkSignature(params), false);
    params.set("razorpay_signature", "not-hex");
    assert.equal(verifyPaymentLinkSignature(params), false);
  } finally { if (previous === undefined) delete process.env.RAZORPAY_KEY_SECRET; else process.env.RAZORPAY_KEY_SECRET = previous; }
});
test("unsigned success never becomes payment confirmation", () => {
  assert.equal(unsignedPaymentReturn(new URLSearchParams("payment=success")), "unverified");
  assert.equal(unsignedPaymentReturn(new URLSearchParams("razorpay_payment_link_status=paid")), "unverified");
  assert.equal(unsignedPaymentReturn(new URLSearchParams("payment=failed")), "failed");
  assert.equal(unsignedPaymentReturn(new URLSearchParams("payment=cancelled")), "cancelled");
  assert.equal(hasPaymentReturn(new URLSearchParams("slug=agni")), false);
});
test("production without payment keys cannot simulate a successful payment", async () => {
  const env = { mode: process.env.NODE_ENV, id: process.env.RAZORPAY_KEY_ID, secret: process.env.RAZORPAY_KEY_SECRET };
  Object.assign(process.env, { NODE_ENV: "production" }); delete process.env.RAZORPAY_KEY_ID; delete process.env.RAZORPAY_KEY_SECRET;
  try { await assert.rejects(createOrder(10000, "test"), /not configured/); }
  finally {
    for (const [key, value] of [["NODE_ENV", env.mode], ["RAZORPAY_KEY_ID", env.id], ["RAZORPAY_KEY_SECRET", env.secret]] as const) {
      if (value === undefined) delete process.env[key]; else Object.assign(process.env, { [key]: value });
    }
  }
});
