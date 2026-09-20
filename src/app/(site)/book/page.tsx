
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__book_page";
import { getEditorial } from "@/lib/editorial/server";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/hero";
import BookingForm from "@/components/forms/booking-form";
import { getCottages, getEvents } from "@/lib/cms";

export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/book/page", editorialDefaults)).seo;
}

export const revalidate = 300;

export default async function BookPage() {
  const content = await getEditorial("app/(site)/book/page", editorialDefaults);

  const [cottages, events] = await Promise.all([getCottages(), getEvents()]);

  return (
    <>
      <PageHero eyebrow={content.eyebrow_1} title={content.title_2} image={content.image_3} imageAlt={content.imageAlt_4} imagePosition="50% 55%" />
      <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <Suspense fallback={<p className="text-sm text-foreground-soft">{"Loading…"}</p>}>
          <BookingForm cottages={cottages} events={events} />
        </Suspense>
      </section>
    </>
  );
}
