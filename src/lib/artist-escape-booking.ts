import "server-only";
import { createHmac,randomBytes,timingSafeEqual } from "node:crypto";
import { eq,like,or } from "drizzle-orm";
import { getDb,isLocalDb } from "@/lib/db";
import { leads,siteContent } from "@/lib/db/schema";
import { getBooking,createBooking,updateBookingStatus,ensureBookingCurrencyPrecision,BOOKING_HOLD_MINUTES,type Booking } from "@/lib/store";
import { getCottages } from "@/lib/cms";
import { unitsLeft,nightlyAvailability } from "@/lib/stay-availability";
import { createOrder } from "@/lib/razorpay";
import { getEmailConfig,sendAccountEmail } from "@/lib/email-notifications";
import { gmailAccountConfigured,sendGmail } from "@/lib/gmail-send";
import { artistEscapeQuote,ARTIST_ESCAPE_PLANS,type ArtistEscapeQuote } from "./artist-escape-plans";
export type ArtistApproval={leadId:string;issuedAt:number;expiresAt:number;approvedAt:string;approvedBy:string;bookingId?:string;emailState?:"preview"|"sent"|"failed";error?:string};
export type ArtistBookingMeta=ArtistEscapeQuote & {applicationId:string;dormName:string};
export type ArtistMail={id:string;to:string;subject:string;body:string;state:"preview"|"sent"|"failed";error?:string;updatedAt:string};
const approvalKey=(id:string)=>"artist-escape:approval:"+id;
export function assertArtistEscapeLocal(){if(process.env.NODE_ENV!=="development"||!isLocalDb())throw new Error("Artist Escape booking is currently available only with the local development database.");}
async function read<T>(key:string):Promise<T|null>{const [r]=await getDb().select().from(siteContent).where(eq(siteContent.key,key)).limit(1);return r?(r.value as T):null;}
async function save(key:string,value:unknown){await getDb().insert(siteContent).values({key,value}).onConflictDoUpdate({target:siteContent.key,set:{value,updatedAt:new Date()}});}
function signature(a:ArtistApproval){const secret=process.env.SESSION_SECRET;if(!secret)throw new Error("Local SESSION_SECRET is required.");return createHmac("sha256",secret).update(`artist-escape:${a.leadId}:${a.issuedAt}:${a.expiresAt}`).digest("hex");}
function token(a:ArtistApproval){return a.leadId+"."+signature(a);}
function artistBookingLink(approval: ArtistApproval, origin: string) {
  const url = new URL("/artist-escape/book", process.env.ARTIST_ESCAPE_BOOKING_ORIGIN || origin);
  url.searchParams.set("token", token(approval));
  return url.toString();
}

async function mail(id:string,to:string,subject:string,body:string){
 const key="artist-escape:mail:"+id;const previous=await read<ArtistMail>(key);if(previous?.state==="sent")return previous;
 const entry:ArtistMail={id,to,subject,body,state:"preview",updatedAt:new Date().toISOString()};
 if(process.env.ARTIST_ESCAPE_EMAIL_MODE!=="preview")try{
  if(gmailAccountConfigured("ashram"))await sendGmail("ashram",{to:[to],subject,text:body});
  else{const config=await getEmailConfig();if(!config)throw new Error("Configure an email sender in Settings.");await sendAccountEmail(config,to,subject,body,config.sender,id);}
  entry.state="sent";
 }catch(e){entry.state="failed";entry.error=e instanceof Error?e.message:"Email delivery failed.";}
 await save(key,entry);return entry;
}
export async function getArtistBookingMeta(id:string){return read<ArtistBookingMeta>("artist-escape:booking:"+id);}
export async function listArtistBookingMetadata(){const rows=await getDb().select().from(siteContent).where(like(siteContent.key,"artist-escape:booking:%"));return Object.fromEntries(rows.map(r=>[r.key.slice("artist-escape:booking:".length),r.value as ArtistBookingMeta]));}
export async function approvalDetails(id:string,origin:string){assertArtistEscapeLocal();const a=await read<ArtistApproval>(approvalKey(id));if(!a)return null;return {...a,link:artistBookingLink(a, origin),email:await read<ArtistMail>("artist-escape:mail:approval:"+id+":"+a.issuedAt)};}
export type ArtistRejection = { remark: string; rejectedAt: string; rejectedBy: string; emailState?: ArtistMail["state"]; emailError?: string };
const rejectionKey = (id: string) => "artist-escape:rejection:" + id;

