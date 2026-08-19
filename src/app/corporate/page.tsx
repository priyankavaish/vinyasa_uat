import { PageHero } from "@/components/hero";
import LeadForm from "@/components/lead-form";
import { corporateOffering } from "@/lib/content";

export const metadata = { title: "Corporate Offsites | Vinyasa Earth" };

export default function CorporatePage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate Offsites"
        title={corporateOffering.headline}
        description={corporateOffering.description}
        image="/images/property-lawn-gazebo.jpg"
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-[1.3fr_1fr] sm:px-8">
        <div>
          <h2 className="font-display italic text-2xl">What's included</h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground-soft">
            <li className="flex gap-2"><span className="h-1 w-1 mt-2 rounded-full bg-accent shrink-0" /> Full-property buyout options for teams</li>
            <li className="flex gap-2"><span className="h-1 w-1 mt-2 rounded-full bg-accent shrink-0" /> Facilitated team-building sessions</li>
            <li className="flex gap-2"><span className="h-1 w-1 mt-2 rounded-full bg-accent shrink-0" /> Meals sourced from the on-site kitchen garden</li>
          </ul>
          <p className="mt-6 border border-line bg-surface p-4 text-sm text-foreground-soft">
            {corporateOffering.deckNote}
          </p>
        </div>
        <div className="border border-line bg-surface p-6">
          <LeadForm source="corporate" title="Request the Organizer's Deck" submitLabel="Request Deck" />
        </div>
      </section>
    </>
  );
}
