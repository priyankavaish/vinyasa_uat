"use client";

import ThemeColorControl from "@/components/admin/theme-color-control";
import { useActionState, useState } from "react";
import { savePaymentButton } from "@/lib/admin/payment-actions";
import { DEFAULT_PAYMENT_BUTTON, paymentStyle, type PaymentButtonSettings } from "@/lib/payment-buttons";

type Target = { value: string; label: string; group: string; path: string };
const field = "mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-sm";

export default function PaymentButtonsEditor({ targets, settings }: {
  targets: Target[]; settings: Record<string, PaymentButtonSettings>;
}) {
  const [target, setTarget] = useState(targets[0]?.value ?? "general");
  const [saved, setSaved] = useState(settings);
  const [dirty, setDirty] = useState(false);
  const selected = targets.find((t) => t.value === target)!;
  return <div className="mt-7">
    <label htmlFor="payment-target" className="text-sm font-semibold">1. Choose a button</label>
    <select id="payment-target" className={field} value={target} onChange={(e) => {
      if (dirty && !window.confirm("Discard unsaved changes and choose another button?")) return;
      setTarget(e.target.value); setDirty(false);
    }}>
      {["Stays", "Events", "Other"].map((group) => <optgroup label={group} key={group}>
        {targets.filter((t) => t.group === group).map((t) => <option key={t.value} value={t.value}>{t.label}{saved[t.value]?.url ? " — Link added" : ""}</option>)}
      </optgroup>)}
    </select>
    <ButtonForm key={target} target={selected} initial={saved[target] ?? DEFAULT_PAYMENT_BUTTON}
      onDirty={() => setDirty(true)}
      onSaved={(value) => { setSaved((previous) => ({ ...previous, [target]: value })); setDirty(false); }} />
  </div>;
}

function ButtonForm({ target, initial, onDirty, onSaved }: {
  target: Target; initial: PaymentButtonSettings; onDirty: () => void; onSaved: (value: PaymentButtonSettings) => void;
}) {
  const [value, setValue] = useState(initial);
  const [edited, setEdited] = useState(false);
  const [state, action, pending] = useActionState(async (previous: { error?: string; success?: string }, form: FormData) => {
    const result = await savePaymentButton(previous, form);
    setEdited(false);
    if (result.success) onSaved(value);
    return result;
  }, {});
  function update(key: keyof PaymentButtonSettings, next: string) {
    setValue((previous) => ({ ...previous, [key]: next })); setEdited(true); onDirty();
  }
  return <form action={action} className="mt-5 rounded-lg border border-line bg-surface p-5 sm:p-7">
    <input type="hidden" name="target" value={target.value} />
    <fieldset disabled={pending} className="space-y-6 disabled:opacity-60">
      <div>
        <label htmlFor="payment-url" className="text-sm font-semibold">2. Paste Razorpay payment link</label>
        <input id="payment-url" name="url" type="url" maxLength={1000} value={value.url} onChange={(e) => update("url", e.target.value)}
          placeholder="https://rzp.io/..." className={field} aria-describedby="payment-help" />
        <p id="payment-help" className="mt-2 text-xs text-muted">Copy the payment link from Razorpay. Leave blank to use the original booking link.</p>
      </div>
      <div>
        <label htmlFor="payment-label" className="text-sm font-semibold">Button text (optional)</label>
        <input id="payment-label" name="label" maxLength={60} value={value.label} onChange={(e) => update("label", e.target.value)}
          placeholder="Keep existing button text" className={field} />
      </div>
      <div>
        <h2 className="text-sm font-semibold">3. Choose colors</h2>
        <p className="mt-1 text-xs text-muted">Only Vinyasa theme colors are available.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <ThemeColorControl name="background" label="Background" value={value.background} onChange={(color) => update("background", color)} />
          <ThemeColorControl name="foreground" label="Text" value={value.foreground} onChange={(color) => update("foreground", color)} />
        </div>
      </div>
      <div className="rounded-md border border-line bg-background p-5">
        <p className="mb-3 text-xs uppercase tracking-wider text-muted">Live preview</p>
        <button type="button" className="btn btn-accent payment-button max-w-full !whitespace-normal break-words text-center" style={paymentStyle(value)}>{value.label.trim() || "Book now"}</button>
        <p className="mt-3 text-xs text-muted">{value.url.trim() ? "Opens your Razorpay payment page." : "Uses the original link."}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-accent">{pending ? "Saving..." : "Save button"}</button>
        <a href={target.path} target="_blank" rel="noopener noreferrer" className="text-sm text-accent underline">View page ↗</a>
      </div>
    </fieldset>
    {!edited && state.error && <p role="alert" className="mt-4 text-sm text-accent">{state.error}</p>}
    {!edited && state.success && <p role="status" className="mt-4 text-sm text-secondary-ink">{state.success}</p>}
    <p className="mt-5 text-xs leading-relaxed text-muted">This updates the booking buttons on the selected detail page. Payments made through these links appear in Razorpay; they do not automatically create a booking here.</p>
  </form>;
}
