export const PAYMENT_MESSAGES = {
  success: { title: "Thank you, payment received.", message: "Your payment was successful. The Vinyasa team will confirm your booking details shortly." },
  failed: { title: "Payment failed", message: "Your payment could not be completed. Please try again. If money was deducted, contact Vinyasa before paying again." },
  cancelled: { title: "Payment cancelled", message: "Your payment was cancelled. Your booking is not confirmed. You can try again when ready." },
  unverified: { title: "Payment confirmation pending", message: "We could not confirm your payment yet. If money was deducted, contact Vinyasa with your payment reference before paying again." },
  checking: { title: "Checking payment...", message: "Please wait while we confirm your payment." },
} as const;
