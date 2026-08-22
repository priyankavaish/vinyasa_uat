import { PageHero } from "@/components/hero";
import LocationSection from "@/components/location-section";

export const metadata = {
  title: "Contact",
  description: "Contact Vinyasa Earth in Amer, Jaipur about stays, retreats, residencies and offsites.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="We'd love to hear from you" />
      <LocationSection showContactForm />
    </>
  );
}