import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/cms";
import { PageHero } from "@/components/sections/hero";
import BookingForm from "@/components/forms/booking-form";
export const dynamic = "force-dynamic";
export const metadata = { title: "Book your event", robots: { index: false, follow: true } };
export default async function EventBookingPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const event = await getEvent(slug);
 if (!event) notFound();
 return <><PageHero eyebrow="Event booking" title={event.name} description="Prices exclude GST. 18% GST is added at checkout." image={event.image || undefined} imageAlt={event.name} /><section className="mx-auto max-w-2xl px-5 py-16 sm:px-8"><Suspense fallback={<p>Loading...</p>}><BookingForm mode="event" events={[event]} cottages={[]} /></Suspense></section></>;
}
