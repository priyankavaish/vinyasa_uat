import { NextRequest,NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { requireAdminSession } from "@/lib/auth";
import { bookingRequestSchema } from "@/lib/schemas";
import { getCottages,getAllEvents } from "@/lib/cms";
import { bookingPrice } from "@/lib/booking-pricing";
import { createBooking,updateBookingStatus } from "@/lib/store";
import { getEmailSummary,notifyEntry } from "@/lib/email-notifications";
export async function POST(req:NextRequest){
  if(process.env.UAT_MODE!=="true")return NextResponse.json({error:"Not found"},{status:404});
  const unauthorized=await requireAdminSession(req);if(unauthorized)return NextResponse.json({error:"Sign in to UAT admin to test booking confirmation emails."},{status:401});
  const raw=await req.json().catch(()=>null);const parsed=bookingRequestSchema.safeParse(raw);
  if(!parsed.success)return NextResponse.json({error:"Enter valid booking and customer details."},{status:400});
  const data=parsed.data;
  const item=data.type==="stay"?(await getCottages()).find(item=>item.slug===data.itemSlug):(await getAllEvents()).find(item=>item.slug===data.itemSlug);
  if(!item)return NextResponse.json({error:"Choose a stay or event."},{status:400});
  const nights=data.type==="stay"&&data.checkIn&&data.checkOut?(Date.parse(data.checkOut)-Date.parse(data.checkIn))/86400000:1;
  if(data.type==="stay"&&(!data.checkIn||!data.checkOut||!Number.isFinite(nights)||nights<1||nights>366))return NextResponse.json({error:"Choose valid check-in and check-out dates."},{status:400});
  if(data.type==="event"&&!data.eventDate)return NextResponse.json({error:"Choose an event date."},{status:400});
  const base="pricePerNight" in item?item.pricePerNight*nights:item.priceFrom;
  const booking=await createBooking({...data,amount:bookingPrice(base).totalAmount,razorpayOrderId:"order_uat_"+randomUUID()});
  const paid=await updateBookingStatus(booking.id,"paid",{razorpayPaymentId:"pay_uat_"+randomUUID()});
  if(!paid)return NextResponse.json({error:"Could not save booking."},{status:500});
  await notifyEntry("payment",paid);
  revalidatePath("/admin/bookings");
  return NextResponse.json({bookingId:paid.id,emailConfigured:(await getEmailSummary()).configured});
}
