import "server-only";
import { z } from "zod";
import { eventSlugSchema } from "@/lib/event-payment-settings";
import { recordEventLinkBooking } from "@/lib/event-link-booking";
import { notifyEntry } from "@/lib/email-notifications";
const failureSchema=z.object({id:z.string().regex(/^pay_[a-zA-Z0-9]+$/),order_id:z.string().nullable().optional(),email:z.string().nullable().optional(),contact:z.string().nullable().optional(),amount:z.number().int().nonnegative(),status:z.literal("failed"),notes:z.object({vinyasa_event:eventSlugSchema}).passthrough()});
/** Only a signed webhook or a verified provider API response may invoke this. */
export async function notifyFailedEventPayment(value:unknown) {
 const parsed=failureSchema.safeParse(value);if(!parsed.success)return;
 const payment=parsed.data;
 const booking=await recordEventLinkBooking(payment,payment.notes.vinyasa_event,"failed");
 if(booking?.status === "failed")await notifyEntry("booking-failed",booking);
}
