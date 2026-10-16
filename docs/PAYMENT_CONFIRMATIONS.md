# Payment confirmations

Success, failure, cancellation and pending messages are shared by checkout, payment return and UAT.

After a server-verified captured payment, admin and customer emails have separate delivery states. Booking confirmations include reference, payment ID, amount, guest count and dates. A hosted-link payment without a website booking sends a payment receipt using Razorpay's customer email; it does not invent a booking or dates.

1. Configure Email sender and admin notification recipients in each environment's Admin Settings.
2. Add that environment's `/api/razorpay/webhook` URL in Razorpay and subscribe to `payment.captured` and `order.paid`.
3. Use the matching `RAZORPAY_WEBHOOK_SECRET` configured in that Vercel project. Use separate secrets and Razorpay test/live configurations for UAT and production.
4. Checkout also requires `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`. Static hosted payment links can use the signed webhook without checkout keys.
5. For a website return popup after hosted payment, configure the Razorpay callback URL. The popup accepts either a verified signature plus captured-payment lookup, or a payment already confirmed by the signed webhook.

Duplicate events skip successfully delivered emails. Failed/missing-configuration deliveries are visible and retryable under Admin Bookings; retrying a customer mail does not resend a delivered admin mail. Missing customer email cannot be invented, and is reported in the delivery status.

UAT payment testing remains isolated and does not charge money. Its success test requires UAT admin login and customer/booking details before it creates a UAT booking and attempts both emails. Merely opening a sample popup sends no email.
