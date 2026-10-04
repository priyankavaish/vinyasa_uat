import { redirect } from "next/navigation";
import { like } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-server";
import { getDb, hasDb } from "@/lib/db";
import { cottages, events, siteContent } from "@/lib/db/schema";
import { cottages as seedCottages, events as seedEvents, tentStay } from "@/lib/content";
import PaymentButtonsEditor from "@/components/admin/payment-buttons-editor";
import { paymentButtonSchema, type PaymentButtonSettings } from "@/lib/payment-buttons";

export const dynamic = "force-dynamic";

export default async function PaymentButtonsPage() {
  if (!await getSessionUser()) redirect("/admin/login");
  if (!hasDb()) return <p>Configure the database to manage payment buttons.</p>;
  const db = getDb();
  const [rooms, programs, saved] = await Promise.all([
    db.select().from(cottages), db.select().from(events),
    db.select().from(siteContent).where(like(siteContent.key, "payment-button:%")),
  ]);
  const stayOptions = rooms.length ? rooms : seedCottages;
  const allStays = stayOptions.some((r) => r.slug === tentStay.slug) ? stayOptions : [...stayOptions, tentStay];
  const targets = [
    ...allStays.map((r) => ({ value: `stay:${r.slug}`, label: r.name, group: "Stays", path: `/stays/${r.slug}` })),
    ...(programs.length ? programs : seedEvents).map((e) => ({ value: `event:${e.slug}`, label: e.name, group: "Events", path: `/events/${e.slug}` })),
    { value: "general", label: "Make a payment", group: "Other", path: "/useful-links" },
  ];
  const settings: Record<string, PaymentButtonSettings> = {};
  for (const row of saved) {
    const parsed = paymentButtonSchema.safeParse(row.value);
    if (parsed.success) settings[row.key.slice("payment-button:".length)] = parsed.data;
  }
  return <div className="max-w-3xl">
    <h1 className="font-display text-3xl italic">Payment buttons</h1>
    <p className="mt-2 text-sm text-foreground-soft">Choose a stay or event, paste your Razorpay link, and save.</p>
    <PaymentButtonsEditor targets={targets} settings={settings} />
  </div>;
}
