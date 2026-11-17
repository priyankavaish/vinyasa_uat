import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { loadEventPaymentLink } from "@/lib/admin/event-payment-store";
import { createOrder } from "@/lib/razorpay";
import { razorpayKeyMode } from "@/lib/event-payment-settings";
const schema=z.object({linkId:z.string().regex(/^plink_[a-zA-Z0-9]+$/)});
export async function POST(req:NextRequest) {
 if(req.headers.get("origin")&&req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Invalid request origin."},{status:403});
 let parsed;try{parsed=schema.safeParse(await req.json());}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 if(!parsed.success)return NextResponse.json({error:"Choose a valid payment option."},{status:400});
 try {
  const link=await loadEventPaymentLink(parsed.data.linkId);
  if(!link)return NextResponse.json({error:"Payment option not found."},{status:404});
  const mode=razorpayKeyMode(process.env.RAZORPAY_KEY_ID);
  if(mode!==link.mode||!process.env.RAZORPAY_KEY_SECRET)return NextResponse.json({error:"This payment option belongs to a different payment environment."},{status:409});
  const order=await createOrder(Math.round(link.amount*100),"evt_"+Date.now(),{vinyasa_event:link.eventSlug});
  if(order.mock)throw new Error("Real checkout is not configured.");
  await getDb().insert(siteContent).values({key:"event-payment-order:"+order.id,value:{...link,orderId:order.id,amountPaise:order.amount},updatedAt:new Date()});
  return NextResponse.json({order,key:process.env.RAZORPAY_KEY_ID,label:link.label,eventSlug:link.eventSlug},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Could not open payment checkout. Please try again."},{status:503});}
}
