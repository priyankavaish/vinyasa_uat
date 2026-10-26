import AnimatedButtonArrow from "@/components/ui/animated-button-arrow";
import Link from "next/link";
import EventContentImage from "./event-content-image";
import EventSection from "./event-section";
import EventOverview from "./event-overview";
import { isLegacyHostSection } from "@/lib/event-hosts";
import styles from "./event-detail.module.css";
import FormattedText from "@/components/editorial/formatted-text";
import RichContent from "@/components/ui/rich-content";
import type { seasonalEvents } from "@/lib/editorial/defaults/seasonal-events";

type Content = typeof seasonalEvents[keyof typeof seasonalEvents];

export default function SeasonalEventContent({ content }: { content: Content }) {
  return <main className="bg-background">
    <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:pt-8">
      <article className="min-w-0">
        <h2 className={styles.aboutTitle}>About the event</h2>
        <h3 className={styles.introTitle}><FormattedText value={content.heading} /></h3>
        <EventOverview><RichContent eventActions html={content.introductionHtml} className="mt-5 text-foreground-soft" /></EventOverview>
        {content.sections.filter(section => !isLegacyHostSection(section)).map((section, index) => <EventSection key={index} id={section.title === "Stay & Retreat Passes" ? "muse-passes" : index === 0 ? "event-programme" : "event-section-" + (index + 1)} title={section.title}>
          {section.image && <EventContentImage src={section.image} alt={section.imageAlt} width={section.imageWidth} />}

          <RichContent eventActions html={section.bodyHtml} className="mt-6 text-foreground-soft [&_strong]:text-foreground" />
        </EventSection>)}
      </article>
      <aside id="event-registration" className="self-start lg:sticky lg:top-28">
        <div className="border border-line bg-surface p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"><FormattedText value={content.sidebarEyebrow} /></p>
          <h2 className="mt-4 font-display text-3xl leading-tight"><FormattedText value={content.title} /></h2>
          <p className="mt-5 border-y border-line py-4 font-semibold"><FormattedText value={content.dateLabel} /></p>
          <p className="mt-4 text-sm leading-7 text-foreground-soft"><FormattedText value={content.timeLabel} /></p>
          <p className="mt-4 text-sm leading-7 text-muted"><FormattedText value={content.venueText} /></p>
          <Link href={content.href} className="btn btn-accent mt-6 flex justify-center text-center"><FormattedText value={content.cta} links={false} /> <AnimatedButtonArrow /></Link>
        </div>
      </aside>
    </section>
  </main>;
}
