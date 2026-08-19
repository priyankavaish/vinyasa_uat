import { PageHero } from "@/components/hero";
import LeadForm from "@/components/lead-form";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/site";

export const metadata = { title: "Contact | Vinyasa Earth" };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="We'd love to hear from you" />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-[1fr_1.3fr] sm:px-8">
        <div className="space-y-6 text-sm text-foreground-soft">
          <div>
            <p className="eyebrow">Address</p>
            <p className="mt-2">{ADDRESS}</p>
          </div>
          <div>
            <p className="eyebrow">Email</p>
            <p className="mt-2"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </div>
          <div>
            <p className="eyebrow">Phone / WhatsApp</p>
            <p className="mt-2"><a href={`tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}`}>{CONTACT_PHONE_DISPLAY}</a></p>
          </div>
        </div>
        <div className="border border-line bg-surface p-6">
          <LeadForm source="contact" title="Send a message" />
        </div>
      </section>
    </>
  );
}
