import { getCottages, getAllEvents } from "@/lib/cms";
import UatPaymentForm from "@/components/forms/uat-payment-form";
export const dynamic = "force-dynamic";
export default async function UatPaymentPage() {
  const [stays,events] = await Promise.all([getCottages(),getAllEvents()]);
  const options = [...stays.map(item => ({type:"stay" as const,slug:item.slug,name:item.name})),...events.map(item => ({type:"event" as const,slug:item.slug,name:item.name}))];
  return <section className="mx-auto max-w-2xl px-5 py-28"><h1 className="font-display text-3xl">UAT payment test</h1><p className="mt-5">Use booking details below to test payment messages and confirmation emails. No money is charged on this testing website.</p><UatPaymentForm options={options} /><a className="mt-8 inline-block underline" href="/">Back to website</a></section>;
}
