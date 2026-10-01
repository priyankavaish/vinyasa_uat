import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__work_from_farm_page";
import { getEditorial } from "@/lib/editorial/server";
import Link from "next/link";
import { PageHero } from "@/components/sections/hero";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon, type IconName } from "@/components/ui/icon";
import { whatsappLink } from "@/lib/site";
import AnimateInView from "@/components/ui/animate-in-view";


export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/work-from-farm/page", editorialDefaults)).seo;
}

const findHere: { icon: IconName; text: string }[] = [
  { icon: "wind-outline", text: "Wi-Fi and open shared spaces to work from — no fixed desks or coworking cubicles" },
  { icon: "home-outline", text: "A bed in the community dormitory or a private earthen mudhouse" },
  { icon: "leaf-outline", text: "Community vegetarian meals cooked on the farm" },
  { icon: "sunny-outline", text: "Quiet areas set aside for rest, walking and reading" },
];

const stays = [
  {
    name: "Community Dormitory",
    icon: "people-outline" as IconName,
    rows: [
      { label: "1–14 nights", price: "₹750 / person / night" },
      { label: "15+ nights", price: "₹500 / person / night" },
    ],
  },
  {
    name: "Earthen Mudhouse",
    icon: "home-outline" as IconName,
    rows: [
      { label: "1–6 nights", price: "₹3,500 / night" },
      { label: "7–14 nights", price: "₹2,900 / night" },
      { label: "15+ nights", price: "₹2,100 / night" },
    ],
  },
];

const meals = [
  { label: "Breakfast", price: "₹250" },
  { label: "Lunch", price: "₹500" },
  { label: "Dinner", price: "₹500" },
];

const vinyasaWay = [
  "Wash your own plate after meals and leave shared spaces clean",
  "Use water and electricity mindfully",
  "Support plastic-free living on the campus",
  "Respect quiet time after dinner",
  "The campus is vegetarian and substance-free — no smoking or alcohol",
];

const forWhom = [
  "Remote workers", "Freelancers", "Founders", "Writers", "Artists",
  "Researchers", "Workation seekers", "Community-living enthusiasts",
];

export default async function WorkFromFarmPage() {
  const content = await getEditorial("app/(site)/work-from-farm/page", editorialDefaults);

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow_1}
        title={content.title_2}
        description={content.description_3}
        image={content.image_4} imageAlt={content.imageAlt_5} imagePosition="50% 55%" mobileImagePosition="30% 50%"
      />

      <AnimateInView delay={60}><section className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
        <Reveal variant="fade">
          <SectionEyebrow icon="leaf-outline" className="justify-center">{content.text_6}</SectionEyebrow>
          <p className="mt-4 leading-relaxed text-foreground-soft">{content.text_7}</p>
        </Reveal>
      </section></AnimateInView>

      <AnimateInView delay={80}><section className="organic-section relative overflow-hidden bg-clay-surface py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="up" className="mx-auto mb-10 max-w-2xl text-center">
            <SectionEyebrow icon="compass-outline" className="justify-center">{content.text_8}</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{content.text_9}</h2>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2">
            {content.findHere.map((f) => (
              <li key={f.text} className="flex gap-3 border border-line bg-surface p-5">
                <Icon name={f.icon} size={18} className="mt-0.5 shrink-0 text-accent" />
                <span className="text-sm leading-6 text-foreground-soft">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section></AnimateInView>

      <AnimateInView delay={80}><section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <Reveal variant="up" className="mx-auto mb-10 max-w-2xl text-center">
          <SectionEyebrow icon="home-outline" className="justify-center">{content.text_10}</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{content.text_11}</h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {content.stays.map((s) => (
            <div key={s.name} className="border border-line bg-surface p-6 sm:p-7">
              <div className="flex items-center gap-2 text-accent">
                <Icon name={s.icon} size={16} />
                <p className="text-xs font-bold uppercase tracking-[0.16em]">{s.name}</p>
              </div>
              <dl className="mt-4 divide-y divide-line text-sm">
                {s.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-foreground-soft">{r.label}</dt>
                    <dd className="font-semibold tabular-nums text-foreground">{r.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{content.text_12}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground-soft">
            {content.meals.map((m) => (
              <li key={m.label} className="tabular-nums">
                {m.label} <span className="font-semibold text-foreground">{m.price}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-xs text-muted">{content.text_13}</p>
      </section></AnimateInView>

      <AnimateInView delay={100}><section className="organic-section relative overflow-hidden bg-clay-surface py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="sparkles-outline">{content.text_14}</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{content.text_15}</h2>
            <p className="mt-4 leading-relaxed text-foreground-soft">{content.text_16}</p>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <ul className="space-y-0">
              {vinyasaWay.map((v, i) => (
                <li key={v} className="flex gap-4 border-t border-line py-4 last:border-b">
                  <span className="font-display text-lg leading-none text-accent/60 tabular-nums">{content.text_17}{i + 1}
                  </span>
                  <span className="text-sm leading-6 text-foreground-soft">{v}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section></AnimateInView>

      <AnimateInView delay={80}><section className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
        <Reveal variant="fade">
          <SectionEyebrow icon="people-outline" className="justify-center">{content.text_18}</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{content.text_19}</h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {forWhom.map((w) => (
              <li
                key={w}
                className="rounded-full border border-secondary/25 bg-secondary-surface px-3.5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary-ink"
              >
                {w}
              </li>
            ))}
          </ul>
        </Reveal>
      </section></AnimateInView>

      <AnimateInView delay={80}><section className="organic-section relative overflow-hidden bg-clay-surface py-16 text-center sm:py-20">
        <Reveal variant="up" className="mx-auto max-w-2xl px-5 sm:px-8">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">{content.text_20}</h2>
          <p className="mt-4 leading-relaxed text-foreground-soft">{content.text_21}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={content.href_22} className="btn btn-accent inline-flex">{content.text_23}</Link>
            <a
              href={whatsappLink("Hi Vinyasa Earth, I'd like to book a Work From Farm stay.")}
              className="btn btn-outline inline-flex"
            >{content.text_24}</a>
          </div>
        </Reveal>
      </section></AnimateInView>
    </>
  );
}
