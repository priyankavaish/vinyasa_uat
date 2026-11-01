"use client";

import { useActionState } from "react";
import { saveStayQuantity } from "@/lib/admin/stay-stock-actions";

export default function StayInventoryEditor({ stays }: { stays: { slug: string; name: string; quantity: number | null; bookedTonight?: number }[] }) {
  return <section className="rounded-lg border border-line bg-surface p-5 sm:p-6">
    <h2 className="font-display text-2xl italic">Stock (total units)</h2>
    <p className="mt-2 text-sm text-foreground-soft">Set the total number of rooms / tents / beds you have. Every paid booking (and any payment in progress for 20 minutes) is deducted automatically for its dates, so guests only see what is really free. Set 0 to show "Currently not available" and turn off booking. Leave blank for no limit.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {stays.map((stay) => <QuantityForm key={stay.slug} stay={stay} />)}
    </div>
  </section>;
}
function QuantityForm({ stay }: { stay: { slug: string; name: string; quantity: number | null; bookedTonight?: number } }) {
  const [state, action, pending] = useActionState(saveStayQuantity, {});
  return <form action={action} data-stay-stock={stay.slug} className="rounded-md border border-line bg-background p-4">
    <input type="hidden" name="slug" value={stay.slug} />
    <label htmlFor={`stock-${stay.slug}`} className="block text-sm font-semibold">{stay.name}</label>
    <p className="mt-1 text-xs text-muted">{stay.slug === "dorm" ? "Total beds" : stay.slug === "tent" ? "Total tents" : "Total rooms"}</p>
    {stay.quantity !== null && stay.bookedTonight !== undefined && <p className="mt-1 text-xs text-foreground-soft">Tonight: {stay.bookedTonight} booked · {Math.max(0, stay.quantity - stay.bookedTonight)} free</p>}
    <div className="mt-3 flex gap-2">
      <input id={`stock-${stay.slug}`} name="quantity" type="number" min={0} max={100000} step={1}
        defaultValue={stay.quantity ?? ""} placeholder="Not set" disabled={pending}
        className="min-w-0 flex-1 rounded border border-line bg-surface px-3 py-2 text-sm" />
      <button disabled={pending} className="btn btn-accent btn-sm disabled:opacity-60">{pending ? "Saving..." : "Save"}</button>
    </div>
    {stay.quantity === 0 && <p className="mt-2 text-sm font-semibold text-accent">Currently not available</p>}
    {state.error && <p role="alert" className="mt-2 text-sm text-accent">{state.error}</p>}
    {state.success && <p role="status" className="mt-2 text-sm text-secondary-ink">{state.success}</p>}
  </form>;
}
