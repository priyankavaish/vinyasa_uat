import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import BookingForm from "@/components/booking-form";

export const metadata = { title: "Book | Vinyasa Earth" };

export default function BookPage() {
  return (
    <>
      <PageHero eyebrow="Booking" title="Check availability & confirm your stay" />
      <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <Suspense fallback={<p className="text-sm text-foreground-soft">Loading…</p>}>
          <BookingForm />
        </Suspense>
      </section>
    </>
  );
}
