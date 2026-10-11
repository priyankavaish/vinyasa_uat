import Image from "@/components/editorial/image";
import styles from "./artist-offerings.module.css";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { getEvent } from "@/lib/cms";
import { getEditorial } from "@/lib/editorial/server";
import { defaults as eventDefaults } from "@/lib/editorial/defaults/app__site__events__slug__page";
import residenceImage from "@/app/assets/artist-in-residence/Arthur-1024x683 (2).webp";

export default async function ArtistOfferings({ escapeImage }: { escapeImage: string }) {
  const [residency, eventContent] = await Promise.all([getEvent("artist-in-residence"), getEditorial("app/(site)/events/[slug]/page", eventDefaults)]);
  const offerings = [
    {
      name: "Artist in Residence", href: "#artist-in-residence", link: "/events/artist-in-residence",
      image: residenceImage, alt: "An artist playing guitar in an earthen space at Vinyasa",
      label: "A focused residency", detail: residency?.durationLabel ?? eventContent.ARTIST_IN_RESIDENCE.durationLabel, companion: eventContent.ARTIST_IN_RESIDENCE.placesValue,
      description: residency?.description ?? eventContent.ARTIST_IN_RESIDENCE.introduction[0],
      action: "Explore Artist in Residence",
    },
    {
      name: "Artist Escape", href: "#artist-escape",
      image: escapeImage, alt: "Artists sharing a creative space at Vinyasa",
      label: "A creative stay", detail: "Choose your dates", companion: "Community living",
      description: "For artists looking for time and space to create at their own pace. Choose your dates and join community life, with shared meals and space for your practice.",
      action: "Explore Artist Escape",
    },
  ];
  return (
    <section id="offerings" aria-labelledby="offerings-title" className={styles.section}>
      <div className={styles.container}>
        <Reveal>
          <div className={styles.heading}>
            <div>
              <p className={styles.eyebrow}><span aria-hidden="true" />Artist programmes at Vinyasa</p>
              <h2 id="offerings-title" className={styles.headingTitle}>Two ways to make space for your art.</h2>
            </div>
            <p className={styles.intro}>A focused residency or a creative stay. Find the offering that fits your practice.</p>
          </div>
        </Reveal>
        <div className={styles.grid}>
          {offerings.map((offering, i) => (
            <Reveal key={offering.name} delay={i * 80} className={styles.item}>
              <article className={styles.card} data-tone={offering.href === "#artist-in-residence" ? "olive" : "clay"}>
                <div className={styles.media}>
                  <Image src={offering.image} alt={offering.alt} fill sizes="(min-width: 1152px) 528px, (min-width: 768px) 46vw, 100vw" className={styles.image} />


                </div>
                <div className={styles.body}>
                  <p className={styles.label}><span aria-hidden="true">0{i + 1}</span>{offering.label}</p>
                  <h3 className={styles.title}>{offering.name}</h3>
                  <p className={styles.description}>{offering.description}</p>
                  <div className={styles.details}><span>{offering.detail}</span><span>{offering.companion}</span></div>
                  <a href={offering.link ?? offering.href} className={`btn btn-accent ${styles.action}`}>{offering.action}<span className={styles.arrow} aria-hidden="true"><Icon name="arrow-forward-outline" size={18} /></span></a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}