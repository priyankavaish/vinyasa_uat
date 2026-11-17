import "server-only";
import { eq,sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { getEvent } from "@/lib/cms";
import { ensureBookingColumns,getBooking } from "@/lib/store";
import { eventPaymentBookingId } from "@/lib/event-checkout";
type VerifiedEventPayment={id:string;order_id?:string|null;amount:number;email?:string|null;contact?:string|null;notes?:unknown};
/** Called only after a verified provider payment. Stable IDs make replay/concurrency idempotent. */
export async function recordEventLinkBooking(payment:VerifiedEventPayment,eventSlug:string,status:"paid"|"failed") {
 const event=await getEvent(eventSlug);if(!event)return null;
 await ensureBookingColumns();
 const id=eventPaymentBookingId(payment.id);
 const notes=payment.notes&&typeof payment.notes==="object"&&!Array.isArray(payment.notes)?payment.notes as Record<string,unknown>:{};
 const guestName=typeof notes.guest_name==="string"?notes.guest_name:typeof notes.name==="string"?notes.name:"Guest";
 const fields={status,guestName,guestEmail:payment.email||"",guestPhone:payment.contact||"",failureReason:status==="failed"?"Payment failed":null};
 await getDb().insert(bookings).values({id,type:"event",itemSlug:eventSlug,eventDate:event.dateLabel||null,guests:1,rooms:1,amount:payment.amount/100,razorpayOrderId:payment.order_id||null,razorpayPaymentId:payment.id,...fields})
  .onConflictDoUpdate({target:bookings.id,set:fields,setWhere:sql`${bookings.status} <> 'paid' AND ${bookings.razorpayPaymentId} = ${payment.id}`});
 const saved=await getBooking(id);
 if(!saved||saved.razorpayPaymentId!==payment.id||saved.itemSlug!==eventSlug||Math.round(saved.amount*100)!==payment.amount)throw new Error("Payment booking does not match.");
 return saved;
}
