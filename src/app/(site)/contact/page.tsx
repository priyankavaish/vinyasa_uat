import { pageSeoMetadata } from "@/lib/editorial/seo";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__contact_page";
import { getEditorial } from "@/lib/editorial/server";
import LocationSection from "@/components/sections/location-section";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon, type IconName } from "@/components/ui/icon";
import { getContent } from "@/lib/cms";


export const revalidate = 300;

type Hero = { eyebrow?: string; title?: string; description?: string };
type Service = { icon: string; title: string; body: string };
type Faq = { q: string; a: string };

export async function generateMetadata(): Promise<import("next").Metadata> {
  return pageSeoMetadata((await getEditorial("app/(site)/contact/page", editorialDefaults)).seo, editorialDefaults.seo);
}

const SERVICES_FALLBACK: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "leaf-outline",
    title: "Retreats",
    body: "Wellness, art, and corporate retreats with eco-lodging in the mudhouses.",
  },
  {
    icon: "camera-outline",
    title: "Venue hire",
    body: "Workshops, events, and creative shoots across the mudhouses and the amphitheatre.",
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
    a: "Six themed mudhouses, a shared dorm, and tent stays, depending on the season.",
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
  const content = await getEditorial("app/(site)/contact/page", editorialDefaults);

  const SERVICES = content.SERVICES_FALLBACK;
  const FAQ = content.FAQ_FALLBACK;

  return (
    <div>
      <section className="texture-linen relative overflow-hidden bg-clay-surface px-5 pb-4 pt-24 text-center sm:px-8 sm:pt-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 text-surface sm:h-32"
        >
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full">
            <path
              fill="currentColor"
              d="M0 0 H1440 V54 C 1160 118 880 26 560 74 C 360 104 150 90 0 100 Z"
            />
          </svg>
        </span>
        <div className="relative z-10 mx-auto max-w-2xl">
          <SectionEyebrow icon="sparkles-outline" className="justify-center">
            {content.text_1}
          </SectionEyebrow>
          <h1 className="mt-2 font-display text-3xl italic leading-tight text-clay-ink sm:text-4xl">
            {content.text_2}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground-soft sm:text-base">
            {content.text_3}
          </p>
        </div>
      </section>

      <AnimateInView delay={60}><LocationSection showContactForm /></AnimateInView>

      <SectionWave from="#f3e6d8" to="#f3f1ea" variant="wave" />
      <AnimateInView delay={80}><section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="sparkles-outline" className="justify-center">{content.text_4}</SectionEyebrow>
          <h2 className="mt-3 font-display italic text-3xl leading-tight sm:text-4xl">{content.text_5}</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      </section></AnimateInView>

      <AnimateInView delay={80}><section className="mx-auto max-w-3xl px-5 pb-16 pt-2 sm:px-8">
        <Reveal variant="fade" className="text-center">
          <SectionEyebrow icon="compass-outline" className="justify-center">{content.text_6}</SectionEyebrow>
          <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.text_7}</h2>
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
      </section></AnimateInView>
    </div>
  );
}
