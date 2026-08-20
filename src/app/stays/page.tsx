import { PageHero } from "@/components/hero";
import CottageCard from "@/components/cottage-card";
import { cottages } from "@/lib/content";

export const metadata = { title: "Mud Cottage Stays", description: "Stay in one of six hand-built, artist-designed mud cottages at Vinyasa Earth in Amer, Jaipur.", alternates: { canonical: "/stays" } };

export default function StaysPage() {
  return (
    <>
      <PageHero
        eyebrow="Mud-house cottages"
        title="Six rooms built from the earth beneath them"
        description="Each cottage is hand-plastered and thematically decorated by resident artists. Pick one below, or check availability directly."
        image="/images/property-cottages-day.jpg"
      />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {cottages.map((c, i) => (
            <CottageCard key={c.slug} cottage={c} featured={i === 0} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
