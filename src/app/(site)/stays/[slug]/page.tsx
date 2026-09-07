import { PageHero } from "@/components/sections/hero";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RichContent from "@/components/ui/rich-content";
import GalleryGrid from "@/components/ui/gallery-grid";
import { getCottage, getCottages } from "@/lib/cms";

export const revalidate = 300;

export async function generateStaticParams() {
  const cottages = await getCottages();
  return cottages.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cottage = await getCottage(slug);
  if (!cottage) return {};
  return {
    title: `${cottage.name} — Stays`,
    description: cottage.description,
    alternates: { canonical: `/stays/${cottage.slug}` },
  };
}

export default async function CottageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cottage = await getCottage(slug);
  if (!cottage) notFound();

  const gallery = cottage.gallery?.length ? cottage.gallery : [cottage.image];

  return (
    <>
      <PageHero eyebrow={cottage.element + " \u00b7 " + cottage.tagline} title={cottage.name} description={cottage.description} image={cottage.image} imageAlt={cottage.name + " cottage at Vinyasa Earth"} />

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display italic text-2xl">Amenities</h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground-soft">
              {cottage.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent" /> {a}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted">Sleeps up to {cottage.maxGuests} guests.</p>
            {cottage.bodyHtml && <RichContent html={cottage.bodyHtml} className="mt-8" />}
          </div>

          <div className="border border-line bg-surface p-6">
            <p className="text-xs tracking-[0.08em] uppercase text-foreground-soft">From</p>
            <p className="mt-1 font-sans text-3xl font-bold tracking-tight tabular-nums">
              ₹{cottage.pricePerNight.toLocaleString("en-IN")}
              <span className="text-sm font-sans not-italic text-foreground-soft"> / night</span>
            </p>
            <Link
              href={`/book?type=stay&slug=${cottage.slug}`}
              className="btn btn-accent mt-5 block text-center"
            >
              Check availability
            </Link>
          </div>
        </div>

        {gallery.length > 1 && <GalleryGrid images={gallery} alt={`${cottage.name} at Vinyasa Earth`} />}
      </section>
    </>
  );
}
