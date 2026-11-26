"use client";
import { useCallback,useEffect,useMemo,useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import StayDateRange from "./stay-date-range";
import SuccessDialog from "./success-dialog";
import TermsDialog from "./terms-dialog";
import { formatArtistDate } from "@/lib/artist-escape-programme";
import { artistEscapeQuote } from "@/lib/artist-escape-plans";
import { defaults as terms } from "@/lib/editorial/defaults/components_forms_booking_form";
import type { artistBookingView,ArtistMail } from "@/lib/artist-escape-booking";
import type { Booking } from "@/lib/store";
type View=Awaited<ReturnType<typeof artistBookingView>> & {confirmationEmail:ArtistMail|null};
type Order={id:string;amount:number;currency:string;mock:boolean};
const RUPEE = "\u20b9";
const money=(n:number)=>n.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const field="mt-2 w-full border border-line bg-background px-4 py-3 text-sm";
export default function ArtistEscapeBookingForm(){
 const token=useSearchParams().get("token")||"";
 const [view,setView]=useState<View|null>(null),[error,setError]=useState("");
 const fixed = view?.programmeStay;
 const dorm = view?.dorms.find((item) => item.slug === "dorm")?.slug ?? "";
 const [checkIn,setIn]=useState(""),[checkOut,setOut]=useState("");
 const [accepted,setAccepted]=useState(false),[busy,setBusy]=useState(false),[closed,setClosed]=useState(false);
 const [mock,setMock]=useState<{booking:Booking;order:Order}|null>(null),[termsOpen,setTermsOpen]=useState<"way"|"policy"|null>(null);
 const load=useCallback(async()=>{if(!token)throw Error("Open the booking link in your approval email to continue.");const r=await fetch('/api/artist-escape/booking?token='+encodeURIComponent(token),{cache:'no-store'});const data=await r.json();if(!r.ok)throw Error(data.error);setView(data);return data as View;},[token]);
 useEffect(()=>{load().catch(e=>setError(e.message));},[load]);
 useEffect(()=>{const timer=setInterval(()=>load().catch(()=>{}),30000);return()=>clearInterval(timer);},[load]);
 const unavailable=useMemo(()=>new Set(Object.entries(view?.availability[dorm]||{}).filter(([,n])=>n===0||n===null).map(([date])=>date)),[view,dorm]);
 const [manualPlan, setManualPlan] = useState<string | null>(null);
 const nights = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000;
 const selectedPlan = view?.plans.find(({ min, max }) => nights >= min && nights <= max);
 const plan = manualPlan ?? selectedPlan?.id;
 let quote: ReturnType<typeof artistEscapeQuote> | null = null;
 let quoteError = "";
 if (checkIn && checkOut) {
   if (!plan) quoteError = "Choose a stay between 1 and 366 nights.";
   else {
     try {
       quote = artistEscapeQuote(plan, checkIn, checkOut);
     } catch (error) {
       quoteError = error instanceof Error ? error.message : "Choose valid dates.";
     }
   }
 }
 async function post(body:Record<string,unknown>){const r=await fetch('/api/artist-escape/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,...body})});const data=await r.json();if(!r.ok)throw Error(data.error);return data;}
 async function verify(booking:Booking,order:Order,payment:{razorpay_order_id:string;razorpay_payment_id:string;razorpay_signature:string}){setBusy(true);setError('');try{await post({action:'verify',bookingId:booking.id,orderId:payment.razorpay_order_id,paymentId:payment.razorpay_payment_id,signature:payment.razorpay_signature});setMock(null);await load();}catch(e){setError((e instanceof Error?e.message:'Payment verification failed')+' If payment was deducted, contact our team before paying again.');}finally{setBusy(false);}}
 async function cancel(id:string){setBusy(true);try{await post({action:'cancel',bookingId:id});setMock(null);await load();}catch(e){setError(e instanceof Error?e.message:'Could not release hold');}finally{setBusy(false);}}
 async function checkout(resume=false){setBusy(true);setError('');try{const b=view?.booking;const saved=view?.quote;const data=await post({action:'reserve',dormSlug:fixed?"dorm":resume?b?.itemSlug:dorm,planId:fixed?"programme":resume?saved?.planId:plan,checkIn:fixed?.arrival??(resume?b?.checkIn:checkIn),checkOut:fixed?.checkout??(resume?b?.checkOut:checkOut),accepted:resume?true:accepted});await load();if(data.order.mock){setMock(data);setBusy(false);return;}
 if(!window.Razorpay)throw Error('Razorpay checkout is still loading. Resume payment in a moment.');
 let checkoutPhase='waiting';
 const rzp=new window.Razorpay({key:view?.paymentKey,amount:data.order.amount,currency:data.order.currency,order_id:data.order.id,name:'Vinyasa Earth',description:'Artist Escape - dorm stay',prefill:{name:view?.name,email:view?.email,contact:view?.phone},theme:{color:'#8f3b31'},handler:(payment:{razorpay_order_id:string;razorpay_payment_id:string;razorpay_signature:string})=>{checkoutPhase='verifying';void verify(data.booking,data.order,payment);},modal:{ondismiss:()=>{if(checkoutPhase!=='waiting')return;setBusy(false);setError('Payment was not completed. Your temporary bed hold remains available until its expiry.');}},retry:{enabled:false}});
 rzp.on('payment.failed',()=>{if(checkoutPhase!=='waiting')return;checkoutPhase='failed';rzp.close();setBusy(false);setError('Payment failed. Your booking is not confirmed. Retry or cancel your bed hold below.');});rzp.open();
 }catch(e){setError(e instanceof Error?e.message:'Could not start checkout');setBusy(false);}}
 const booking=view?.booking;const confirmed=booking?.status==='paid';
 const summary=confirmed&&booking&&<><h2 className="font-display text-3xl italic">Thank you! Your Artist Escape booking is confirmed.</h2><p className="mt-3">We look forward to welcoming you, {view?.name}.</p><dl className="mt-5 space-y-2 text-sm"><div>Dorm: {view?.quote?.dormName} - 1 bed</div><div>Plan: {view?.quote?.planName}</div><div>Check-in: {booking.checkIn} - Check-out: {booking.checkOut}</div>{!fixed && <div>{view?.quote?.nights} nights - Base {RUPEE}{money(view?.quote?.baseAmount||0)} + 5% GST {RUPEE}{money(view?.quote?.gstAmount||0)}</div>}<div className="font-semibold">Paid online: {RUPEE}{money(booking.amount)}</div>{fixed && <div>Balance due on arrival: {RUPEE}{money(fixed.price.dueOnArrival)}</div>}<div className="break-all">Booking reference: {booking.id}</div></dl><p className="mt-4 text-sm">{view?.confirmationEmail?.state==='sent'?`Booking confirmation emailed to ${view.email}.`:view?.confirmationEmail?.state==='preview'?'Confirmation email saved in the local preview outbox.':'Your booking is confirmed. Confirmation email delivery is pending; the team can retry from Admin > Bookings.'}</p></>;
 return <><Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload"/>{error&&<p role="alert" className="mb-5 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}{!view&&!error&&<p>Loading your approved application...</p>}{confirmed?<><SuccessDialog open={!closed} onClose={()=>setClosed(true)}>{summary}</SuccessDialog><section className="border border-line bg-surface p-6 sm:p-9">{summary}</section></>:view&&booking?.status==='pending'?<section className="space-y-4 border border-line bg-surface p-6"><h2 className="font-display text-2xl italic">Your dorm bed is temporarily held</h2><p>{booking.checkIn} to {booking.checkOut} - {view.quote?.planName}</p><p>{fixed ? "One-day payment including GST" : "Total including GST"}: {RUPEE}{money(booking.amount)}</p>{fixed && <p>Balance due on arrival: {RUPEE}{money(fixed.price.dueOnArrival)}</p>}<p className="text-sm">Complete payment before {new Date(Date.parse(booking.createdAt)+20*60000).toLocaleString()}. After that, the bed is released.</p><button disabled={busy} className="btn btn-accent" onClick={()=>checkout(true)}>Resume payment</button><button disabled={busy} className="btn btn-outline ml-3" onClick={()=>cancel(booking.id)}>{fixed ? "Cancel this payment attempt" : "Cancel hold / change dates"}</button></section>:
view && fixed ? (
  <form className="space-y-5 border border-line bg-surface p-6 sm:p-9" onSubmit={event => { event.preventDefault(); void checkout(); }}>
    <h2 className="font-display text-2xl italic">Your approved dorm stay</h2>
    <p>Welcome, <strong>{view.name}</strong>. Your stay includes a shared dorm bed and three meals daily.</p>
    <dl className="space-y-2 text-sm">
      <div>Arrival: {formatArtistDate(fixed.arrival)}</div>
      <div>Checkout: {formatArtistDate(fixed.checkout)}</div>
      <div>Duration: {fixed.price.planName} ({fixed.price.nights} nights)</div>
    </dl>
    <dl className="space-y-2 border border-line bg-background p-4 text-sm">
      <div className="flex justify-between gap-3"><dt>Total stay including GST</dt><dd>{RUPEE}{money(fixed.price.totalAmount)}</dd></div>
      <div className="flex justify-between gap-3 font-semibold"><dt>Pay online now (1 day, including GST)</dt><dd>{RUPEE}{money(fixed.price.deposit.totalAmount)}</dd></div>
      <div className="flex justify-between gap-3"><dt>Balance due on arrival</dt><dd>{RUPEE}{money(fixed.price.dueOnArrival)}</dd></div>
    </dl>
    <p className="text-sm">Read our <button type="button" onClick={() => setTermsOpen("way")} className="text-accent underline">Way of Living</button> and <button type="button" onClick={() => setTermsOpen("policy")} className="text-accent underline">booking and cancellation terms</button>.</p>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} required className="mt-1" /><span>I accept the community guidelines and booking terms.</span></label>
    <button type="submit" disabled={busy || !accepted} className="btn btn-accent w-full disabled:opacity-50">Pay {RUPEE}{money(fixed.price.deposit.totalAmount)} and confirm</button>
  </form>
) :
view&&<form className="space-y-6 border border-line bg-surface p-6 sm:p-9" onSubmit={e=>{e.preventDefault();void checkout();}}><p>Welcome, <strong>{view.name}</strong>. Your application is approved for one person and one dorm bed, with three meals daily.</p><label className="block text-sm">Dorm<select disabled className={field + " cursor-not-allowed"} value={dorm}><option value="">Dorm unavailable</option>{view.dorms.map(d=><option key={d.slug} value={d.slug}>{d.name} - shared dorm bed</option>)}</select></label><fieldset><legend className="mb-3 text-sm">Select your stay plan</legend><div className="grid gap-3 sm:grid-cols-2">{view.plans.map(p=><label key={p.id} className={'cursor-pointer border p-4 '+(plan===p.id?'border-accent bg-background':'border-line')}><input type="radio" name="plan" value={p.id} checked={plan===p.id} onChange={()=>setManualPlan(p.id)}/><strong className="ml-2">{p.name}</strong><p className="mt-2 text-sm">{p.description}</p><p className="mt-2">{RUPEE}{p.rate}/night + 5% GST</p></label>)}</div></fieldset>{dorm&&<StayDateRange checkIn={checkIn} checkOut={checkOut} unavailable={unavailable} minDate={view.today} onChange={(a,b)=>{setIn(a);setOut(b);if (a && b && (a !== checkIn || b !== checkOut)) setManualPlan(null);}} checkInLabel="Check-in" checkOutLabel="Check-out"/>}<p role="status" className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">{quote ? quote.nights + (quote.nights === 1 ? " night selected. " : " nights selected. ") + quote.planName + (manualPlan ? " is selected. " : " has been applied automatically. ") : !checkIn || !checkOut ? "Choose your plan or select dates to apply a plan automatically. " : ""}Creative stay applies to 1–14 nights and Extended creative stay applies to 15–366 nights.</p>{quoteError&&<p role="alert" className="text-sm text-red-700">{quoteError}</p>}{quote&&<div className="space-y-3 border border-line bg-background p-5 text-sm"><p className="flex justify-between"><span>{quote.nights} nights {"\u00d7"} {RUPEE}{quote.rate}</span><span>{RUPEE}{money(quote.baseAmount)}</span></p><p className="flex justify-between"><span>GST (5%)</span><span>{RUPEE}{money(quote.gstAmount)}</span></p><p className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><span>Total payable</span><span>{RUPEE}{money(quote.totalAmount)}</span></p></div>}<p className="text-sm">Read our <button type="button" onClick={()=>setTermsOpen('way')} className="text-accent underline">Way of Living</button> and <button type="button" onClick={()=>setTermsOpen('policy')} className="text-accent underline">booking and cancellation terms</button>.</p><label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} required className="mt-1"/><span>I accept the community guidelines and booking terms. I am booking one dorm bed for myself.</span></label><button disabled={busy||!quote||!dorm||!accepted} className="btn btn-accent w-full disabled:opacity-50">{busy?'Processing...':quote?`Pay ${RUPEE}${money(quote.totalAmount)} & confirm`:'Select your dates'}</button></form>}
 <TermsDialog open={!!termsOpen} onClose={()=>setTermsOpen(null)}><h2 className="font-display text-2xl">{termsOpen==='way'?terms.wayTitle:terms.policyTitle}</h2>{(termsOpen==='way'?terms.wayItems:terms.policyItems).map(([title,text])=><div key={title} className="mt-4"><strong>{title}</strong><p className="text-sm">{text}</p></div>)}</TermsDialog>
 <SuccessDialog open={!!mock} onClose={()=>setMock(null)}><h2 className="font-display text-2xl">Test payment</h2><p className="mt-3 text-sm">No live Razorpay charge. Online payment including GST: {RUPEE}{money((mock?.order.amount||0)/100)}.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn btn-accent" disabled={busy} onClick={()=>{if(mock)void verify(mock.booking,mock.order,{razorpay_order_id:mock.order.id,razorpay_payment_id:'pay_mock_artist_'+Date.now(),razorpay_signature:'mock'});}}>Simulate successful payment</button><button className="btn btn-outline" disabled={busy} onClick={()=>{if(mock)void cancel(mock.booking.id);}}>Simulate failed payment</button></div></SuccessDialog>
 </>;
}
