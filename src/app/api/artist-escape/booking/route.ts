import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { artistBookingView,createArtistReservation,verifyArtistPayment,cancelArtistHold,getArtistMail } from "@/lib/artist-escape-booking";
import { StayBookingBusyError, withStayBookingLock } from "@/lib/stay-booking-lock";
const reply=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
export const runtime="nodejs";
export const maxDuration = 60;
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){try{const token=z.string().min(1).parse(req.nextUrl.searchParams.get("token"));const view=await artistBookingView(token);return reply({...view,confirmationEmail:view.booking?.status==="paid"?await getArtistMail(view.booking.id):null});}catch(e){return reply({error:e instanceof Error?e.message:"Booking link unavailable"},400);}}
export async function POST(req:NextRequest){if(req.headers.get("origin")&&req.headers.get("origin")!==req.nextUrl.origin)return reply({error:"Invalid origin"},403);try{const body=await req.json();const token=z.string().min(1).parse(body.token);return await withStayBookingLock(async()=>{
 if(body.action==="reserve"){const input=z.object({planId:z.string(),checkIn:z.string().date(),checkOut:z.string().date(),dormSlug:z.literal("dorm"),accepted:z.boolean()}).parse(body);return reply(await createArtistReservation(token,input));}
 if(body.action==="verify"){const input=z.object({bookingId:z.string().uuid(),orderId:z.string().min(1),paymentId:z.string().min(1),signature:z.string()}).parse(body);return reply({booking:await verifyArtistPayment(token,input)});}
 if(body.action==="cancel"){await cancelArtistHold(token,z.string().uuid().parse(body.bookingId));return reply({ok:true});}throw new Error("Unknown booking action.");
 });}catch(e){return reply({error:e instanceof Error?e.message:"Booking request failed"},e instanceof StayBookingBusyError ? 503 : 400);}}
