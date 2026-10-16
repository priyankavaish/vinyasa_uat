"use client";
import PaymentReturnHelp from "./payment-return-help";

import { useState } from "react";
import ThemeColorControl from "./theme-color-control";
import { DEFAULT_PAYMENT_BUTTON, paymentStyle, type PaymentButtonSettings } from "@/lib/payment-buttons";

export default function BookingButtonFields({ initial = DEFAULT_PAYMENT_BUTTON }: { initial?: PaymentButtonSettings }) {
  const [value, setValue] = useState(initial);
  const update = (key: keyof PaymentButtonSettings, next: string) => setValue(previous => ({ ...previous, [key]: next }));
  return <section className="space-y-4 border border-line bg-surface p-5" aria-label="Booking button settings">
    <h2 className="text-lg font-semibold">Booking button</h2>
    <p className="text-sm text-muted">Set this stay or event's button here. It saves with the rest of your changes.</p>
    <label className="grid gap-2 text-sm">Button text<input name="paymentLabel" maxLength={60} value={value.label} onChange={e => update("label", e.target.value)} placeholder="Keep existing button text" className="w-full border border-line bg-background px-3 py-2" /></label>
    <label className="grid gap-2 text-sm">Razorpay payment link<input name="paymentUrl" type="url" maxLength={1000} value={value.url} onChange={e => update("url", e.target.value)} placeholder="https://rzp.io/..." className="w-full border border-line bg-background px-3 py-2" /></label>
    <p className="text-xs text-muted">Leave the link blank to keep the original booking link.</p>
    <PaymentReturnHelp />
    <div className="grid gap-4 sm:grid-cols-2">
      <ThemeColorControl name="paymentBackground" label="Button colour" value={value.background} onChange={next => update("background", next)} />
      <ThemeColorControl name="paymentForeground" label="Text colour" value={value.foreground} onChange={next => update("foreground", next)} />
    </div>
    {value.background === value.foreground && <p role="alert" className="text-sm text-accent">Choose different button and text colours.</p>}
    <div className="border border-line bg-background p-4"><p className="mb-3 text-xs text-muted">Button preview</p><button type="button" className="btn btn-accent payment-button max-w-full !whitespace-normal" style={paymentStyle(value)}>{value.label.trim() || "Book now"}</button></div>
  </section>;
}
