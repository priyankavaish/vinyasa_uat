import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__work_from_farm_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { whatsappLink } from "@/lib/site";
import workPhoto from "@/app/assets/work-from-farm/IMG_4297-1-600x900.webp";
import gardenPhoto from "@/app/assets/work-from-farm/IMG_4299-600x900.webp";
import styles from "./work-from-farm.module.css";

export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/work-from-farm/page", editorialDefaults)).seo;
}

const agreements = [
  "Wash your own plate and leave shared spaces clean.",
  "Use water and electricity mindfully; support plastic-free living.",
  "Respect quiet time after dinner and the people around you.",
  "Keep the campus vegetarian, smoke-free and alcohol-free.",
];
const faqs = [
  ["How reliable are Wi-Fi and electricity?", "Wi-Fi supports regular remote work. Village connectivity and power can occasionally be interrupted; basic backup covers essential needs."],
  ["Are there desks or air-conditioning?", "There are no dedicated workstations or air-conditioning. Choose a shared or outdoor space that suits you."],
  ["How do meals work?", "Meals are optional, charged separately and pre-ordered each morning. The community kitchen is not a self-catering kitchen."],
  ["Can I join events?", "Ask about gatherings during your stay. Some carry a separate fee; participation is optional."],
];

export default async function WorkFromFarmPage() {
  const content = await getEditorial("app/(site)/work-from-farm/page", editorialDefaults);
  const enquiry = whatsappLink("Hi Vinyasa Earth, I'd like to enquire about a Work From Farm stay longer than 15 nights.");
  return (
    <div className={styles.page}>
      <section className={`${styles.container} ${styles.hero}`} aria-labelledby="farm-title">
        <Reveal className={styles.heroCopy}>
          <p className={styles.eyebrow}>Work from farm / Vinyasa Earth</p>
          <h1 id="farm-title">A little less rush.<br /><span>A little more room.</span></h1>
          <p className={styles.lead}>{content.title_2}</p>
          <p className={styles.copy}>{content.description_3}</p>
          <div className={styles.actions}>
            <Link href={content.href_22} className={`btn btn-accent ${styles.button}`}>Find your stay <Icon name="arrow-forward-outline" size={17} /></Link>
            <a href="#farm-stays" className={styles.textLink}>Explore stays &amp; rates <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.heroNote}><Icon name="leaf-outline" size={19} /><span>Bring your laptop. Make yourself at home.</span></div>
        </Reveal>
        <figure className={styles.heroPhoto}>
          <Image src={workPhoto} alt="A guest working on her laptop beneath the trees at Vinyasa" fill priority sizes="(min-width: 1152px) 490px, (min-width: 768px) 46vw, 100vw" />
          <figcaption>Work, with a different view.</figcaption>
        </figure>
      </section>

      <section className={styles.amenities} aria-labelledby="farm-amenities">
        <div className={styles.container}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>{content.text_8}</p><h2 id="farm-amenities">{content.text_9}</h2></div>
          <ul className={styles.amenityGrid}>{content.findHere.map((item) => <li key={item.text}><Icon name={item.icon} size={24} /><p>{item.text}</p></li>)}</ul>
        </div>
      </section>

      <section id="farm-stays" className={`${styles.container} ${styles.stays}`} aria-labelledby="farm-stays-title">
        <div className={styles.splitHeading}><div><p className={styles.eyebrow}>{content.text_10}</p><h2 id="farm-stays-title">Settle in, your way.</h2></div><p>One night or a longer change of scene.<br />Choose a shared home or your own quiet corner.</p></div>
        <div className={styles.stayGrid}>{content.stays.map((stay, i) => <Reveal key={stay.name} className={styles.stayCard}>
          <div className={styles.stayTop}><Icon name={stay.icon} size={22} /><span>0{i + 1}</span></div>
          <h3>{stay.name}</h3><p className={styles.stayDescription}>{i === 0 ? "A simple shared stay, with community close by." : "A private earthen stay for up to two guests."}</p>
          <dl>{stay.rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd><strong>{row.price.split("/")[0].trim()}</strong>{row.price.includes("/") && <small> / {row.price.split("/").slice(1).join("/").trim()}</small>}</dd></div>)}</dl>
          <Link href={content.href_22} className={styles.stayLink}>Check availability <Icon name="arrow-forward-outline" size={18} /></Link>
        </Reveal>)}</div>
        <p className={styles.priceNote}>{content.text_13} Meals are separate.</p>
        <div className={styles.meals}><div><p className={styles.eyebrow}>Around the table</p><h3>Simple food. Shared moments.</h3><p>Optional vegetarian meals, ordered each morning.</p></div><dl>{content.meals.map((meal) => <div key={meal.label}><dt>{meal.label}</dt><dd>{meal.price}</dd></div>)}</dl></div>
      </section>

      <section className={styles.community} aria-labelledby="farm-community">
        <div className={`${styles.container} ${styles.communityGrid}`}>
          <figure className={styles.communityPhoto}><Image src={gardenPhoto} alt="A guest working on a laptop on the grass beside an earthen cottage" fill sizes="(min-width: 1152px) 430px, (min-width: 768px) 42vw, 100vw" /><figcaption>A change of pace, outside Jaipur.</figcaption></figure>
          <Reveal className={styles.communityCopy}><p className={styles.eyebrow}>{content.text_14}</p><h2 id="farm-community">Your work.<br />Our shared rhythm.</h2><p>{content.text_16}</p><ol>{agreements.map((item, i) => <li key={item}><span>0{i + 1}</span>{item}</li>)}</ol><p className={styles.communityNote}>For remote workers, freelancers, founders, writers, artists and anyone comfortable with community living.</p></Reveal>
        </div>
      </section>

      <section className={`${styles.container} ${styles.faq}`} aria-labelledby="farm-faq"><div><p className={styles.eyebrow}>Before you arrive</p><h2 id="farm-faq">A few things<br />to know.</h2><p>Maheshwas Khurd, outside Jaipur.<br />Cabs can reach the property directly.</p></div><div className={styles.questions}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className={styles.cta} aria-labelledby="farm-book"><div className={styles.container}><p className={styles.eyebrow}>Make room for a different everyday</p><h2 id="farm-book">Bring your work. Stay a while.</h2><p>Up to 15 nights? Book online. Longer stay? Let&apos;s plan it together.</p><div className={styles.actions}><Link href={content.href_22} className={`btn btn-accent ${styles.button}`}>Check availability <Icon name="arrow-forward-outline" size={17} /></Link><a href={enquiry} className={`btn btn-outline ${styles.button}`}>Enquire for a longer stay</a></div></div></section>
    </div>
  );
}