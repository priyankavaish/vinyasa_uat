import { PageHero } from "@/components/hero";
import BougainvilleaCanopy from "@/components/bougainvillea-canopy";

export const metadata = { title: "About", description: "Discover the story and earth-first philosophy behind Vinyasa Earth in Amer, Jaipur.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Live, create, belong"
        description="Vinyasa Earth is an art residential space in Amer, Jaipur: six hand-built mud cottages set around a community of resident artists, retreat guests, and visiting teams."
        image="/images/amer-fort-lake.jpg"
      />
      <section className="mx-auto max-w-3xl px-5 py-16 text-foreground-soft leading-relaxed sm:px-8">
        <p>
          Built from the earth it sits on, Vinyasa Earth was created as a safe, non-judgmental space for
          self-discovery and creativity, somewhere between an artist residency, a retreat center, and a home.
          (Placeholder: full founding story to be confirmed with the client.)
        </p>
        <p className="mt-5">
          Today the property hosts the Artist Escape Program, seasonal retreats, workshops, and corporate
          offsites, alongside its six resident cottages.
        </p>
      </section>

      <BougainvilleaCanopy />

      <section className="mx-auto max-w-3xl px-5 py-16 text-foreground-soft leading-relaxed sm:px-8">
        <p>
          Rajasthan's own heritage runs through the property: mud plaster and jaali screens instead of
          concrete, kitchen-garden meals instead of a restaurant menu, block-print textiles and hand-painted
          mandalas on the cottage walls. It's a working example of the sustainable, earth-first living the
          community here practices daily.
        </p>
      </section>
    </>
  );
}
