import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_PAYMENT_BUTTON, isRazorpayLink, paymentButtonSchema } from "../src/lib/payment-buttons";

test("accepts supported Razorpay HTTPS payment links", () => {
  for (const url of ["https://rzp.io/l/example", "https://rzp.to/example", "https://razorpay.me/@vinyasaverse", "https://pages.razorpay.com/event", "https://payments.razorpay.com/event"]) {
    assert.equal(isRazorpayLink(url), true, url);
  }
});
test("rejects unsafe protocols, impersonation, credentials and unrelated sites", () => {
  for (const url of ["javascript:alert(1)", "http://rzp.io/l/test", "https://rzp.io.evil.com/l/test", "https://rzp.io@evil.com/test", "https://user:pass@rzp.io/test", "https://example.com/pay", "https://rzp.io:444/test", "https://rzp.io/"]) {
    assert.equal(isRazorpayLink(url), false, url);
  }
});
test("empty links restore the original destination and input is trimmed", () => {
  assert.equal(paymentButtonSchema.parse({ ...DEFAULT_PAYMENT_BUTTON, url: "  " }).url, "");
  assert.equal(paymentButtonSchema.parse({ ...DEFAULT_PAYMENT_BUTTON, url: " https://rzp.io/l/example " }).url, "https://rzp.io/l/example");
});
test("server validation only accepts theme colors", () => {
  for (const background of ["#ff0000", "red", "url(https://example.com)", "unknown"]) {
    assert.equal(paymentButtonSchema.safeParse({ ...DEFAULT_PAYMENT_BUTTON, background }).success, false);
  }
  assert.equal(paymentButtonSchema.safeParse({ ...DEFAULT_PAYMENT_BUTTON, foreground: "#ffffff" }).success, false);
});
test("rejects identical colors and excessively long button labels", () => {
  assert.equal(paymentButtonSchema.safeParse({ ...DEFAULT_PAYMENT_BUTTON, foreground: "accent" }).success, false);
  assert.equal(paymentButtonSchema.safeParse({ ...DEFAULT_PAYMENT_BUTTON, label: "a".repeat(61) }).success, false);
});
