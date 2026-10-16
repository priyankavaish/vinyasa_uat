"use client";
import { useState } from "react";
import SuccessDialog from "@/components/forms/success-dialog";

export default function UatPaymentPage() {
  const [result, setResult] = useState<"success" | "failed" | "cancelled" | null>(null);
  const messages = {
    success: ["Thank you ? test payment successful.", "This is a UAT simulation. No money was charged."],
    failed: ["Test payment failed.", "This is a simulated failure. You can close this message and try again."],
    cancelled: ["Test payment cancelled.", "No payment was made. You can close this message and try again."],
  };
  return <section className="mx-auto max-w-2xl px-5 py-28">
    <h1 className="font-display text-3xl">UAT payment test</h1>
    <p className="mt-5">Test the payment messages below. This testing website does not charge money or send a payment to the live website.</p>
    <div className="mt-8 flex flex-wrap gap-3"><button className="btn btn-accent" onClick={() => setResult("success")}>Test success</button><button className="btn btn-outline" onClick={() => setResult("failed")}>Test failure</button><button className="btn btn-outline" onClick={() => setResult("cancelled")}>Test cancellation</button></div>
    <a className="mt-8 inline-block underline" href="/">Back to website</a>
    <SuccessDialog open={result !== null} onClose={() => setResult(null)}>{result && <><h2 className="font-display text-3xl">{messages[result][0]}</h2><p className="mt-4">{messages[result][1]}</p></>}</SuccessDialog>
  </section>;
}
