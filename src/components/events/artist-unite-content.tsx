import AnimatedButtonArrow from "@/components/ui/animated-button-arrow";
import Link from "next/link";
import HashScroll from "@/components/ui/hash-scroll";
import EventContentImage from "./event-content-image";
import FormattedText from "@/components/editorial/formatted-text";
import RichContent from "@/components/ui/rich-content";
import ResidencyApplicationForm from "@/components/forms/residency-application-form";
import type { artistUnite } from "@/lib/editorial/defaults/artist-unite";

export default function ArtistUniteContent({ content }: { content: typeof artistUnite }) {
  return <main className="bg-background"><HashScroll />
    <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:pt-8">
      <article className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"><FormattedText value={content.dateLabel} /></p>
        <p className="mt-2 text-sm leading-6 text-muted"><FormattedText value={content.timeLabel} /></p>
        <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl"><FormattedText value={content.heading} /></h2>
        <RichContent eventActions html={content.introductionHtml} className="mt-6 text-foreground-soft" />
        {content.sections.map((section, index) => <section key={index} className="mt-12 border-b border-line pb-10 last:border-0">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent">{String(index + 1).padStart(2, "0")}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl"><FormattedText value={section.title} /></h2>
          {section.image && <EventContentImage src={section.image} alt={section.imageAlt} width={section.imageWidth} />}
          <RichContent eventActions html={section.bodyHtml} className="mt-6 text-foreground-soft [&_strong]:text-foreground" />
          {index === 3 && <Link href="#artist-unite-application" className="btn btn-accent mt-5"><FormattedText value={content.applyCta} links={false} /> <AnimatedButtonArrow /></Link>}
        </section>)}
      </article>
      <aside className="self-start lg:sticky lg:top-28">
        <div className="border border-line bg-surface p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"><FormattedText value={content.sidebarEyebrow} /></p>
          <h2 className="mt-4 font-display text-3xl leading-tight"><FormattedText value={content.sidebarTitle} /></h2>
          <p className="mt-5 border-y border-line py-4 text-2xl font-semibold"><FormattedText value={content.priceLabel} /></p>
          <p className="mt-4 text-sm leading-7 text-foreground-soft"><FormattedText value={content.includedText} /></p>
          <p className="mt-3 text-sm leading-7 text-muted"><FormattedText value={content.lunchNote} /></p>
          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm"><div><dt className="font-semibold"><FormattedText value={content.arrivalLabel} /></dt><dd className="mt-1 text-foreground-soft"><FormattedText value={content.arrival} /></dd></div><div><dt className="font-semibold"><FormattedText value={content.zariyaLabel} /></dt><dd className="mt-1 text-foreground-soft"><FormattedText value={content.zariya} /></dd></div><div><dt className="font-semibold"><FormattedText value={content.checkoutLabel} /></dt><dd className="mt-1 text-foreground-soft"><FormattedText value={content.checkout} /></dd></div></dl>
          <Link href="#artist-unite-application" className="btn btn-accent mt-6 flex justify-center text-center"><FormattedText value={content.applyCta} links={false} /> <AnimatedButtonArrow /></Link>
        </div>
      </aside>
    </section>
    <section id="artist-unite-application" className="scroll-mt-24 border-t border-line bg-clay-surface px-5 py-12 sm:px-8 sm:py-16"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"><FormattedText value={content.applicationEyebrow} /></p><h2 className="mt-4 font-display text-4xl leading-tight"><FormattedText value={content.application.title} /></h2><p className="mt-5 leading-7 text-foreground-soft"><FormattedText value={content.applicationText} /></p></div><ResidencyApplicationForm source="artist-unite" options={content.application} /></div></section>
  </main>;
}
