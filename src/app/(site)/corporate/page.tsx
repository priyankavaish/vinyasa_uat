
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__corporate_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/hero";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { Icon } from "@/components/ui/icon";
import LeadForm from "@/components/forms/lead-form";
import { volunteerTracks, volunteerInfo } from "@/lib/content";

import sideImg from "@/app/assets/new/grounds-07.jpg";
import communityImg from "@/app/assets/new/community-05.jpg";
import styles from "./volunteer.module.css";

export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/corporate/page", editorialDefaults)).seo;
}

export default async function VolunteerPage() {
  const content = await getEditorial("app/(site)/corporate/page", editorialDefaults);

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={content.eyebrow_1}
        title={content.title_2}
        description={content.description_3}
        image={content.image_4} imageAlt={content.imageAlt_5} imagePosition="50% 55%" mobileImagePosition="65% 50%"
      />

      <AnimateInView delay={60}><section className="mx-auto max-w-3xl px-5 py-10 text-center sm:px-8">
        <Reveal variant="fade">
          <SectionEyebrow icon="leaf-outline" className="justify-center">{content.text_6}</SectionEyebrow>
          <p className="mt-4 leading-relaxed text-foreground-soft">
            {content.volunteerInfo.note}
          </p>
        </Reveal>
      </section></AnimateInView>

      <div className={styles.availability}>{content.text_7}<span aria-hidden="true">·</span>{content.text_8}<a href={content.href_9}>{content.text_10}</a></div>
      <SectionWave from="#f3f1ea" to="#f3e6d8" variant="wave" />
      <AnimateInView delay={80}><section className="organic-section relative overflow-hidden bg-clay-surface py-16 sm:py-20">
        <Parallax
          speed={0.04}
          className="pointer-events-none absolute -left-24 bottom-0 hidden w-[20rem] opacity-[0.12] sm:block"
          aria-hidden="true"
        >
          <Image src={content.sideImg} alt="" className="w-full rounded-full" />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="left" className="mx-auto mb-12 max-w-2xl text-center">
            <SectionEyebrow icon="people-outline" className="justify-center">{content.text_11}</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.text_12}</h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {content.volunteerTracks.map((track, i) => (
              <Reveal key={track.slug} variant="up" delay={i * 100} className="h-full">
                <div className={styles.track}>
                  <span className={styles.number}>{content.text_17}{i + 1} / {i === 0 ? content.text_13 : content.text_14}</span>
                  <h3 className="font-display italic text-2xl leading-tight text-foreground">
                    {track.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-foreground-soft">{i === 0 ? track.description : content.text_15}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
                    <div>
                      <dt className="text-[12px] font-bold uppercase tracking-[0.16em] text-muted">{content.text_21}</dt>
                      <dd className="mt-1 text-foreground">{track.commitment}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] font-bold uppercase tracking-[0.16em] text-muted">{content.text_22}</dt>
                      <dd className="mt-1 text-foreground">{i === 0 ? track.compensation : content.text_16}</dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-accent">{content.text_24}</p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground-soft">
                    {track.roles.map((role) => (
                      <li key={role} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section></AnimateInView>

      <SectionWave from="#f3e6d8" to="#f3f1ea" variant="arch" />
      <AnimateInView delay={80}><section className={styles.life}>
        <div className={styles.photo}><Image src={content.communityImg} alt={content.alt_25} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /></div>
        <div>
          <SectionEyebrow icon="leaf-outline">{content.text_26}</SectionEyebrow>
          <h2>{content.text_27}<br />{content.text_28}</h2>
          <p>{content.text_29}</p>
          <div className={styles.roles}><span>{content.text_30}</span><span>{content.text_31}</span><span>{content.text_32}</span><span>{content.text_33}</span></div>
        </div>
      </section></AnimateInView>
      <AnimateInView delay={100}><section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="home-outline">{content.text_34}</SectionEyebrow>
            <ul className="mt-5 space-y-3 text-sm text-foreground-soft">
              {content.volunteerInfo.benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="leaf-outline" size={16} className="mt-0.5 shrink-0 text-secondary" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <SectionEyebrow icon="compass-outline">{content.text_35}</SectionEyebrow>
            <ul className="mt-5 space-y-3 text-sm text-foreground-soft">
              {content.volunteerInfo.requirements.map((r) => (
                <li key={r} className="flex gap-3">
                  <Icon name="circle-outline" size={16} className="mt-0.5 shrink-0 text-accent" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section></AnimateInView>

      <AnimateInView delay={80}><section className={styles.promises}>
        <SectionEyebrow icon="home-outline">{content.text_36}</SectionEyebrow>
        <h2>{content.text_37}</h2>
        <p>{content.text_38}</p>
      </section></AnimateInView>
      <AnimateInView delay={80}><section className={styles.faq}>
        <SectionEyebrow icon="compass-outline">{content.text_39}</SectionEyebrow>
        <h2>{content.text_40}</h2>
        {content.list_1.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
      </section></AnimateInView>
      <SectionWave from="#f3f1ea" to="#e7ebdd" variant="slant" />
      <AnimateInView delay={100}><section id="apply" className="organic-section relative scroll-mt-24 overflow-hidden bg-dusk-surface py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="ribbon-outline">{content.text_41}</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.text_42}</h2>
            <p className="mt-4 leading-relaxed text-foreground-soft">{content.text_43}{" "}
              <a href={content.href_44} className="text-accent underline">{content.text_45}</a>
              .
            </p>
            <p className="mt-6 border border-line bg-surface p-4 text-sm text-foreground-soft">{content.text_46}{" "}
              <Link href={content.href_47} className="text-accent underline">{content.text_48}</Link>
              .
            </p>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="border border-line bg-surface p-6 sm:p-8">
              <LeadForm
                source="volunteer"
                title={content.title_49}
                submitLabel={content.submitLabel_50}
              />
            </div>
          </Reveal>
        </div>
      </section></AnimateInView>
      <SectionWave from="#e7ebdd" to="#f3f1ea" variant="wave" />
    </div>
  );
}
