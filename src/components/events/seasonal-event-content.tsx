import Link from "next/link";
import Image from "@/components/editorial/image";
import FormattedText from "@/components/editorial/formatted-text";
import RichContent from "@/components/ui/rich-content";
import type { seasonalEvents } from "@/lib/editorial/defaults/seasonal-events";
type Content = typeof seasonalEvents[keyof typeof seasonalEvents];
export default function SeasonalEventContent({ content }: { content: Content }) {
  return <main className="bg-background"><section className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:pt-8">
    <article className="min-w-0"><Link href="/events" className="text-xs uppercase tracking-widest text-accent underline">All programmes</Link><h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl"><FormattedText value={content.heading} /></h2><RichContent html={content.introductionHtml} className="mt-6 text-foreground-soft" />
      {content.sections.map((section,index)=><section key={index} id={section.title === "Stay & Retreat Passes" ? "muse-passes" : undefined} className="mt-12 scroll-mt-28 border-b border-line pb-10 last:border-0"><p className="text-xs font-semibold tracking-[0.2em] text-accent">{String(index+1).padStart(2,"0")}</p><h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl"><FormattedText value={section.title} /></h2>{section.image && <div className="relative mt-6 aspect-[16/9] overflow-hidden border border-line"><Image src={section.image} alt={section.imageAlt} fill sizes="(min-width:1024px) 700px, 100vw" className="object-cover" /></div>}<RichContent html={section.bodyHtml} className="mt-6 text-foreground-soft [&_strong]:text-foreground [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4" /></section>)}
    </article><aside className="self-start lg:sticky lg:top-28"><div className="border border-line bg-surface p-6 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">At Vinyasa Earth</p><h2 className="mt-4 font-display text-3xl leading-tight"><FormattedText value={content.title} /></h2><p className="mt-5 border-y border-line py-4 font-semibold"><FormattedText value={content.dateLabel} /></p><p className="mt-4 text-sm leading-7 text-foreground-soft"><FormattedText value={content.timeLabel} /></p><p className="mt-4 text-sm leading-7 text-muted">Vinyasa Earth, Jaipur, Rajasthan</p><Link href={content.href} className="btn btn-accent mt-6 flex justify-center text-center"><FormattedText value={content.cta} links={false} /> &#8599;</Link></div></aside>
  </section></main>;
}
