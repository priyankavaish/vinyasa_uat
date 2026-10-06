import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { eq, like, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteContent, leads } from "@/lib/db/schema";
import { getBooking, type Booking, type Lead } from "@/lib/store";
import { SITE_ORIGIN } from "@/lib/site";
export const NOTIFICATION_RECIPIENT = "priyanka6199@gmail.com";
export const EMAIL_CONFIG_KEY = "email-notifications:config";
export type EmailKind = "lead" | "booking" | "payment";
export type EmailConfig = { provider: "gmail" | "smtp" | "resend"; sender: string; host: string; port: number; user: string; secret: string; siteUrl?: string };
export type EmailState = { kind: EmailKind; entryId: string; state: "sending" | "sent" | "failed" | "unconfigured"; updatedAt: string; error?: string };
function key() {
 if (!process.env.SESSION_SECRET) throw new Error("Session secret is not configured.");
 return createHash("sha256").update(process.env.SESSION_SECRET).digest();
}
export function encryptEmailSecret(value: string) {
 const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", key(), iv);
 const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
 return [iv, cipher.getAuthTag(), data].map(part => part.toString("base64")).join(".");
}
function decryptEmailSecret(value: string) {
 const [iv, tag, data] = value.split(".").map(part => Buffer.from(part, "base64"));
 const cipher = createDecipheriv("aes-256-gcm", key(), iv); cipher.setAuthTag(tag);
 return Buffer.concat([cipher.update(data), cipher.final()]).toString("utf8");
}
export async function getEmailConfig(): Promise<EmailConfig | null> {
 const [row] = await getDb().select().from(siteContent).where(eq(siteContent.key, EMAIL_CONFIG_KEY)).limit(1);
 if (row) { const value = row.value as EmailConfig; return { ...value, secret: decryptEmailSecret(value.secret) }; }
 if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) return { provider: "resend", sender: process.env.EMAIL_FROM, host: "", port: 587, user: "", secret: process.env.RESEND_API_KEY };
 if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) return { provider: process.env.SMTP_HOST ? "smtp" : "gmail", sender: process.env.EMAIL_FROM || process.env.SMTP_USER, host: process.env.SMTP_HOST || "smtp.gmail.com", port: Number(process.env.SMTP_PORT || 465), user: process.env.SMTP_USER, secret: process.env.SMTP_PASSWORD };
 return null;
}
export async function getEmailSummary() {
 try { const config = await getEmailConfig(); return { configured: !!config, recipient: NOTIFICATION_RECIPIENT, provider: config?.provider || "gmail", sender: config?.sender || "", host: config?.host || "", port: config?.port || 587, user: config?.user || "", siteUrl: config?.siteUrl || "" }; }
 catch { return { configured: false, recipient: NOTIFICATION_RECIPIENT, provider: "gmail", sender: "", host: "", port: 587, user: "", siteUrl: "" }; }
}
export async function sendAccountEmail(config: EmailConfig, recipient: string, subject: string, text: string, replyTo?: string, idempotencyKey?: string) {
 if (config.provider === "resend") {
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + config.secret, "Content-Type": "application/json", ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}) }, body: JSON.stringify({ from: config.sender, to: [recipient], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Email provider rejected the message. Check sender verification and credentials.");
  return;
 }
 const transport = nodemailer.createTransport({
  ...(config.provider === "gmail" ? { service: "gmail" } : { host: config.host, port: config.port, secure: config.port === 465, requireTLS: true }),
  auth: { user: config.user, pass: config.secret }, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 10000,
  disableFileAccess: true, disableUrlAccess: true,
 });
 try {
  const result = await transport.sendMail({ from: { name: "Vinyasa Earth", address: config.sender }, to: recipient, subject, text, replyTo });
  if (!result.accepted?.length) throw new Error("Email was not accepted.");
 } finally { transport.close(); }
}
export async function sendNotificationEmail(config: EmailConfig, subject: string, text: string, replyTo?: string, idempotencyKey?: string) {
 return sendAccountEmail(config, NOTIFICATION_RECIPIENT, subject, text, replyTo, idempotencyKey);
}
function messageFor(kind: EmailKind, entry: Lead | Booking) {
 const url = new URL(kind === "lead" ? "/admin/contact" : "/admin/bookings", SITE_ORIGIN).toString();
 if (kind === "lead") {
  const lead = entry as Lead;
  return { subject: "Vinyasa Earth: new " + lead.source + " enquiry", replyTo: lead.email, text: ["New website enquiry", "Reference: " + lead.id, "Form: " + lead.source, "Name: " + lead.name, "Email: " + lead.email, "Phone: " + (lead.phone || "Not supplied"), "", lead.message || "No message", "", "View entry: " + url].join("\n") };
 }
 const booking = entry as Booking;
 return { subject: "Vinyasa Earth: " + (kind === "payment" ? "payment confirmed" : "new booking") + " (" + booking.type + ")", replyTo: booking.guestEmail, text: ["Reference: " + booking.id, "Type: " + booking.type, "Stay / event: " + booking.itemSlug, "Guest: " + booking.guestName, "Email: " + booking.guestEmail, "Phone: " + booking.guestPhone, "Guests: " + booking.guests, "Check-in: " + (booking.checkIn || "—"), "Check-out: " + (booking.checkOut || "—"), "Event date: " + (booking.eventDate || "—"), "Total including GST: INR " + booking.amount.toFixed(2), "Payment status: " + booking.status, "Order: " + (booking.razorpayOrderId || "—"), "", "View entry: " + url].join("\n") };
}
export async function notifyEntry(kind: EmailKind, entry: Lead | Booking) {
 const notificationKey = "notification:" + kind + ":" + entry.id;
 let claimed = false;
 try {
  const state: EmailState = { kind, entryId: entry.id, state: "sending", updatedAt: new Date().toISOString() };
  const result = await getDb().execute(sql`INSERT INTO site_content (key, value) VALUES (${notificationKey}, ${JSON.stringify(state)}::jsonb)
   ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
   WHERE site_content.value->>'state' <> 'sent' AND (site_content.value->>'state' <> 'sending' OR site_content.updated_at < now() - interval '2 minutes') RETURNING key`);
  const rows = Array.isArray(result) ? result : (result as { rows?: unknown[] }).rows || [];
  if (!rows.length) return;
  claimed = true;
  const config = await getEmailConfig();
  if (!config) { state.state = "unconfigured"; state.error = "Email setup is required in Settings."; }
  else {
   const mail = messageFor(kind, entry);
   try { await sendNotificationEmail(config, mail.subject, mail.text, mail.replyTo, notificationKey); state.state = "sent"; }
   catch { state.state = "failed"; state.error = "Delivery failed. Check email settings and retry."; }
  }
  state.updatedAt = new Date().toISOString();
  await getDb().update(siteContent).set({ value: state, updatedAt: new Date() }).where(eq(siteContent.key, notificationKey));
 } catch {
  console.error("[email] Notification could not be completed", { kind, entryId: entry.id });
  if (claimed) try { await getDb().update(siteContent).set({ value: { kind, entryId: entry.id, state: "failed", updatedAt: new Date().toISOString(), error: "Check email configuration and retry." }, updatedAt: new Date() }).where(eq(siteContent.key, notificationKey)); } catch {}
 }
}
export async function retryNotification(kind: EmailKind, id: string) {
 const entry = kind === "lead" ? (await getDb().select().from(leads).where(eq(leads.id, id)).limit(1))[0] : await getBooking(id);
 if (!entry) throw new Error("Entry no longer exists.");
 await notifyEntry(kind, kind === "lead" ? { ...entry, createdAt: (entry as typeof leads.$inferSelect).createdAt.toISOString() } as Lead : entry as Booking);
}
export async function listEmailStates(kinds?: EmailKind[]) {
 const rows = await getDb().select().from(siteContent).where(like(siteContent.key, "notification:%"));
 return rows.map(row => row.value as EmailState).filter(row => !kinds || kinds.includes(row.kind)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
