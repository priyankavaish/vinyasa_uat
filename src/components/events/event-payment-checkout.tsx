"use client";
import { useEffect,useRef,useState } from "react";
import SuccessDialog from "@/components/forms/success-dialog";
import FormLoader from "@/components/forms/form-loader";
import { PAYMENT_MESSAGES } from "@/lib/payment-messages";
type PaymentResponse={razorpay_order_id:string;razorpay_payment_id:string;razorpay_signature:string};
type CheckoutInstance={open:()=>void;close:()=>void;on:(event:string,handler:(response:{error?:{metadata?:{payment_id?:string}}})=>void)=>void};
type CheckoutConstructor=new(options:Record<string,unknown>)=>CheckoutInstance;
function checkoutConstructor(){return (window as unknown as {Razorpay?:CheckoutConstructor}).Razorpay;}
let loading:Promise<void>|null=null;
function loadCheckout(){
 if(checkoutConstructor())return Promise.resolve();
 if(!loading)loading=new Promise<void>((resolve,reject)=>{const script=document.createElement("script");script.src="https://checkout.razorpay.com/v1/checkout.js";script.onload=()=>resolve();script.onerror=()=>{loading=null;reject(new Error("Payment checkout could not load."));};document.head.appendChild(script);});
 return loading;
}
export default function EventPaymentCheckout({links}:{links:{id:string;url:string}[]}) {
 const active=useRef(false);const [busy,setBusy]=useState(false);const [loadingLabel,setLoadingLabel]=useState("Opening secure checkout...");const [result,setResult]=useState<{title:string;message:string}|null>(null);
 useEffect(()=>{
  const normalize=(value:string)=>{const url=new URL(value,window.location.origin);return url.origin+url.pathname;};
  async function start(linkId:string) {
   if(active.current)return;active.current=true;setLoadingLabel("Opening secure checkout...");setBusy(true);
   try {
    await loadCheckout();
    const response=await fetch("/api/event-payments/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({linkId})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Payment checkout could not open.");
    const Constructor=checkoutConstructor();if(!Constructor)throw new Error("Payment checkout could not load.");
    let settled=false;let instance:CheckoutInstance;
    async function confirm(paymentId:string,signature?:string) {
     setLoadingLabel("Confirming your payment...");setBusy(true);
     try{const response=await fetch("/api/event-payments/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:data.order.id,paymentId,signature})});const body=await response.json();if(!response.ok||!["success","failed"].includes(body.status))throw Error("pending");if(body.showPopup!==false)setResult(body.copy||PAYMENT_MESSAGES[body.status as "success"|"failed"]);}
     catch{setResult(PAYMENT_MESSAGES.unverified);}finally{setBusy(false);active.current=false;}
    }
    instance=new Constructor({key:data.key,order_id:data.order.id,amount:data.order.amount,currency:data.order.currency,name:"Vinyasa Earth",description:data.label,notes:{vinyasa_event:data.eventSlug},theme:{color:"#8f3b31"},retry:{enabled:false},handler:(payment:PaymentResponse)=>{settled=true;void confirm(payment.razorpay_payment_id,payment.razorpay_signature);},modal:{ondismiss:()=>{if(!settled){active.current=false;setResult(PAYMENT_MESSAGES.cancelled);}}}});
    instance.on("payment.failed",payment=>{if(settled)return;settled=true;instance.close();const id=payment.error?.metadata?.payment_id;if(id)void confirm(id);else{active.current=false;setResult(PAYMENT_MESSAGES.unverified);}});
    setBusy(false);instance.open();
   }catch(error){setResult({title:"Unable to open payment",message:error instanceof Error?error.message:"Please try again."});setBusy(false);active.current=false;}
  }
  const click=(event:MouseEvent)=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const anchor=(event.target as Element)?.closest?.("a[href]");if(!anchor)return;const link=links.find(link=>normalize(link.url)===normalize((anchor as HTMLAnchorElement).href));if(!link)return;event.preventDefault();if(!active.current)void start(link.id);};
  document.addEventListener("click",click,true);return()=>document.removeEventListener("click",click,true);
 },[links]);
 return <><FormLoader active={busy} label={loadingLabel}/><SuccessDialog open={!!result} onClose={()=>setResult(null)} closeLabel="Close"><h3 className="font-display text-3xl">{result?.title}</h3><p className="mt-4 whitespace-pre-line leading-7">{result?.message}</p></SuccessDialog></>;
}
