import { loadEventCheckoutLinks } from "@/lib/admin/event-payment-store";
import EventPaymentCheckout from "./event-payment-checkout";
export default async function EventPaymentFlow({eventSlug}:{eventSlug:string}) {
 const links=await loadEventCheckoutLinks(eventSlug);
 return links.length?<EventPaymentCheckout links={links.map(link=>({id:link.id,url:link.url}))}/>:null;
}
