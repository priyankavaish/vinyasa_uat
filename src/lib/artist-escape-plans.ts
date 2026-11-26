import { z } from "zod";
import { bookingPrice } from "./booking-pricing";
export const ARTIST_ESCAPE_PLANS=[
 {id:"short",name:"Creative stay",description:"1-14 nights - dorm bed and three meals daily",rate:900,min:1,max:14},
 {id:"extended",name:"Extended creative stay",description:"15-366 nights - dorm bed and three meals daily",rate:750,min:15,max:366},
] as const;
export function artistEscapeQuote(planId:string,checkIn:string,checkOut:string){
 z.string().date().parse(checkIn);z.string().date().parse(checkOut);
 const nights=(Date.parse(checkOut)-Date.parse(checkIn))/86400000;
 const today=new Date(Date.now()+19800000).toISOString().slice(0,10);
 const plan=ARTIST_ESCAPE_PLANS.find(p=>p.id===planId);
 if(!plan||checkIn<today||nights<plan.min||nights>plan.max||Date.parse(checkOut)>Date.parse(today)+730*86400000)throw new Error("Choose dates matching your plan: 1-14 nights or 15-366 nights, within the next two years.");
 return {planId:plan.id,planName:plan.name,rate:plan.rate,nights,gstPercent:5,...bookingPrice(plan.rate*nights,5)};
}
export type ArtistEscapeQuote=ReturnType<typeof artistEscapeQuote>;
export function portfolioHref(value:string){try{const u=new URL(value.startsWith("www.")?"https://"+value:value);return ["https:","http:"].includes(u.protocol)?u.href:null;}catch{return null;}}
