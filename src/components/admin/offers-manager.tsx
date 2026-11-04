"use client";

import { useActionState, useTransition } from "react";
import { blockStayDates, createCoupon, removeCoupon, setCouponActive, unblockStayDates } from "@/lib/admin/offer-actions";
import type { Coupon } from "@/lib/coupons";

type Block = { id: string; slug: string; from: string; to: string; reason?: string };
const input = "mt-1 w-full rounded border border-line bg-surface px-3 py-2 text-sm";
const label = "block text-xs font-semibold uppercase tracking-[0.08em] text-foreground-soft";
const describe = (c: Pick<Coupon, "type" | "value">) => c.type === "percent" ? `${c.value}% off` : `₹${c.value.toLocaleString("en-IN")} off`;

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const [state, action, pending] = useActionState(createCoupon, {});
  const [busy, run] = useTransition();
  return <section className="rounded-lg border border-line bg-surface p-5 sm:p-6">
    <h2 className="font-display text-2xl italic">Coupon codes</h2>
    <p className="mt-2 text-sm text-foreground-soft">Guests enter the code while booking a stay. The discount comes off the room charge before 5% GST is added.</p>
    <form action={action} className="mt-5 grid gap-4 sm:grid-cols-4">
      <div><label htmlFor="coupon-code" className={label}>Code</label><input id="coupon-code" name="code" required placeholder="WELCOME10" className={`${input} uppercase`} /></div>
      <div><label htmlFor="coupon-type" className={label}>Type</label>
        <select id="coupon-type" name="type" className={input}><option value="percent">Percent (%)</option><option value="flat">Flat (₹)</option></select></div>
      <div><label htmlFor="coupon-value" className={label}>Discount</label><input id="coupon-value" name="value" type="number" min="1" step="any" required className={input} /></div>
      <div><label htmlFor="coupon-expiry" className={label}>Valid until (optional)</label><input id="coupon-expiry" name="expiresOn" type="date" className={input} /></div>
      <div className="sm:col-span-4 flex flex-wrap items-center gap-4">
        <button disabled={pending} className="btn btn-accent btn-sm disabled:opacity-60">{pending ? "Saving..." : "Create coupon"}</button>
        {state.error && <p role="alert" className="text-sm text-accent">{state.error}</p>}
        {state.success && <p role="status" className="text-sm text-secondary-ink">{state.success}</p>}
      </div>
    </form>
    {coupons.length > 0 && <ul className="mt-5 divide-y divide-line border-t border-line">
      {coupons.map((c) => <li key={c.code} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
        <div><span className="font-mono font-semibold">{c.code}</span> · {describe(c)}{c.expiresOn ? ` · until ${c.expiresOn}` : ""}
          <span className={`ml-2 text-xs font-semibold uppercase ${c.active ? "text-secondary" : "text-muted"}`}>{c.active ? "Active" : "Paused"}</span></div>
        <div className="flex gap-3">
          <button disabled={busy} className="text-accent underline" onClick={() => run(() => setCouponActive(c.code, !c.active, c))}>{c.active ? "Pause" : "Activate"}</button>
          <button disabled={busy} className="text-red-700 underline" onClick={() => { if (confirm(`Delete coupon ${c.code}?`)) run(() => removeCoupon(c.code)); }}>Delete</button>
        </div>
      </li>)}
    </ul>}
  </section>;
}

export function StayBlockManager({ stays, blocks }: { stays: { slug: string; name: string }[]; blocks: Block[] }) {
  const [state, action, pending] = useActionState(blockStayDates, {});
  const [busy, run] = useTransition();
  const nameOf = (slug: string) => stays.find((s) => s.slug === slug)?.name ?? slug;
  return <section className="rounded-lg border border-line bg-surface p-5 sm:p-6">
    <h2 className="font-display text-2xl italic">Close a stay for some days</h2>
    <p className="mt-2 text-sm text-foreground-soft">Guests cannot book the stay on any night from the first to the last date (both included). Existing bookings are not cancelled.</p>
    <form action={action} className="mt-5 grid gap-4 sm:grid-cols-4">
      <div><label htmlFor="block-stay" className={label}>Stay</label>
        <select id="block-stay" name="slug" required className={input}>{stays.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></div>
      <div><label htmlFor="block-from" className={label}>From</label><input id="block-from" name="from" type="date" required className={input} /></div>
      <div><label htmlFor="block-to" className={label}>To (last night)</label><input id="block-to" name="to" type="date" required className={input} /></div>
      <div><label htmlFor="block-reason" className={label}>Note (optional)</label><input id="block-reason" name="reason" maxLength={200} className={input} /></div>
      <div className="sm:col-span-4 flex flex-wrap items-center gap-4">
        <button disabled={pending} className="btn btn-accent btn-sm disabled:opacity-60">{pending ? "Saving..." : "Mark not available"}</button>
        {state.error && <p role="alert" className="text-sm text-accent">{state.error}</p>}
        {state.success && <p role="status" className="text-sm text-secondary-ink">{state.success}</p>}
      </div>
    </form>
    {blocks.length > 0 && <ul className="mt-5 divide-y divide-line border-t border-line">
      {blocks.map((b) => <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
        <div><span className="font-semibold">{nameOf(b.slug)}</span> · {b.from} to {b.to}{b.reason ? <span className="text-foreground-soft"> · {b.reason}</span> : null}</div>
        <button disabled={busy} className="text-red-700 underline" onClick={() => run(() => unblockStayDates(b.id))}>Reopen</button>
      </li>)}
    </ul>}
  </section>;
}
