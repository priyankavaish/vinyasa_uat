import Link from "next/link";
import EventContentImage from "./event-content-image";
import FormattedText from "@/components/editorial/formatted-text";
import RichContent from "@/components/ui/rich-content";
import ResidencyApplicationForm from "@/components/forms/residency-application-form";
import type { artistInResidence } from "@/lib/editorial/defaults/artist-in-residence";

type Props = { content: typeof artistInResidence };
export default function ArtistResidencyContent({ content }: Props) {
  return <main className="bg-background">
    <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:pt-8">
      <article className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"><FormattedText value={content.dateLabel} /></p>
        <p className="mt-2 text-sm leading-6 text-muted"><FormattedText value={content.timeLabel} /></p>
        <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">An immersive, research-led residency</h2>
        {content.introduction.map((paragraph, index) => <p key={index} className="mt-5 text-base leading-8 text-foreground-soft"><FormattedText value={paragraph} /></p>)}
        <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-line py-5 sm:grid-cols-3">
          <div><dt className="text-xs uppercase tracking-widest text-muted">Duration</dt><dd className="mt-2 font-semibold"><FormattedText value={content.durationLabel} /></dd></div>
          <div><dt className="text-xs uppercase tracking-widest text-muted">Places</dt><dd className="mt-2 font-semibold">2 selected artists</dd></div>
          <div><dt className="text-xs uppercase tracking-widest text-muted">Venue</dt><dd className="mt-2 font-semibold">Vinyasa Earth, Jaipur</dd></div>
        </dl>
        {content.sections.map((section, index) => <section key={index} className="mt-12 border-b border-line pb-10 last:border-0">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent">{String(index + 1).padStart(2, "0")}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl"><FormattedText value={section.title} /></h2>
          {section.image && <EventContentImage src={section.image} alt={section.imageAlt} width={section.imageWidth} />}
          <RichContent eventActions html={section.bodyHtml} className="mt-6 text-foreground-soft [&_h3]:text-foreground [&_strong]:text-foreground" />
        </section>)}
      </article>
      <aside className="self-start lg:sticky lg:top-28">
        <div className="border border-line bg-surface p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Live, explore & create</p>
          <h2 className="mt-4 font-display text-3xl leading-tight">Make room for your practice.</h2>
          <p className="mt-4 text-sm leading-7 text-foreground-soft">Four months of community living, independent research and artistic inquiry. Only two residency spots are available.</p>
          <p className="mt-5 border-y border-line py-4 text-sm leading-7 text-foreground-soft">Dormitory accommodation and daily vegetarian meals included. No stipend; independent paid offerings follow a 60&ndash;40 Artist&ndash;Vinyasa revenue split.</p>
          <Link href="#residency-application" className="btn btn-accent mt-6 flex justify-center text-center">Apply for the residency <span aria-hidden className="ml-2">&#8599;</span></Link>
          <p className="mt-5 text-xs leading-6 text-muted">Send your research proposal to <a href={`mailto:${content.organizer.email}`} className="break-words text-accent underline">{content.organizer.email}</a>.</p>
        </div>
        <div className="mt-5 border border-line p-6 text-sm leading-7 text-foreground-soft">
          <h3 className="font-semibold text-foreground"><FormattedText value={content.organizer.name} /></h3>
          <p className="mt-2"><FormattedText value={content.organizer.venue} /></p>
          <a href={`tel:${content.organizer.phone.replace(/[^+0-9]/g, "")}`} className="mt-3 block text-accent underline">{content.organizer.phone}</a>
          <a href={`mailto:${content.organizer.email}`} className="block break-words text-accent underline">{content.organizer.email}</a>
          <a href={content.organizer.mapHref} target="_blank" rel="noopener noreferrer" className="btn btn-accent mt-4">Get directions &#8599;</a>
        </div>
      </aside>
    </section>
    <section id="residency-application" className="scroll-mt-24 border-t border-line bg-clay-surface px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Begin your enquiry</p><h2 className="mt-4 font-display text-4xl leading-tight"><FormattedText value={content.application.title} /></h2><p className="mt-5 leading-7 text-foreground-soft">Fill in the form to start your application. Email your artist statement, research inquiry, methodology and October&ndash;January timeline to <a href={`mailto:${content.organizer.email}`} className="text-accent underline">{content.organizer.email}</a>.</p></div>
        <ResidencyApplicationForm options={content.application} />
      </div>
    </section>
  </main>;
}
