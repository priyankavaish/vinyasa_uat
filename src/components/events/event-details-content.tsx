import type { EventProgram } from "@/lib/content";
import type { EventContent } from "@/lib/event-content";
import FormattedText from "@/components/editorial/formatted-text";
import RichContent from "@/components/ui/rich-content";
import PaymentButton from "@/components/ui/payment-button";
import EventSection from "./event-section";
import EventOverview from "./event-overview";
import styles from "./event-detail.module.css";

type Props = {
  event: EventProgram;
  content: EventContent;
  fallback?: { heading: string; paragraphs: string[]; highlights: string[] };
  priceLabel: string;
};

export default function EventDetailsContent({ event, content, fallback, priceLabel }: Props) {
  return <main><section>
    <article>
      <h2 className={styles.aboutTitle}>About the event</h2>
      {content.introductionHtml ? <EventOverview><RichContent eventActions html={content.introductionHtml} className={styles.overviewCopy} /></EventOverview> : !event.bodyHtml && fallback ? <>
        <h3 className={styles.introTitle}><FormattedText value={fallback.heading} /></h3>
        {fallback.paragraphs.map(paragraph => <p key={paragraph} className={styles.overviewCopy}><FormattedText value={paragraph} /></p>)}
      </> : !content.sections.length && <p className={styles.overviewCopy}><FormattedText value={event.description} /></p>}
      {content.sections.map((section, index) => <EventSection key={index} id={index === 0 ? "event-programme" : "event-section-" + (index + 1)} title={section.title}>
        <RichContent eventActions html={section.bodyHtml} />
      </EventSection>)}
      {!event.bodyHtml && !!fallback?.highlights.length && <EventSection id="event-programme" title="What to expect">
        <ul className={styles.highlightList}>{fallback.highlights.map(item => <li key={item}><FormattedText value={item} /></li>)}</ul>
      </EventSection>}
    </article>
    <aside id="event-registration">
      <div>
        <p className={styles.bookingEyebrow}>Registration</p>
        <h2 className={styles.registrationTitle}>Join the experience</h2>
        <p className={styles.registrationPrice}><FormattedText value={priceLabel} /></p>
        <PaymentButton target={"event:" + event.slug} href={"/events/" + event.slug + "/book"} animatedArrow className="btn btn-accent mt-5">Reserve your place</PaymentButton>
      </div>
    </aside>
  </section></main>;
}
