import { createHash } from "node:crypto";
import { z } from "zod";
export const eventLinkContextSchema=z.object({eventSlug:z.string().regex(/^[a-z0-9][a-z0-9-]{0,100}$/),url:z.string().url(),amount:z.number().positive(),label:z.string().min(1),mode:z.enum(["test","live"])});
export type EventLinkContext=z.infer<typeof eventLinkContextSchema>;
export function eventPaymentBookingId(paymentId:string) {
 if(!/^pay_[a-zA-Z0-9]+$/.test(paymentId))throw new Error("Invalid payment reference.");
 const raw=createHash("sha256").update("vinyasa:event-payment:"+paymentId).digest("hex").slice(0,32).split("");raw[12]="5";raw[16]=((parseInt(raw[16],16)&3)|8).toString(16);const hex=raw.join("");
 return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join("-");
}
export function assertEventPaymentMatchesOrder(payment:{id:string;order_id?:string|null;amount:number;currency?:string;status:string},order:{id:string;amount:number}) {
 if(payment.order_id!==order.id||payment.amount!==order.amount||payment.currency!=="INR")throw new Error("Payment does not match this order.");
 if(!["captured","failed"].includes(payment.status))throw new Error("Payment confirmation is pending.");
}
