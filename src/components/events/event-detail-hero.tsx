import type { ReactNode } from "react";
import Link from "next/link";
import Image from "@/components/editorial/image";
import FormattedText from "@/components/editorial/formatted-text";
import { Icon } from "@/components/ui/icon";
import EventShareButton from "./event-share-button";
import styles from "./event-detail.module.css";

type Props = {
  name: string;
  kind: string;
  description: string;
  image: string;
  date?: string | null;
  duration?: string | null;
  facilitator?: string | null;
  bookingLabel: string;
  time?: string | null;
  children: ReactNode;
  hostSection?: ReactNode;
};

export default function EventDetailHero({ name, kind, description, image, date, duration, facilitator, bookingLabel, time, children, hostSection }: Props) {
  return (
    <>
      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/events"><Icon name="arrow-forward-outline" size={13} className={styles.backArrow} /> Events & retreats</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page"><FormattedText value={name} links={false} /></span>
        </nav>
        <div className={styles.poster}>
          <Image src={image} alt={name + " at Vinyasa Earth"} width={1200} height={900} priority quality={95} sizes="(min-width: 1280px) 820px, (min-width: 1024px) 65vw, 100vw" className={styles.posterImage} />
        </div>
        <div className={styles.titleRow}>
          <h1><FormattedText value={name} /></h1>
          <EventShareButton title={name} />
        </div>
        <div className={styles.tags}>
          <span><FormattedText value={kind} links={false} /></span>
          <span><Icon name="location-outline" size={14} /> Jaipur</span>
          {duration && duration !== date && <span><Icon name="sunny-outline" size={14} /><FormattedText value={duration} links={false} /></span>}
        </div>
        <div className={styles.mobileFacts}>
          {date && <p><Icon name="calendar-outline" size={17} /><span><FormattedText value={date} /></span></p>}
          <p><Icon name="location-outline" size={17} /><span>Vinyasa Earth, Jaipur</span></p>
          {time && <p><Icon name="sunny-outline" size={17} /><span><FormattedText value={time} /></span></p>}
        </div>
        <p className={styles.description}><FormattedText value={description} /></p>
        {facilitator && <p className={styles.host}><Icon name="people-outline" size={16} /> Hosted by <strong><FormattedText value={facilitator} /></strong></p>}
      </header>

      <aside className={`${styles.bookingRail} ${hostSection ? styles.bookingRailWithHosts : ""}`} aria-label="Event booking details">
        <div className={styles.bookingCard}>
          <p className={styles.bookingEyebrow}>At Vinyasa Earth</p>
          <h2>Plan your experience</h2>
          <dl className={styles.facts}>
            {date && <div><Icon name="calendar-outline" size={21} /><div><dt>Date</dt><dd><FormattedText value={date} /></dd></div></div>}
            {time && <div><Icon name="sunny-outline" size={21} /><div><dt>Schedule</dt><dd><FormattedText value={time} /></dd></div></div>}
            {duration && duration !== date && !time && <div><Icon name="sunny-outline" size={21} /><div><dt>Duration</dt><dd><FormattedText value={duration} /></dd></div></div>}
            <div><Icon name="location-outline" size={21} /><div><dt>Venue</dt><dd>Vinyasa Earth<span>Jaipur, Rajasthan</span></dd></div></div>
          </dl>
          <div className={styles.bookingFooter}>
            <p className={styles.bookingPrice}><FormattedText value={bookingLabel} /></p>
            <div className={styles.actions}>{children}</div>
            <a href="#event-registration" className={styles.bookingMore}>View registration details <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
        {hostSection}
        <p className={styles.railNote}><Icon name="leaf-outline" size={16} /> A little closer to art, nature & community.</p>
      </aside>

      <div className={styles.mobileBooking} role="region" aria-label="Quick event booking">
        <div><span>Join the experience</span><p><FormattedText value={bookingLabel} /></p></div>
        <div className={styles.actions}>{children}</div>
      </div>
    </>
  );
}