export type ArtistReviewStatus = "Approved" | "Rejected";

export async function listArtistReviewStatuses(): Promise<Record<string, ArtistReviewStatus>> {
  const approvalPrefix = approvalKey("");
  const rejectionPrefix = rejectionKey("");
  const rows = await getDb().select({ key: siteContent.key }).from(siteContent).where(or(
    like(siteContent.key, approvalPrefix + "%"),
    like(siteContent.key, rejectionPrefix + "%"),
  ));
  return Object.fromEntries(rows.map(({ key }) => key.startsWith(approvalPrefix)
    ? [key.slice(approvalPrefix.length), "Approved"]
    : [key.slice(rejectionPrefix.length), "Rejected"]));
}

export async function getArtistRejection(id: string) {
  assertArtistEscapeLocal();
  return read<ArtistRejection>(rejectionKey(id));
}

export async function rejectArtist(id: string, admin: string, remark: string) {
  assertArtistEscapeLocal();
  const [lead] = await getDb().select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead || lead.source !== "artist-escape") throw new Error("Artist Escape application not found.");
  if (await read<ArtistApproval>(approvalKey(id))) throw new Error("This application has already been approved.");
  const rejection = await getArtistRejection(id) ?? { remark, rejectedAt: new Date().toISOString(), rejectedBy: admin };
  await save(rejectionKey(id), rejection);
  const email = await mail(
    "rejection:" + id,
    lead.email,
    "Update on your Artist Escape application",
    'Hello ' + lead.name + ',\n\nThank you for applying to Artist Escape. After reviewing your application, we are unable to offer you a place at this time.\n\nThank you for your interest in Vinyasa Earth.\n\nThe Vinyasa Earth team',
  );
  const result = { ...rejection, emailState: email.state, emailError: email.error };
  await save(rejectionKey(id), result);
  return result;
}

