"use client";

import { useActionState } from "react";
import { saveStayQuantity } from "@/lib/admin/stay-stock-actions";

export default function StayInventoryEditor({ stays }: { stays: { slug: string; name: string; quantity: number | null }[] }) {
  return <section className="rounded-lg border border-line bg-surface p-5 sm:p-6">
    <h2 className="font-display text-2xl italic">Available quantity</h2>
    <p className="mt-2 text-sm text-foreground-soft">Update availability manually. Set 0 to show Sold out and turn off booking. Leave blank if you do not want to set a limit.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {stays.map((stay) => <QuantityForm key={stay.slug} stay={stay} />)}
    </div>
  </section>;
}
function QuantityForm({ stay }: { stay: { slug: string; name: string; quantity: number | null } }) {
  const [state, action, pending] = useActionState(saveStayQuantity, {});
  return <form action={action} data-stay-stock={stay.slug} className="rounded-md border border-line bg-background p-4">
    <input type="hidden" name="slug" value={stay.slug} />
    <label htmlFor={`stock-${stay.slug}`} className="block text-sm font-semibold">{stay.name}</label>
    <p className="mt-1 text-xs text-muted">{stay.slug === "dorm" ? "Available beds" : stay.slug === "tent" ? "Available tents" : "Available rooms"}</p>
    <div className="mt-3 flex gap-2">
      <input id={`stock-${stay.slug}`} name="quantity" type="number" min={0} max={100000} step={1}
        defaultValue={stay.quantity ?? ""} placeholder="Not set" disabled={pending}
        className="min-w-0 flex-1 rounded border border-line bg-surface px-3 py-2 text-sm" />
      <button disabled={pending} className="btn btn-accent btn-sm disabled:opacity-60">{pending ? "Saving..." : "Save"}</button>
    </div>
    {stay.quantity === 0 && <p className="mt-2 text-sm font-semibold text-accent">Sold out</p>}
    {state.error && <p role="alert" className="mt-2 text-sm text-accent">{state.error}</p>}
    {state.success && <p role="status" className="mt-2 text-sm text-secondary-ink">{state.success}</p>}
  </form>;
}
