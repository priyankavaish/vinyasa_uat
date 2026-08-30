import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import RichContent from "@/components/rich-content";
import { getEvent, getEvents } from "@/lib/cms";

export const revalidate = 300;

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return { title: event.name, description: event.description, alternates: { canonical: `/events/${event.slug}` } };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const image = event.image || "/seed/grounds-06.jpg";
  const priceLabel = event.priceFrom === 0 ? "By donation" : `₹${event.priceFrom.toLocaleString("en-IN")}`;

  return (
    <>
      <section className="relative flex h-[52vh] min-h-[380px] items-end text-background">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-12 sm:px-8">
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] before:h-px before:w-7 before:bg-background/60 before:content-['']">
            {event.kind}
          </p>
          <h1 className="font-display italic text-4xl leading-tight sm:text-5xl">{event.name}</h1>
          <p className="mt-4 max-w-[60ch] text-background/85 leading-relaxed">{event.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <Link href="/events" className="text-xs uppercase tracking-[0.08em] text-accent underline">
          ← All programmes
        </Link>
        <div className="mt-8 grid gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display italic text-2xl">Details</h2>
            <dl className="mt-4 space-y-3 text-sm text-foreground-soft">
              {event.dateLabel && (
                <div className="flex items-center gap-3">
                  <Icon name="calendar-outline" size={15} className="text-accent" />
                  <span>{event.dateLabel}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Icon name="sunny-outline" size={15} className="text-accent" />
                <span>{event.durationLabel}</span>
              </div>
              {event.facilitator && (
                <div className="flex items-center gap-3">
                  <Icon name="people-outline" size={15} className="text-accent" />
                  <span>Facilitated by {event.facilitator}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Icon name="location-outline" size={15} className="text-accent" />
                <span>Vinyasa Earth, Amer, Jaipur</span>
              </div>
            </dl>
            {event.bodyHtml && <RichContent html={event.bodyHtml} className="mt-8" />}
          </div>
          <div className="border border-line bg-surface p-6">
            <p className="text-xs tracking-[0.08em] uppercase text-foreground-soft">Contribution</p>
            <p className="mt-1 font-sans text-3xl font-bold tracking-tight tabular-nums">{priceLabel}</p>
            <Link href={`/book?type=event&slug=${event.slug}`} className="btn btn-accent mt-5 block text-center">
              Reserve a spot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
