"use client";

import { useEffect, useState } from "react";
import SuccessDialog from "@/components/forms/success-dialog";
import { DEFAULT_EVENT_PAYMENT_SETTINGS, eventPaymentMessages, type EventPaymentSettings, type PaymentOutcome } from "@/lib/event-payment-settings";

export default function EventPaymentMessages({ settings }: { settings: EventPaymentSettings }) {
  const [enabled, setEnabled] = useState(settings.showPopup);
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState<PaymentOutcome | null>(null);
  useEffect(() => setReady(true), []);
  const value = { ...DEFAULT_EVENT_PAYMENT_SETTINGS, showPopup: enabled, emailEnabled: settings.emailEnabled };
  const copy = eventPaymentMessages(value, preview || "success");

  return (
    <section aria-label="Event payment configuration" data-payment-setup-ready={ready ? "true" : "false"} className="space-y-3 border-t border-line pt-6">
      <input type="hidden" name="eventPaymentSettings" value={JSON.stringify(value)} />
      <h2 className="font-display text-2xl">Payment updates</h2>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} />
        Show standard success / failure messages
      </label>
      <p className="text-sm text-muted">The same standard messages work for every event. Customer email is taken automatically from Razorpay checkout.</p>
      <div className="flex flex-wrap gap-4">
        <button type="button" className="text-sm text-accent underline" onClick={() => setPreview("success")}>Preview success</button>
        <button type="button" className="text-sm text-accent underline" onClick={() => setPreview("failed")}>Preview failure</button>
      </div>
      <SuccessDialog open={preview !== null} onClose={() => setPreview(null)} closeLabel="Close preview">
        <p className="mb-3 text-xs uppercase tracking-widest text-accent">Message preview</p>
        <h3 className="font-display text-3xl">{copy.title}</h3>
        <p className="mt-4 whitespace-pre-line leading-7">{copy.message}</p>
      </SuccessDialog>
    </section>
  );
}
