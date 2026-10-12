
import FormattedText from "@/components/editorial/formatted-text";
import { pageSeoMetadata } from "@/lib/editorial/seo";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__corporate_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import LeadForm from "@/components/forms/lead-form";
import GalleryCarouselGrid from "@/components/ui/gallery-carousel-grid";
import { volunteerTracks, volunteerInfo } from "@/lib/content";

import communityImg from "@/app/assets/new/community-05.jpg";
import styles from "./volunteer.module.css";

export async function generateMetadata(): Promise<import("next").Metadata> {
  return pageSeoMetadata((await getEditorial("app/(site)/corporate/page", editorialDefaults)).seo, editorialDefaults.seo);
}

export default async function VolunteerPage() {
  const content = await getEditorial("app/(site)/corporate/page", editorialDefaults);

  return (
    <div className={styles.page}>
      <style>{`:root { --wave-lead: #e7ebdd; }`}</style>
      <section className="texture-linen bg-clay-surface px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-8 sm:grid-cols-[1fr_1.2fr] sm:gap-10">
            <div>
              <SectionEyebrow icon="people-outline"><FormattedText value={content.eyebrow_1} /></SectionEyebrow>
              <h1 className="mt-3 font-display text-4xl italic leading-tight text-clay-ink sm:text-5xl"><FormattedText value={content.title_2} /></h1>
              <p className="mt-4 max-w-md leading-relaxed text-foreground-soft"><FormattedText value={content.description_3} /></p>
              <span aria-hidden="true" className="mt-6 block h-[3px] w-16 rounded-full bg-accent" />
            </div>
            <div className="sm:-mt-4">
              <GalleryCarouselGrid
                images={content.galleryImages}
                alt="Volunteers and residents at Vinyasa Earth"
              />
            </div>
          </div>

          <div className={`${styles.availability} ${styles.availabilityInline}`}><FormattedText value={content.text_7} /><span aria-hidden="true">·</span><FormattedText value={content.text_8} /><a href={content.href_9} className="btn btn-accent"><FormattedText value={content.text_10} links={false} /></a></div>
        </div>
      </section>
      <SectionWave from="#f3e6d8" to="#f3f1ea" variant="wave" />

      <AnimateInView delay={60}><section className="mx-auto max-w-3xl px-5 py-10 text-center sm:px-8">
        <Reveal variant="fade">
          <SectionEyebrow icon="leaf-outline" className="justify-center"><FormattedText value={content.text_6} /></SectionEyebrow>
          <p className="mt-4 leading-relaxed text-foreground-soft">
            <FormattedText value={content.volunteerInfo.note} />
          </p>
        </Reveal>
      </section></AnimateInView>
      <SectionWave from="#f3f1ea" to="#f3e6d8" variant="wave" />
      <AnimateInView delay={80}><section className="organic-section relative overflow-hidden bg-clay-surface py-16 sm:py-20">
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="left" className="mx-auto mb-12 max-w-2xl text-center">
            <SectionEyebrow icon="people-outline" className="justify-center"><FormattedText value={content.text_11} /></SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.text_12} /></h2>
          </Reveal>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            {content.volunteerTracks.map((rawTrack, i) => {
              const fallback = volunteerTracks.find((t) => t.slug === rawTrack.slug);
              const track = { ...rawTrack, summary: rawTrack.summary ?? fallback?.summary, cta: rawTrack.cta ?? fallback?.cta, ctaHref: rawTrack.ctaHref ?? fallback?.ctaHref };
              return (
              <Reveal key={track.slug} variant="up" delay={i * 100}>
                <div className={styles.track}>
                  <span className={styles.number}><FormattedText value={content.text_17} />{i + 1} / <FormattedText value={i === 0 ? content.text_13 : content.text_14} /></span>
                  <h3 className="font-display italic text-2xl leading-tight text-foreground">
                    <FormattedText value={track.name} />
                  </h3>
                  {track.summary && <p className="mt-2 text-sm font-semibold text-accent"><FormattedText value={track.summary} links={false} /></p>}
                  <p className="mt-3 text-sm leading-6 text-foreground-soft"><FormattedText value={i === 0 ? track.description : content.text_15} /></p>

                  <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
                    <div>
                      <dt className="text-[12px] font-bold uppercase tracking-[0.16em] text-muted"><FormattedText value={content.text_21} /></dt>
                      <dd className="mt-1 text-foreground"><FormattedText value={track.commitment} /></dd>
                    </div>
                    <div>
                      <dt className="text-[12px] font-bold uppercase tracking-[0.16em] text-muted"><FormattedText value={content.text_22} /></dt>
                      <dd className="mt-1 text-foreground"><FormattedText value={i === 0 ? track.compensation : content.text_16} /></dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-accent"><FormattedText value={content.text_24} /></p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground-soft">
                    {track.roles.map((role) => (
                      <li key={role} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <FormattedText value={role} />
                      </li>
                    ))}
                  </ul>
                  {track.cta && <a href={track.ctaHref || "#apply"} className="btn btn-accent text-center"><FormattedText value={track.cta} links={false} /></a>}
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section></AnimateInView>

      <SectionWave from="#f3e6d8" to="#f3f1ea" variant="arch" />
      <AnimateInView delay={80}><section className={styles.life}>
        <div className={styles.photo}><Image src={content.communityImg} alt={content.alt_25} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /></div>
        <div>
          <SectionEyebrow icon="leaf-outline"><FormattedText value={content.text_26} /></SectionEyebrow>
          <h2><FormattedText value={content.text_27} /><br /><FormattedText value={content.text_28} /></h2>
          <p><FormattedText value={content.text_29} /></p>
          <div className={styles.roles}><span><FormattedText value={content.text_30} /></span><span><FormattedText value={content.text_31} /></span><span><FormattedText value={content.text_32} /></span><span><FormattedText value={content.text_33} /></span></div>
        </div>
      </section></AnimateInView>

      <AnimateInView delay={100}><section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="home-outline"><FormattedText value={content.text_34} /></SectionEyebrow>
            <ul className="mt-5 space-y-3 text-sm text-foreground-soft">
              {content.volunteerInfo.benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="leaf-outline" size={16} className="mt-0.5 shrink-0 text-secondary" />
                  <FormattedText value={b} />
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <SectionEyebrow icon="compass-outline"><FormattedText value={content.text_35} /></SectionEyebrow>
            <ul className="mt-5 space-y-3 text-sm text-foreground-soft">
              {content.volunteerInfo.requirements.map((r) => (
                <li key={r} className="flex gap-3">
                  <Icon name="circle-outline" size={16} className="mt-0.5 shrink-0 text-accent" />
                  <FormattedText value={r} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section></AnimateInView>

      <AnimateInView delay={80}><section className={styles.promises}>
        <SectionEyebrow icon="home-outline"><FormattedText value={content.text_36} /></SectionEyebrow>
        <h2><FormattedText value={content.text_37} /></h2>
        <p><FormattedText value={content.text_38} /></p>
      </section></AnimateInView>
      <AnimateInView delay={80}><section className={styles.faq}>
        <SectionEyebrow icon="compass-outline"><FormattedText value={content.text_39} /></SectionEyebrow>
        <h2><FormattedText value={content.text_40} /></h2>
        {content.list_1.map(([question, answer]) => <details key={question}><summary><FormattedText value={question} links={false} /><span aria-hidden="true">+</span></summary><p><FormattedText value={answer} /></p></details>)}
      </section></AnimateInView>
      <SectionWave from="#f3f1ea" to="#e7ebdd" variant="slant" />
      <AnimateInView delay={100}><section id="apply" className="organic-section relative scroll-mt-24 overflow-hidden bg-dusk-surface py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="ribbon-outline"><FormattedText value={content.text_41} /></SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.text_42} /></h2>
            <p className="mt-4 leading-relaxed text-foreground-soft"><FormattedText value={content.text_43} /><FormattedText value={" "} />
              <a href={content.href_44} className="text-accent underline"><FormattedText value={content.text_45} links={false} /></a>
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
    </div>
  );
}
