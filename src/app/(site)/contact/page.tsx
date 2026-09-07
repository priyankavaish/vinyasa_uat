import { PageHero } from "@/components/sections/hero";
import LocationSection from "@/components/sections/location-section";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon, type IconName } from "@/components/ui/icon";
import { getContent } from "@/lib/cms";


export const revalidate = 300;

type Hero = { eyebrow?: string; title?: string; description?: string };
type Service = { icon: string; title: string; body: string };
type Faq = { q: string; a: string };

export const metadata = {
  title: "Contact",
  description:
    "Contact Vinyasa Earth in Amer, Jaipur about stays, retreats, residencies, venue hire and volunteering. Phone +91 77376 07227, vinyasa.ashram@gmail.com.",
  alternates: { canonical: "/contact" },
};

const SERVICES_FALLBACK: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "leaf-outline",
    title: "Retreats",
    body: "Wellness, art, and corporate retreats with eco-lodging in the mud cottages.",
  },
  {
    icon: "camera-outline",
    title: "Venue hire",
    body: "Workshops, events, and creative shoots across the cottages and the amphitheatre.",
  },
  {
    icon: "ribbon-outline",
    title: "Brand partnerships",
    body: "Collaborations aligned with sustainability and wellness values.",
  },
  {
    icon: "sunny-outline",
    title: "Day experiences",
    body: "Non-overnight visits with lunch and a guided tour of the land.",
  },
];

const FAQ_FALLBACK = [
  {
    q: "How do I get there?",
    a: "The farm is road-accessible from Jaipur. An Uber or cab straight to the gate is the easiest way in.",
  },
  {
    q: "What are the stay options?",
    a: "Six themed mud cottages, a shared dorm, and tent stays, depending on the season.",
  },
  {
    q: "Are meals included?",
    a: "Vegetarian meals are included with retreat and residency packages, and available to add for other stays.",
  },
  {
    q: "Can I visit for the day?",
    a: "Yes — without an overnight booking, through an event or a day pass with lunch and a tour.",
  },
  {
    q: "How can I pay?",
    a: "Credit and debit cards, UPI, and bank transfers are all accepted.",
  },
  {
    q: "Can I bring my pet?",
    a: "Pets are generally welcome, with the owner responsible for them on the land.",
  },
];

export default async function ContactPage() {
  const [hero, servicesRaw, faqRaw] = await Promise.all([
    getContent<Hero>("contact.hero"),
    getContent<Service[]>("contact.services"),
    getContent<Faq[]>("contact.faq"),
  ]);
  const SERVICES = (Array.isArray(servicesRaw) && servicesRaw.length
    ? servicesRaw
    : SERVICES_FALLBACK) as Array<{ icon: IconName; title: string; body: string }>;
  const FAQ = Array.isArray(faqRaw) && faqRaw.length ? faqRaw : FAQ_FALLBACK;

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Get in touch"}
        title={hero?.title ?? "We'd love to hear from you"}
        description={
          hero?.description ??
          "Questions about a stay, a retreat, venue hire, or volunteering — send a note and the team will write back."
        }
        image="/images/Vinyasa data (Space)/IMG_9265.jpg" imageAlt="A garden path between the earth cottages at Vinyasa Earth" imagePosition="50% 55%" mobileImagePosition="65% 50%"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="sparkles-outline" className="justify-center">
            What we can help with
          </SectionEyebrow>
          <h2 className="mt-3 font-display italic text-4xl leading-tight">
            Tell us why you&apos;re writing
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} variant="up" delay={(i % 4) * 80}>
              <div className="flex h-full flex-col border border-line bg-surface px-6 py-7">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-accent/40 text-accent">
                  <Icon name={s.icon} size={19} />
                </span>
                <h3 className="mt-4 font-display italic text-xl leading-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-soft">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <LocationSection showContactForm />

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <Reveal variant="fade" className="text-center">
          <SectionEyebrow icon="compass-outline" className="justify-center">
            Good to know
          </SectionEyebrow>
          <h2 className="mt-3 font-display italic text-4xl leading-tight">Common questions</h2>
        </Reveal>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} variant="up" delay={(i % 3) * 70}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display italic text-lg text-foreground">
                  {item.q}
                  <Icon
                    name="arrow-forward-outline"
                    size={16}
                    className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-90"
                  />
                </summary>
                <p className="mt-3 text-sm leading-6 text-foreground-soft">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
