import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { DEFAULT_PAYMENT_BUTTON, paymentButtonSchema, paymentKey, type PaymentButtonSettings } from "@/lib/payment-buttons";

export async function loadBookingButton(target: string) {
  const [row] = await getDb().select().from(siteContent).where(eq(siteContent.key, paymentKey(target))).limit(1);
  const parsed = paymentButtonSchema.safeParse(row?.value);
  return parsed.success ? parsed.data : DEFAULT_PAYMENT_BUTTON;
}

export async function storeBookingButton(kind: "stay" | "event", slug: string, previousSlug: string | undefined, settings: PaymentButtonSettings | null) {
  const db = getDb();
  const oldKey = paymentKey(`${kind}:${previousSlug || slug}`);
  const newKey = paymentKey(`${kind}:${slug}`);
  const [existing] = await db.select().from(siteContent).where(eq(siteContent.key, oldKey)).limit(1);
  const value = settings ?? existing?.value;
  if (!value) return;
  // Saving an otherwise unedited item must not introduce a theme override.
  if (!existing && settings && Object.entries(DEFAULT_PAYMENT_BUTTON).every(([key, expected]) => settings[key as keyof PaymentButtonSettings] === expected)) return;
  await db.insert(siteContent).values({ key: newKey, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
  if (oldKey !== newKey) await db.delete(siteContent).where(eq(siteContent.key, oldKey));
}
