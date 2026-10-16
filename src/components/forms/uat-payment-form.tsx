"use client";
import { useState } from "react";
import SuccessDialog from "./success-dialog";
import { PAYMENT_MESSAGES } from "@/lib/payment-messages";
type Option = { type:"stay"|"event";slug:string;name:string };
export default function UatPaymentForm({options}:{options:Option[]}) {
  const [result,setResult] = useState<"success"|"failed"|"cancelled"|null>(null);
  const [selected,setSelected] = useState(options[0]?.slug || "");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const option=options.find(item=>item.slug===selected);
  const field="mt-1 w-full border border-line bg-background px-3 py-2";
  return <><form className="mt-6 space-y-4" onSubmit={async event=>{
    event.preventDefault();if(!option)return;setBusy(true);setMessage("");
    const data=Object.fromEntries(new FormData(event.currentTarget));
    try{
      const response=await fetch("/api/uat/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,type:option.type,itemSlug:option.slug})});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error || "Could not complete payment. Please try again.");
      setResult("success");setMessage(body.emailConfigured ? "Booking reference: "+body.bookingId : "Booking reference: "+body.bookingId+". Email sender setup is required in Admin Settings to send confirmations.");
    }catch(error){setMessage(error instanceof Error?error.message:"Could not complete payment. Please try again.");}
    finally{setBusy(false);}
  }}><fieldset disabled={busy} className="space-y-4">
    <label className="block text-sm">Stay / event<select required value={selected} onChange={e=>setSelected(e.target.value)} className={field}>{options.map(item=><option key={item.type+item.slug} value={item.slug}>{item.name}</option>)}</select></label>
    <label className="block text-sm">Full name<input name="guestName" required minLength={2} className={field}/></label>
    <label className="block text-sm">Customer email<input name="guestEmail" type="email" required className={field}/></label>
    <label className="block text-sm">Phone<input name="guestPhone" required minLength={7} className={field}/></label>
    <label className="block text-sm">Guests<input name="guests" type="number" min={1} max={20} required defaultValue={1} className={field}/></label>
    {option?.type==="stay" ? <div className="grid grid-cols-2 gap-3"><label className="block text-sm">Check-in<input name="checkIn" type="date" required className={field}/></label><label className="block text-sm">Check-out<input name="checkOut" type="date" required className={field}/></label></div> : <label className="block text-sm">Event date<input name="eventDate" type="date" required className={field}/></label>}
    <div className="flex flex-wrap gap-3"><button type="submit" className="btn btn-accent">{busy?"Processing...":"Test success"}</button><button type="button" className="btn btn-outline" onClick={()=>setResult("failed")}>Test failure</button><button type="button" className="btn btn-outline" onClick={()=>setResult("cancelled")}>Test cancellation</button></div>
  </fieldset></form><p role="status" className="mt-4 text-sm">{message}</p><SuccessDialog open={result!==null} onClose={()=>setResult(null)}>{result && <><h2 className="font-display text-3xl">{PAYMENT_MESSAGES[result].title}</h2><p className="mt-4">{PAYMENT_MESSAGES[result].message}</p></>}</SuccessDialog></>;
}
