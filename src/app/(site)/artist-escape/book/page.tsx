import { Suspense } from "react";
import ArtistEscapeBookingForm from "@/components/forms/artist-escape-booking-form";
export const dynamic="force-dynamic";
export const metadata={title:"Book your Artist Escape",robots:{index:false,follow:false},referrer:"no-referrer"};
export default function Page(){return <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-32"><h1 className="font-display text-4xl italic">Your Artist Escape</h1><p className="mb-8 mt-3 text-foreground-soft">Review your stay and confirm your Artist Escape booking.</p><Suspense fallback={<p>Loading your application...</p>}><ArtistEscapeBookingForm/></Suspense></main>;}
