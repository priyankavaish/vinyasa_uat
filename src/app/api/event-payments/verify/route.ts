import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { loadEventPaymentSettings } from "@/lib/admin/event-payment-store";
import { eventPaymentMessages } from "@/lib/event-payment-settings";
import { fetchRazorpayPayment,verifySignature } from "@/lib/razorpay";
import { capturedPaymentSchema } from "@/lib/razorpay-events";
import { confirmCapturedPayment } from "@/lib/payment-confirmation";
import { notifyFailedEventPayment } from "@/lib/event-payment-failure";
import { assertEventPaymentMatchesOrder } from "@/lib/event-checkout";
const input=z.object({orderId:z.string().regex(/^order_[a-zA-Z0-9]+$/),paymentId:z.string().regex(/^pay_[a-zA-Z0-9]+$/),signature:z.string().max(200).optional()});
const entitySchema=z.object({id:z.string(),order_id:z.string(),amount:z.number().int(),currency:z.string(),status:z.string()});
export async function POST(req:NextRequest) {
 let parsed;try{parsed=input.safeParse(await req.json());}catch{return NextResponse.json({status:"unverified"},{status:400});}
 if(!parsed.success)return NextResponse.json({status:"unverified"},{status:400});
 try {
  const data=parsed.data;
  const [saved]=await getDb().select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,"event-payment-order:"+data.orderId)).limit(1);
  if(!saved)return NextResponse.json({status:"unverified"},{status:404});
  const order=saved.value as {eventSlug:string;amountPaise:number};
  const provider=await fetchRazorpayPayment(data.paymentId);
  const payment=entitySchema.parse(provider);
  assertEventPaymentMatchesOrder(payment,{id:data.orderId,amount:order.amountPaise});
  const settings=await loadEventPaymentSettings(order.eventSlug);
  if(payment.status==="captured") {
   if(!data.signature||!verifySignature(data.orderId,data.paymentId,data.signature))return NextResponse.json({status:"unverified"},{status:400});
   const booking=await confirmCapturedPayment(capturedPaymentSchema.parse(provider),{eventSlug:order.eventSlug});
   revalidatePath("/admin/bookings");
   return NextResponse.json({status:"success",showPopup:settings.showPopup,copy:eventPaymentMessages(settings,"success"),bookingReference:booking?.id},{headers:{"Cache-Control":"no-store"}});
  }
  // Failed status/email come from the provider API, never from a browser's claimed outcome.
  await notifyFailedEventPayment({...provider,notes:{...(provider.notes&&!Array.isArray(provider.notes)?provider.notes:{}),vinyasa_event:order.eventSlug}});
  revalidatePath("/admin/bookings");
  return NextResponse.json({status:"failed",showPopup:settings.showPopup,copy:eventPaymentMessages(settings,"failed")},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({status:"unverified",error:"Payment could not be confirmed yet. Please contact Vinyasa before paying again if money was deducted."},{status:409});}
}
