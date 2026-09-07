import { Suspense } from "react";
import { PageHero } from "@/components/sections/hero";
import BookingForm from "@/components/forms/booking-form";
import { getCottages, getEvents } from "@/lib/cms";

export const metadata = {
  title: "Book Your Stay",
  description:
    "Check availability and book a mud cottage stay or creative experience at Vinyasa Earth.",
  alternates: { canonical: "/book" },
};

export const revalidate = 300;

export default async function BookPage() {
  const [cottages, events] = await Promise.all([getCottages(), getEvents()]);

  return (
    <>
      <PageHero eyebrow="Booking" title="Check availability & confirm your stay" image="/images/Vinyasa data (Space)/IMG_9276.jpg" imageAlt="A peaceful earth cottage room ready for a stay at Vinyasa Earth" imagePosition="50% 55%" />
      <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <Suspense fallback={<p className="text-sm text-foreground-soft">Loading…</p>}>
          <BookingForm cottages={cottages} events={events} />
        </Suspense>
      </section>
    </>
  );
}
