"use client";
import { useEffect, useState } from "react";
import SuccessDialog from "@/components/forms/success-dialog";
import { DEFAULT_EVENT_PAYMENT_SETTINGS,EVENT_PAYMENT_SENDER,eventPaymentTargets,eventPaymentMessages,type EventPaymentSettings,type PaymentOutcome } from "@/lib/event-payment-settings";
type EventOption={slug:string;name:string;price:number};
const field="mt-1.5 w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent";
const messagePresets = {
 success: [
  {id:"booking-confirmed",label:"Booking confirmed",title:DEFAULT_EVENT_PAYMENT_SETTINGS.successTitle,message:DEFAULT_EVENT_PAYMENT_SETTINGS.successMessage,emailSubject:DEFAULT_EVENT_PAYMENT_SETTINGS.successEmailSubject,emailBody:DEFAULT_EVENT_PAYMENT_SETTINGS.successEmailBody},
  {id:"payment-received",label:"Payment successful - thank you",title:"Thank you! Payment successful.",message:"We have received your payment. Thank you for joining Vinyasa Earth.",emailSubject:"Vinyasa Earth: payment received",emailBody:"We have received your event payment. Thank you for joining Vinyasa Earth."}
 ],
 failure: [
  {id:"try-again",label:"Payment incomplete - try again",title:DEFAULT_EVENT_PAYMENT_SETTINGS.failureTitle,message:DEFAULT_EVENT_PAYMENT_SETTINGS.failureMessage,emailSubject:DEFAULT_EVENT_PAYMENT_SETTINGS.failureEmailSubject,emailBody:DEFAULT_EVENT_PAYMENT_SETTINGS.failureEmailBody},
  {id:"contact-support",label:"Payment failed - contact us",title:"Payment failed",message:"Your payment was unsuccessful and your booking is not confirmed. Please contact Vinyasa with your payment reference for help. If money was deducted, contact us before paying again.",emailSubject:"Vinyasa Earth: help with your event payment",emailBody:"Your payment was unsuccessful and your booking is not confirmed. Please reply with your payment reference for help. If money was deducted, contact us before paying again."}
 ]
};
export default function EventPaymentSetup({events,settings,initialSlug,mode,emailConfigured,emailReady,local,links,embedded=false}:{events:EventOption[];settings:Record<string,EventPaymentSettings>;initialSlug?:string;mode:string;embedded?:boolean;emailConfigured:boolean;emailReady:boolean|null;local:boolean;links:{eventSlug:string;label:string;url:string;mode:string}[]}) {
 const initial=events.find(e=>e.slug===initialSlug)||events.find(e=>e.slug==="dhun-a-handpan-retreat")||events[0];
 const [origin,setOrigin]=useState("");useEffect(()=>setOrigin(window.location.origin),[]);
 const [savedSettings,setSavedSettings]=useState(settings);
 const [slug,setSlug]=useState(initial?.slug||"");const [value,setValue]=useState(settings[initial?.slug||""]||DEFAULT_EVENT_PAYMENT_SETTINGS);
 const [buttonTarget,setButtonTarget]=useState(eventPaymentTargets(initial?.slug||"")[0].value);
 const [amount,setAmount]=useState(String(initial?.price||100));const [label,setLabel]=useState("");
 const [preview,setPreview]=useState<PaymentOutcome|null>(null);const [busy,setBusy]=useState("");const [message,setMessage]=useState("");const [error,setError]=useState("");const [url,setUrl]=useState("");
 const update=(key:keyof EventPaymentSettings,next:string|boolean)=>setValue(old=>({...old,[key]:next}));
 const event=events.find(e=>e.slug===slug);
 async function act(action:"save"|"create-link") {
  setBusy(action);setError("");setMessage("");
  try{const response=await fetch("/api/admin/event-payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,eventSlug:slug,settings:value,...(action==="create-link"?{amount:Number(amount),label,buttonTarget}:{})})});const body=await response.json();if(!response.ok)throw new Error(body.error||"Action failed.");setMessage(body.message);setSavedSettings(old=>({...old,[slug]:value}));if(body.url)setUrl(body.url);}
  catch(e){setError(e instanceof Error?e.message:"Please try again.");}finally{setBusy("");}
 }
 const previewCopy=eventPaymentMessages(value,preview||"success");
 if(!events.length)return <p>Add an event before configuring payments.</p>;
 return <div className={embedded ? "space-y-6 border-t border-line pt-6" : "max-w-4xl space-y-6"} data-payment-setup-ready={origin ? "true" : "false"}>
  <div>{embedded ? <h2 className="font-display text-2xl">Payment messages</h2> : <h1 className="font-display text-3xl">Event payment setup</h1>}<p className="mt-2 text-sm text-muted">Choose the standard messages customers see after payment.</p></div>
  {!embedded && <div className="flex flex-wrap gap-3 text-xs"><span className="border border-line bg-white px-3 py-2">Razorpay: {mode}</span><span className="border border-line bg-white px-3 py-2">Email sender: {emailReady === false ? "reconnect required" : emailReady ? "ready" : emailConfigured ? "configured" : "not configured"}</span>{local&&<span className="border border-line bg-surface px-3 py-2">Local preview</span>}</div>}
  {embedded && <><input type="hidden" name="eventPaymentSettings" value={JSON.stringify(value)}/><p className="text-sm font-semibold">Payments for {event?.name}</p></>}
  <p className="text-sm text-muted">Confirmation emails go automatically to the email entered by the customer in Razorpay checkout.</p>{!embedded && <p className="text-sm text-muted">Sender: {EVENT_PAYMENT_SENDER}</p>}
  {!embedded && <label className="block text-sm font-semibold">Event<select className={field} value={slug} disabled={!!busy} onChange={e=>{const next=events.find(event=>event.slug===e.target.value)!;setSlug(next.slug);setButtonTarget(eventPaymentTargets(next.slug)[0].value);setValue(savedSettings[next.slug]||DEFAULT_EVENT_PAYMENT_SETTINGS);setAmount(String(next.price||100));setUrl("");setError("");setMessage("");}}>{events.map(event=><option key={event.slug} value={event.slug}>{event.name}</option>)}</select></label>}
  <section className="space-y-4 border border-line bg-white p-5">
   <div className="grid gap-6 sm:grid-cols-2">{(["success","failure"] as const).map(kind=>{
    const presets=messagePresets[kind];
    const selected=presets.find(p=>p.title===value[`${kind}Title`]&&p.message===value[`${kind}Message`]&&p.emailSubject===value[`${kind}EmailSubject`]&&p.emailBody===value[`${kind}EmailBody`]);
    return <div key={kind} className="space-y-3"><label className="block text-sm font-semibold">{kind==="success"?"Success message":"Failure message"}<select aria-label={kind==="success"?"Success message":"Failure message"} className={field} value={selected?.id||"custom"} onChange={e=>{const preset=presets.find(p=>p.id===e.target.value);if(preset)setValue(old=>({...old,showPopup:true,[`${kind}Title`]:preset.title,[`${kind}Message`]:preset.message,[`${kind}EmailSubject`]:preset.emailSubject,[`${kind}EmailBody`]:preset.emailBody}));}}>{!selected&&<option value="custom">Existing custom message</option>}{presets.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label><p className="text-sm font-semibold">{value[`${kind}Title`]}</p><p className="whitespace-pre-line text-sm text-muted">{value[`${kind}Message`]}</p><button className="btn btn-outline" type="button" onClick={()=>setPreview(kind==="success"?"success":"failed")}>{kind==="success"?"Preview success":"Preview failure"}</button></div>;
   })}</div>
   <details className="border-t border-line pt-4"><summary className="cursor-pointer text-sm text-muted">Custom messages and email preferences</summary><div className="mt-4 space-y-4">
   <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.showPopup} onChange={e=>update("showPopup",e.target.checked)}/>Show the payment result popup on return</label>
   <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.emailEnabled} onChange={e=>update("emailEnabled",e.target.checked)}/>Email the customer at the address entered during payment</label>
   <div className="grid gap-6 sm:grid-cols-2">{(["success","failure"] as const).map(kind=><div key={kind} className="space-y-3"><h3 className="font-semibold">{kind==="success"?"Successful payment":"Failed payment"}</h3>
    <label className="block text-sm">Popup title<input className={field} maxLength={120} value={value[`${kind}Title`]} onChange={e=>update(`${kind}Title`,e.target.value)}/></label>
    <label className="block text-sm">Popup message<textarea className={field} rows={4} maxLength={1500} value={value[`${kind}Message`]} onChange={e=>update(`${kind}Message`,e.target.value)}/></label>
    <label className="block text-sm">Email subject<input className={field} maxLength={180} value={value[`${kind}EmailSubject`]} onChange={e=>update(`${kind}EmailSubject`,e.target.value)}/></label>
    <label className="block text-sm">Email message<textarea className={field} rows={5} maxLength={4000} value={value[`${kind}EmailBody`]} onChange={e=>update(`${kind}EmailBody`,e.target.value)}/></label>
   </div>)}</div>
   </div></details>
   {embedded ? <p className="text-sm text-muted">Click Save event to save your selected messages.</p> : <button type="button" className="btn btn-accent" disabled={!!busy} onClick={()=>act("save")}>{busy==="save"?"Saving...":"Save payment configuration"}</button>}
  </section>
  <details className="border border-line bg-white p-5"><summary className="cursor-pointer text-sm font-semibold">Payment link settings</summary><div className="mt-4 space-y-4"><p className="text-sm text-muted">Connect each pass to its existing payment button. The customer pays in Razorpay; the website then verifies the result, updates the booking, shows success or failure and emails the address entered in checkout automatically.</p>
   <label className="block text-sm">Existing payment button<select className={field} value={buttonTarget} onChange={e=>setButtonTarget(e.target.value)}>{eventPaymentTargets(slug).map(target=><option key={target.value} value={target.value}>{target.label}</option>)}</select></label>
   <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Pass / payment name<input className={field} value={label} onChange={e=>setLabel(e.target.value)} placeholder={(event?.name||"Event")+" - Dorm pass"}/></label><label className="text-sm">Amount in INR<input className={field} type="number" min={1} max={1000000} step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label></div>
   <label className="block text-sm">Automatic return URL<input className={field} readOnly value={origin+"/events/"+slug} onFocus={e=>e.target.select()}/></label>
   <details className="border border-line bg-background p-3 text-sm"><summary className="cursor-pointer font-semibold">Automatic payment notifications</summary><p className="mt-3 text-sm text-muted">In Razorpay Dashboard, open Accounts &amp; Settings / Checkout Features, enable Collect email from customers, choose Mandatory and save. The customer enters their email inside Razorpay.</p><p className="mt-3 text-sm text-muted">The checkout verifies payments and sends customer email automatically. Add signed webhooks for payment.captured, payment_link.paid and payment.failed so payment updates also arrive if the customer closes the page. Use this server's webhook secret.</p><label className="mt-3 block text-sm">Webhook URL<input className={field} readOnly value={origin+"/api/razorpay/webhook"} onFocus={e=>e.target.select()}/></label>{local&&<p className="mt-2 text-xs text-muted">The local checkout can verify its own result. For background webhook delivery, use UAT or a public development tunnel.</p>}</details>
   <button type="button" className="btn btn-accent" disabled={!!busy||mode==="unconfigured"} onClick={()=>act("create-link")}>{busy==="create-link"?"Creating...":mode==="test"?"Connect test payment button":"Connect payment button"}</button>
   {!!links.filter(link=>link.eventSlug===slug).length&&<div className="space-y-3"><h3 className="font-semibold">Previously generated links</h3>{links.filter(link=>link.eventSlug===slug).map(link=><div className="border border-line bg-background p-3" key={link.url}><p className="text-sm">{link.label} <span className="text-xs text-muted">({link.mode})</span></p><input className={field} readOnly aria-label={link.label+" payment link"} value={link.url} onFocus={e=>e.target.select()}/><a href={link.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-accent underline">Open link</a></div>)}</div>}
   {url&&<div className="border border-line bg-background p-4"><label className="block text-sm">Generated payment link<input className={field} readOnly value={url} onFocus={e=>e.target.select()}/></label><a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-accent underline">Open generated link</a></div>}
  </div></details>
  {message&&<p role="status" className="border border-line bg-white p-4 text-sm">{message}</p>}{error&&<p role="alert" className="border border-accent bg-white p-4 text-sm text-accent">{error}</p>}
  <SuccessDialog open={preview!==null} onClose={()=>setPreview(null)} closeLabel="Close preview"><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Test preview - no payment taken</p><h3 className="font-display text-3xl">{previewCopy.title}</h3><p className="mt-4 whitespace-pre-line leading-7">{previewCopy.message}</p><p className="mt-3 text-xs text-muted">This does not confirm a real payment or booking.</p>{message && <p role="status" className="mt-3 text-sm">{message}</p>}{error && <p role="alert" className="mt-3 text-sm text-accent">{error}</p>}</SuccessDialog>
 </div>;
}
