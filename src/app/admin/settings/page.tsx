import PaymentWebhookHelp from "@/components/admin/payment-webhook-help";
import NotificationRecipientsEditor from "@/components/admin/notification-recipients-editor";
import { getNotificationRouting } from "@/lib/notification-routing-store";
import { getEmailSummary } from "@/lib/email-notifications";
import EmailSettings from "@/components/admin/email-settings";
import { getSessionUser } from "@/lib/auth-server";
import ChangePasswordForm from "@/components/admin/change-password-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  const [emailSummary,routing] = await Promise.all([getEmailSummary(),getNotificationRouting()]);
  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl italic">Settings</h1>
      <p className="mt-1 text-sm text-foreground-soft">Signed in as {user?.email}.</p>

      <NotificationRecipientsEditor routing={routing} />
      <EmailSettings summary={emailSummary} />
      <PaymentWebhookHelp configured={!!process.env.RAZORPAY_WEBHOOK_SECRET} />
      <div className="mt-6 rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-xl italic">Change password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
