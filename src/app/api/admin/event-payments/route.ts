import { loadBookingButton,storeBookingButton } from "@/lib/admin/booking-button-store";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth";
import { getEvent } from "@/lib/cms";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eventSlugSchema,eventPaymentSettingsSchema,configuredLinkPayload,razorpayKeyMode,eventPaymentTargets } from "@/lib/event-payment-settings";
import { saveEventPaymentSettings } from "@/lib/admin/event-payment-store";
import { revalidatePath,revalidateTag } from "next/cache";
export const runtime="nodejs";
const schema=z.object({action:z.enum(["save","create-link"]),eventSlug:eventSlugSchema,settings:eventPaymentSettingsSchema,buttonTarget:z.string().max(120).optional(),amount:z.number().min(1).max(1000000).optional(),label:z.string().trim().min(1).max(180).optional()});
export async function POST(req:NextRequest) {
  const denied=await requireAdminSession(req);if(denied)return denied;
  if(req.headers.get("origin") && req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Invalid request origin."},{status:403});
  let input;try{input=schema.safeParse(await req.json());}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
  if(!input.success)return NextResponse.json({error:input.error.issues[0]?.message || "Check the fields."},{status:400});
  const data=input.data,event=await getEvent(data.eventSlug);
  if(!event)return NextResponse.json({error:"Event not found."},{status:404});
  try {
    if(data.action==="save") {
      await saveEventPaymentSettings(data.eventSlug,data.settings);revalidateTag("content");revalidatePath("/events/"+data.eventSlug);
      return NextResponse.json({message:"Saved. These messages and email settings apply to this event's configured payment links."});
    }
    if(data.buttonTarget&&!eventPaymentTargets(data.eventSlug).some(target=>target.value===data.buttonTarget))return NextResponse.json({error:"Choose a payment button belonging to this event."},{status:400});
    const mode=razorpayKeyMode(process.env.RAZORPAY_KEY_ID);
    if(mode==="unconfigured"||!process.env.RAZORPAY_KEY_SECRET)return NextResponse.json({error:"Razorpay keys are not configured on this server."},{status:409});
    if(process.env.NODE_ENV!=="production"&&mode!=="test")return NextResponse.json({error:"Use Razorpay test keys for the local preview. Live links are not generated locally."},{status:409});
    if(!data.amount||!data.label)return NextResponse.json({error:"Enter the pass name and amount."},{status:400});
    const payload=configuredLinkPayload(data.eventSlug,data.amount,data.label,req.nextUrl.origin);
    const response=await fetch("https://api.razorpay.com/v1/payment_links/",{method:"POST",headers:{Authorization:"Basic "+Buffer.from(process.env.RAZORPAY_KEY_ID+":"+process.env.RAZORPAY_KEY_SECRET).toString("base64"),"Content-Type":"application/json"},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
    if(!response.ok)return NextResponse.json({error:response.status===401?"Razorpay rejected the configured keys. Check this server's test/live keys.":"Razorpay could not create the link. Check the account and try again."},{status:502});
    const link=await response.json() as {id:string;short_url:string};
    if(!/^plink_[a-zA-Z0-9]+$/.test(link.id)||!link.short_url)throw new Error("Invalid provider response.");
    await saveEventPaymentSettings(data.eventSlug,data.settings);
    await getDb().insert(siteContent).values({key:"event-payment-link:"+link.id,value:{eventSlug:data.eventSlug,url:link.short_url,amount:data.amount,label:data.label,mode,callback:payload.callback_url},updatedAt:new Date()});
    if(data.buttonTarget) {
      const button=await loadBookingButton(data.buttonTarget);
      await storeBookingButton("event",data.buttonTarget.slice("event:".length),undefined,{...button,url:link.short_url});
      revalidateTag("content");revalidatePath("/events/"+data.eventSlug);
    }
    return NextResponse.json({url:link.short_url,mode,message:data.buttonTarget?"Payment button connected. Verified success/failure now updates the booking and automatically emails the customer.":"Payment link created with automatic return to this event. Copy it into the corresponding payment button. Existing buttons were not changed."});
  } catch(error) {
    const known=error instanceof Error&&(error.message.startsWith("Email sender is not configured") || error.message.startsWith("Gmail sender connection expired"))?error.message:"Could not complete the action. Check email/payment configuration and try again.";
    return NextResponse.json({error:known},{status:500});
  }
}
