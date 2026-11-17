import { EVENT_PAYMENT_SENDER } from "@/lib/event-payment-settings";
import "server-only";
import { gmailAccountConfigured, sendGmail } from "@/lib/gmail-send";
import { getEmailConfig, sendAccountEmail } from "@/lib/email-notifications";
export async function sendEventPaymentEmail(recipient: string, mail: {subject:string;text:string}) {
  if (gmailAccountConfigured("bookings")) {
    try { await sendGmail("bookings",{to:[recipient],...mail}); return; }
    catch(error) { if(error instanceof Error && error.message.startsWith("Gmail token refresh failed")) throw new Error("Gmail sender connection expired. Reconnect the event sender, then retry the test email."); throw error; }
  }
  const config = await getEmailConfig();
  if (!config || config.sender.trim().toLowerCase() !== EVENT_PAYMENT_SENDER) throw new Error("Email sender is not configured. Connect bookings.vinyasaearth@gmail.com before sending event payment emails.");
  await sendAccountEmail(config,recipient,mail.subject,mail.text);
}
