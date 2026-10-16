"use client";
import { useEffect, useState } from "react";

export default function PaymentReturnHelp() {
  const [url, setUrl] = useState("");
  useEffect(() => { setUrl(window.location.origin + "/"); }, []);
  return <details className="border border-line bg-background p-3 text-sm">
    <summary className="cursor-pointer font-semibold">Show a thank-you message after payment</summary>
    <p className="mt-3 text-xs leading-relaxed text-muted">For Razorpay Payment Links that support a callback URL, set the callback URL below in Razorpay with the GET method. Razorpay must return the signed payment details so this website can confirm the payment. Pasting a payment link here does not configure its return URL.</p>
    <label className="mt-3 grid gap-2 text-xs">Return / callback URL<input aria-label="Payment return URL" readOnly value={url} onFocus={event => event.target.select()} className="w-full border border-line bg-surface px-3 py-2" /></label>
    <p className="mt-2 text-xs text-muted">If the payment page does not redirect back, the customer will only see Razorpay's own result screen. A website failure message appears only when the customer returns with a failure or cancellation status.</p>
  </details>;
}
