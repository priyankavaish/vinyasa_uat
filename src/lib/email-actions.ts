"use server";
import { routingSchema } from "@/lib/notification-routing";
import { NOTIFICATION_ROUTING_KEY } from "@/lib/notification-routing-store";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth-server";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { EMAIL_CONFIG_KEY, encryptEmailSecret, getEmailConfig, retryNotification, sendNotificationEmail, type EmailKind } from "@/lib/email-notifications";
async function requireAdmin() { if (!await getSessionUser()) throw new Error("Unauthorized"); }
const configSchema = z.object({ siteUrl: z.string().trim().url().refine(value => { const url = new URL(value); return url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)); }, "Use HTTPS for the live website.").transform(value => new URL(value).origin), provider: z.enum(["gmail", "smtp", "resend"]), sender: z.string().trim().email().max(150), host: z.string().trim().max(250), port: z.coerce.number().int().min(1).max(65535), user: z.string().trim().max(150), secret: z.string().trim().max(1000) });
export async function saveEmailSettings(form: FormData) {
 await requireAdmin();
 const parsed = configSchema.safeParse(Object.fromEntries(form));
 if (!parsed.success) return { ok: false, message: "Check the sender email and configuration fields." };
 const data = parsed.data;
 if (data.provider !== "resend" && !data.user) return { ok: false, message: "Enter the email login username." };
 if (data.provider === "smtp" && !data.host) return { ok: false, message: "Enter the SMTP server hostname." };
 try {
  const existing = await getEmailConfig();
  const secret = data.secret || (existing?.provider === data.provider && existing.sender === data.sender && existing.user === data.user ? existing.secret : "");
  if (!secret) return { ok: false, message: data.provider === "resend" ? "Enter your Resend API key." : "Enter your email App Password." };
  const value = { ...data, secret: encryptEmailSecret(data.provider === "gmail" ? secret.replace(/\s/g, "") : secret) };
  await getDb().insert(siteContent).values({ key: EMAIL_CONFIG_KEY, value }).onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
  revalidatePath("/admin/settings");
  return { ok: true, message: "Saved. Send a test email to verify delivery." };
 } catch { return { ok: false, message: "Could not save email settings. Check the server configuration." }; }
}
export async function testEmailSettings(audience: "defaults" | "stays" = "defaults") {
 await requireAdmin();
 if (!["defaults", "stays"].includes(audience)) return { ok: false, message: "Choose a valid notification group." };
 try { const config = await getEmailConfig(); if (!config) return { ok: false, message: "Configure the email sender connection below first." };
  await sendNotificationEmail(config, "Vinyasa Earth: email notification test", audience === "stays" ? "This test uses the Stays & Work from Farm enquiry recipients. Reply to real enquiries from this inbox to contact your guest." : "This test uses the general notification recipients. Website entries remain available in the admin panel.", undefined, undefined, audience === "stays" ? "stay-enquiry" : undefined);
  return { ok: true, message: "Test email accepted by the provider. Check your notification recipients' Inbox and Spam." };
 } catch { return { ok: false, message: "Test delivery failed. Check sender, App Password/API key and provider settings." }; }
}
export async function resendEntryEmail(kind: EmailKind, id: string) {
 await requireAdmin();
 if (!["lead", "booking", "payment", "payment-customer", "payment-receipt", "payment-receipt-customer"].includes(kind) || !(kind.startsWith("payment-receipt") ? /^pay_[a-zA-Z0-9]+$/.test(id) : z.string().uuid().safeParse(id).success)) throw new Error("Invalid entry.");
 await retryNotification(kind, id);
 revalidatePath("/admin/contact"); revalidatePath("/admin/bookings"); revalidatePath("/admin/settings");
}

export async function saveNotificationRouting(input: unknown) {
 await requireAdmin();
 const parsed=routingSchema.safeParse(input);
 if(!parsed.success) return {ok:false,message:parsed.error.issues[0]?.message || "Check the recipient email addresses."};
 await getDb().insert(siteContent).values({key:NOTIFICATION_ROUTING_KEY,value:parsed.data}).onConflictDoUpdate({target:siteContent.key,set:{value:parsed.data,updatedAt:new Date()}});
 revalidatePath("/admin/settings");revalidatePath("/admin/contact");revalidatePath("/admin/bookings");
 return {ok:true,message:"Saved. Stays and Work from Farm enquiries use their dedicated recipients; other notifications use the general recipients."};
}
