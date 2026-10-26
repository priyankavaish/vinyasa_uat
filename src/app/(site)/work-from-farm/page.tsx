
import FormattedText from "@/components/editorial/formatted-text";
import { pageSeoMetadata } from "@/lib/editorial/seo";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__work_from_farm_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon, type IconName } from "@/components/ui/icon";
import { farmStayId, WORK_FROM_FARM_BOOK_PATH } from "@/lib/work-from-farm";
import styles from "./work-from-farm.module.css";

export async function generateMetadata(): Promise<import("next").Metadata> {
  return pageSeoMetadata((await getEditorial("app/(site)/work-from-farm/page", editorialDefaults)).seo, editorialDefaults.seo);
}

export default async function WorkFromFarmPage() {
  const content = await getEditorial("app/(site)/work-from-farm/page", editorialDefaults);
  return (
    <div className={styles.page}>
      <section className={`${styles.container} ${styles.hero}`} aria-labelledby="farm-title">
        <Reveal className={styles.heroCopy}>
          <p className={styles.eyebrow}><FormattedText value={content.eyebrow_1} /></p>
          <h1 id="farm-title"><span className={styles.headingLine}><FormattedText value={content.heroTitle} /></span><span className={`${styles.headingLine} ${styles.headingAccent}`}><FormattedText value={content.heroTitleAccent} /></span></h1>
          {content.introduction.map((paragraph, index) => <p key={index} className={styles.copy}><FormattedText value={paragraph} /></p>)}
          <div className={styles.actions}>
            <Link href={content.href_22} className={`btn btn-accent ${styles.button}`}><FormattedText value={content.text_23} links={false} /><Icon name="arrow-forward-outline" size={17} /></Link>
            <a href="#farm-stays" className={styles.textLink}><FormattedText value={content.exploreLabel} links={false} /><Icon name="arrow-forward-outline" size={15} className="rotate-90" /></a>
          </div>
          <div className={styles.heroNote}><Icon name="leaf-outline" size={19} /><span><FormattedText value={content.heroNote} /></span></div>
        </Reveal>
        <figure className={styles.heroPhoto}>
          <Image src={content.image_4} alt={content.imageAlt_5} fill priority sizes="(min-width: 1152px) 490px, (min-width: 768px) 46vw, 100vw" />
          <figcaption><FormattedText value={content.heroCaption} /></figcaption>
        </figure>
      </section>
      <section className={styles.amenities} aria-labelledby="farm-amenities">
        <div className={styles.container}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}><FormattedText value={content.text_8} /></p><h2 id="farm-amenities"><FormattedText value={content.text_9} /></h2></div>
          <ul className={styles.amenityGrid}>{content.findHere.map((item, index) => <li key={index}><Icon name={item.icon as IconName} size={24} /><p><FormattedText value={item.text} /></p></li>)}</ul>
          <p className={styles.location}><FormattedText value={content.location} /></p>
        </div>
      </section>
      <section id="farm-stays" className={`${styles.container} ${styles.stays}`} aria-labelledby="farm-stays-title">
        <div className={styles.splitHeading}><div><p className={styles.eyebrow}><FormattedText value={content.text_10} /></p><h2 id="farm-stays-title"><FormattedText value={content.stayTitle} /></h2></div><p><FormattedText value={content.stayIntro} /></p></div>
        <div className={styles.stayGrid}>{content.stays.map((stay, i) => <Reveal key={i} className={styles.stayCard}>
          <div className={styles.stayTop}><Icon name={stay.icon as IconName} size={22} /><span>0{i + 1}</span></div>
          <h3><FormattedText value={stay.name} /></h3><p className={styles.stayDescription}><FormattedText value={stay.description} /></p>
          <dl>{stay.rows.map((row, index) => <div key={index}><dt><FormattedText value={row.label} /></dt><dd><strong><FormattedText value={row.price.split("/")[0].trim()} /></strong>{row.price.includes("/") && <small> / <FormattedText value={row.price.split("/").slice(1).join("/").trim()} /></small>}</dd></div>)}</dl>
          <Link href={{ pathname: WORK_FROM_FARM_BOOK_PATH, query: { stay: farmStayId(stay.name) } }} className={styles.stayLink}><FormattedText value={content.text_23} links={false} /><Icon name="arrow-forward-outline" size={18} /></Link>
        </Reveal>)}</div>
        <p className={styles.priceNote}><FormattedText value={content.text_13} /></p>
        <p className={styles.bookingNote}><FormattedText value={content.bookingNote} /></p>
        <div className={styles.meals}><div><p className={styles.eyebrow}><FormattedText value={content.foodEyebrow} /></p><h3><FormattedText value={content.foodTitle} /></h3>{content.foodIntroduction.map((paragraph, index) => <p key={index}><FormattedText value={paragraph} /></p>)}</div><dl>{content.meals.map((meal, index) => <div key={index}><dt><FormattedText value={meal.label} /></dt><dd><FormattedText value={meal.price} /></dd></div>)}</dl></div>
        <div className={styles.foodDetails}>{content.foodDetails.map((paragraph, index) => <p key={index}><FormattedText value={paragraph} /></p>)}</div>
      </section>
      <section className={styles.community} aria-labelledby="farm-community">
        <div className={`${styles.container} ${styles.communityGrid}`}>
          <figure className={styles.communityPhoto}><Image src={content.communityImage} alt={content.communityImageAlt} fill sizes="(min-width: 1152px) 430px, (min-width: 768px) 42vw, 100vw" /><figcaption><FormattedText value={content.communityCaption} /></figcaption></figure>
          <Reveal className={styles.communityCopy}><p className={styles.eyebrow}><FormattedText value={content.text_14} /></p><h2 id="farm-community"><FormattedText value={content.communityTitle} /></h2>{content.communityIntroduction.map((paragraph, index) => <p key={index}><FormattedText value={paragraph} /></p>)}<ol>{content.agreements.map((item, i) => <li key={i}><span>0{i + 1}</span><div><FormattedText value={item} /></div></li>)}</ol>{content.communityNotes.map((paragraph, index) => <p key={index} className={styles.communityNote}><FormattedText value={paragraph} /></p>)}</Reveal>
        </div>
      </section>
      <section className={`${styles.container} ${styles.audience}`} aria-labelledby="farm-audience"><div><p className={styles.eyebrow}><FormattedText value={content.audienceIntro} /></p><h2 id="farm-audience"><FormattedText value={content.audienceTitle} /></h2><p><FormattedText value={content.audienceNote} /></p></div><ul>{content.audience.map((item, index) => <li key={index}><Icon name="leaf-outline" size={17} /><span><FormattedText value={item} /></span></li>)}</ul></section>
      <section className={`${styles.container} ${styles.faq}`} aria-labelledby="farm-faq"><div><p className={styles.eyebrow}><FormattedText value={content.faqEyebrow} /></p><h2 id="farm-faq"><FormattedText value={content.faqTitle} /></h2><p><FormattedText value={content.location} /></p></div><div className={styles.questions}>{content.faqs.map(({question, answer}, index) => <details key={index}><summary><span className={styles.questionText}><FormattedText value={question} links={false} /></span><span aria-hidden="true">+</span></summary><p><FormattedText value={answer} /></p></details>)}</div></section>
      <section className={styles.cta} aria-labelledby="farm-book"><div className={styles.container}><p className={styles.eyebrow}><FormattedText value={content.eyebrow_1} /></p><h2 id="farm-book"><FormattedText value={content.text_20} /></h2><p><FormattedText value={content.text_21} /></p>{content.bookingOptions.map((option, index) => <p key={index}><FormattedText value={option} /></p>)}<div className={styles.actions}><Link href={content.href_22} className={`btn btn-accent ${styles.button}`}><FormattedText value={content.text_23} links={false} /><Icon name="arrow-forward-outline" size={17} /></Link><Link href={`${WORK_FROM_FARM_BOOK_PATH}#farm-enquiry`} className={`btn btn-outline ${styles.button}`}><FormattedText value={content.text_24} links={false} /></Link></div></div></section>
    </div>
  );
}