export async function approveArtist(id:string,admin:string,origin:string){
 assertArtistEscapeLocal();const [lead]=await getDb().select().from(leads).where(eq(leads.id,id)).limit(1);if(!lead||lead.source!=="artist-escape")throw new Error("Artist Escape application not found.");
 if (await getArtistRejection(id)) throw new Error("This application has been rejected.");
 let a=await read<ArtistApproval>(approvalKey(id));if(a?.bookingId){const b=await getBooking(a.bookingId);if(b?.status==="paid")throw new Error("This application already has a confirmed booking.");}
 if(!a||a.expiresAt<=Date.now())a={leadId:id,issuedAt:Date.now(),expiresAt:Date.now()+7*86400000,approvedAt:new Date().toISOString(),approvedBy:admin,...(a?.bookingId?{bookingId:a.bookingId}:{})};
 await save(approvalKey(id),a);
 const link=artistBookingLink(a, origin);
 const delivered=await mail("approval:"+id+":"+a.issuedAt,lead.email,"Your Artist Escape application is approved",`Hello ${lead.name},\n\nYour Artist Escape application has been approved!\nChoose your dorm, available dates and stay plan, then complete payment here:\n${link}\n\nOne approved artist / one dorm bed. INR 900/night for 1-14 nights or INR 750/night for 15+ nights, plus 5% GST. Three meals daily included.\nLink expires ${new Date(a.expiresAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST. Approval does not reserve a bed.\n\nVinyasa Earth`);
 a.emailState=delivered.state;a.error=delivered.error;await save(approvalKey(id),a);return approvalDetails(id,origin);
}
export async function authorizedArtist(value:string){
 assertArtistEscapeLocal();const match=/^([a-f0-9-]{36})\.([a-f0-9]{64})$/.exec(value);if(!match)throw new Error("This booking link is invalid.");
 const a=await read<ArtistApproval>(approvalKey(match[1]));if(!a||!timingSafeEqual(Buffer.from(signature(a),"hex"),Buffer.from(match[2],"hex")))throw new Error("This booking link is invalid or has been replaced.");
 const [lead]=await getDb().select().from(leads).where(eq(leads.id,a.leadId)).limit(1);if(!lead||lead.source!=="artist-escape")throw new Error("Application no longer exists.");
 const booking=a.bookingId?await getBooking(a.bookingId):null;
 if(a.expiresAt<=Date.now()&&booking?.status!=="paid")throw new Error("This booking link has expired. Ask our team to resend approval.");
 return {approval:a,lead,booking};
}
export async function artistBookingView(value:string){
 const {approval,lead,booking}=await authorizedArtist(value);const dorms=(await getCottages()).filter(c=>c.slug==="dorm");
 const today=new Date(Date.now()+19800000).toISOString().slice(0,10);const end=new Date(Date.parse(today)+366*86400000).toISOString().slice(0,10);
 const availability=await nightlyAvailability(dorms.map(d=>d.slug),today,end);
 // Refresh after stale-hold expiry has run in nightlyAvailability.
 const current=booking?await getBooking(booking.id):null;
 return {name:lead.name,email:lead.email,phone:lead.phone||"",expiresAt:approval.expiresAt,dorms:dorms.map(d=>({slug:d.slug,name:d.name})),plans:ARTIST_ESCAPE_PLANS,availability,today,booking:current,quote:current?await getArtistBookingMeta(current.id):null,paymentKey:process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_")?process.env.RAZORPAY_KEY_ID:null};
}
export async function createArtistReservation(value:string,input:{planId:string;checkIn:string;checkOut:string;dormSlug:string;accepted:boolean}){
 const {approval,lead,booking}=await authorizedArtist(value);if(!input.accepted)throw new Error("Accept the community guidelines and booking terms before payment.");if(booking?.status==="paid")throw new Error("Your Artist Escape stay is already confirmed.");
 const quote=artistEscapeQuote(input.planId,input.checkIn,input.checkOut);
 if(booking?.status==="pending"&&Date.parse(booking.createdAt)+BOOKING_HOLD_MINUTES*60000>Date.now()){
  const meta=await getArtistBookingMeta(booking.id);if(booking.checkIn!==input.checkIn||booking.checkOut!==input.checkOut||meta?.planId!==input.planId)throw new Error("You already have a bed hold. Cancel it before changing dates or plan.");if(!booking.razorpayOrderId)throw new Error("Payment setup is pending. Cancel this hold and try again.");
  return {booking,pricing:meta,order:{id:booking.razorpayOrderId,amount:Math.round(booking.amount*100),currency:"INR",mock:booking.razorpayOrderId.startsWith("order_mock")}};
 }
 const dorm=(await getCottages()).find(c=>c.slug==="dorm"&&c.slug===input.dormSlug);if(!dorm)throw new Error("Please choose the Artist Escape dorm.");
 const left=(await unitsLeft([dorm],input.checkIn,input.checkOut))[dorm.slug];if(left===null||left===undefined)throw new Error("Set the dorm bed capacity in Admin > Stays before accepting bookings.");if(left<1)throw new Error("These dates are no longer available. Please choose other dates.");
 await ensureBookingCurrencyPrecision();let b=await createBooking({type:"stay",itemSlug:dorm.slug,checkIn:input.checkIn,checkOut:input.checkOut,guests:1,rooms:1,guestName:lead.name,guestEmail:lead.email,guestPhone:lead.phone||"",amount:quote.totalAmount,termsAcceptedAt:new Date(),termsVersion:"artist-escape-2026-11-v1"});
 const meta:ArtistBookingMeta={...quote,applicationId:lead.id,dormName:dorm.name};
 try{
  await save("artist-escape:booking:"+b.id,meta);approval.bookingId=b.id;await save(approvalKey(lead.id),approval);
  const realTest=process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_")&&process.env.RAZORPAY_KEY_SECRET;
  const order=realTest?await createOrder(quote.totalPaise,"artist-"+b.id.slice(0,30)):{id:"order_mock_artist_"+randomBytes(12).toString("hex"),amount:quote.totalPaise,currency:"INR",mock:true};
  b=(await updateBookingStatus(b.id,"pending",{razorpayOrderId:order.id}))!;return {booking:b,pricing:meta,order};
 }catch(e){await updateBookingStatus(b.id,"failed",{failureReason:"Payment setup failed; bed released"});throw e;}
}
export async function artistConfirmation(booking:Booking){
 const meta=await getArtistBookingMeta(booking.id);if(!meta||booking.status!=="paid")return null;
 return mail("confirmed:"+booking.id,booking.guestEmail,"Thank you - your Artist Escape booking is confirmed",`Hello ${booking.guestName},\n\nThank you! Your Artist Escape booking is confirmed.\n\nBooking reference: ${booking.id}\nDorm: ${meta.dormName} - 1 bed\nPlan: ${meta.planName}\nCheck-in: ${booking.checkIn}\nCheck-out: ${booking.checkOut}\nNights: ${meta.nights}\nBase contribution: INR ${meta.baseAmount.toFixed(2)}\nGST (5%): INR ${meta.gstAmount.toFixed(2)}\nTotal paid: INR ${booking.amount.toFixed(2)}\nPayment reference: ${booking.razorpayPaymentId||"Local test payment"}\n\nThree meals daily included. We look forward to welcoming you to Vinyasa Earth.\nFor arrival information, reply to this email.\n\n${booking.razorpayOrderId?.startsWith("order_mock")?"LOCAL TEST - no money was charged.":"Razorpay test mode - no live charge."}`);
}
export async function getArtistMail(bookingId:string){return read<ArtistMail>("artist-escape:mail:confirmed:"+bookingId);}
export async function cancelArtistHold(value:string,id:string){const {booking}=await authorizedArtist(value);if(!booking||booking.id!==id||booking.status!=="pending")throw new Error("Active reservation not found.");await updateBookingStatus(id,"failed",{failureReason:"Artist cancelled payment; bed released"});}
export async function verifyArtistPayment(value:string,input:{bookingId:string;orderId:string;paymentId:string;signature:string}){
 const {booking}=await authorizedArtist(value);if(!booking||booking.id!==input.bookingId||booking.razorpayOrderId!==input.orderId)throw new Error("Payment does not match this application.");
 if(booking.status==="paid"){await artistConfirmation(booking);return booking;}
 if(booking.status!=="pending"||Date.parse(booking.createdAt)+BOOKING_HOLD_MINUTES*60000<=Date.now())throw new Error("The bed hold expired. Contact the team if payment was deducted; do not pay again.");
 if(!booking.razorpayOrderId.startsWith("order_mock_artist_")){
  const {verifySignature,fetchRazorpayPayment}=await import("@/lib/razorpay");const {capturedPaymentSchema}=await import("@/lib/razorpay-events");if(!verifySignature(input.orderId,input.paymentId,input.signature))throw new Error("Payment signature could not be verified.");
  const p=capturedPaymentSchema.parse(await fetchRazorpayPayment(input.paymentId));if(p.order_id!==input.orderId||p.amount!==Math.round(booking.amount*100))throw new Error("Captured payment does not match the booking.");
 }
 const paid=await updateBookingStatus(booking.id,"paid",{razorpayPaymentId:input.paymentId});if(!paid)throw new Error("Booking not found.");await artistConfirmation(paid);return paid;
}
