
import FormattedText from "@/components/editorial/formatted-text";
import PaymentButton from "@/components/ui/payment-button";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__stays__slug__page";
import { getEditorial } from "@/lib/editorial/server";
import Link from "next/link";
import styles from "./stay-detail.module.css";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RichContent from "@/components/ui/rich-content";
import StayGallery from "@/components/sections/stay-gallery";
import { Icon } from "@/components/ui/icon";
import { getCottage, getCottages } from "@/lib/cms";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getCottages()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const cottage = await getCottage((await params).slug);
  if (!cottage) return {};
  return {
    title: `${cottage.name} — Stays`,
    description: cottage.description,
    alternates: { canonical: `/stays/${cottage.slug}` },
  };
}

export default async function CottageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getEditorial("app/(site)/stays/[slug]/page", editorialDefaults);

  const cottage = await getCottage((await params).slug);
  if (!cottage) notFound();
  const gallery = cottage.gallery?.length ? cottage.gallery : [cottage.image];
  const shared = cottage.slug === "dorm";
  const tent = cottage.slug === "tent";
  const bookingUrl = `/book?type=stay&slug=${encodeURIComponent(cottage.slug)}`;

  return (
    <article className={`${styles.page} mx-auto max-w-6xl px-5 pb-20 sm:px-8`}>
      <StayGallery key={cottage.slug} images={gallery} name={cottage.name} />

      <nav aria-label={content.aria_label_1} className="mt-4 flex items-center gap-2 text-xs text-foreground-soft">
        <Link href={content.href_2} className="hover:text-accent"><FormattedText value={content.text_3} links={false} /></Link><span aria-hidden>/</span>
        <Link href={content.href_4} className="hover:text-accent"><FormattedText value={content.text_5} links={false} /></Link><span aria-hidden>/</span>
        <span aria-current="page" className="text-accent"><FormattedText value={cottage.name} /></span>
      </nav>


      

      <div className="mt-6 grid items-start gap-8 lg:mt-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] lg:gap-16">
        <section aria-labelledby="about-stay">
      <header className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"><FormattedText value={cottage.element} /><FormattedText value={content.text_6} /><FormattedText value={cottage.tagline} /></p>
        <h1 className="mt-2 font-semibold text-3xl leading-tight sm:text-4xl"><FormattedText value={cottage.name} /><FormattedText value={tent ? " Stay" : shared ? content.text_7 : content.text_8} /></h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-foreground-soft"><Icon name="location-outline" size={16} /><FormattedText value={content.text_9} /></p>
      </header>

          <h2 id="about-stay" className="sr-only"><FormattedText value={content.text_10} /><FormattedText value={cottage.name} /></h2>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-y border-line py-4 text-sm text-foreground-soft">
            <span className="flex items-center gap-2"><Icon name={shared ? "people-outline" : "home-outline"} size={18} /><FormattedText value={tent ? "Outdoor tent stay" : shared ? content.text_11 : content.text_12} /></span>
            <span className="flex items-center gap-2"><Icon name="people-outline" size={18} /><FormattedText value={shared ? `${cottage.maxGuests}-bed dormitory` : `Up to ${cottage.maxGuests} guests`} /></span>
          </div>
          <p className="mt-6 text-base leading-relaxed text-foreground-soft"><FormattedText value={cottage.description} /></p>
          {cottage.bodyHtml && <RichContent html={cottage.bodyHtml} className="mt-7" />}
          <Link href={content.href_13} className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-accent underline underline-offset-4"><FormattedText value={content.text_14} links={false} /><Icon name="arrow-forward-outline" size={16} /></Link>
        </section>

        <aside aria-label={content.aria_label_15} className="overflow-hidden border border-line bg-surface shadow-[0_8px_32px_rgba(48,43,35,0.06)]">
          <div className="border-b border-line p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-soft"><FormattedText value={content.text_16} /><FormattedText value={cottage.name} /></p>
            {cottage.pricePerNight > 0 ? (
              <div className="mt-3">
                <span className="mr-2 text-xs text-foreground-soft"><FormattedText value={content.text_17} /></span>
                <span className="text-3xl font-semibold tracking-tight tabular-nums">₹<FormattedText value={cottage.pricePerNight.toLocaleString("en-IN")} /></span>
                <span className="ml-2 text-sm text-foreground-soft"><FormattedText value={shared ? "/ bed / night + 18% GST" : "/ night + 18% GST"} /></span>
              </div>
            ) : <p className="mt-3 text-2xl font-semibold"><FormattedText value={content.text_18} /></p>}
            <PaymentButton unavailable={cottage.quantity === 0} target={`stay:${cottage.slug}`} href={bookingUrl}  className="btn btn-accent mt-6 flex w-full items-center justify-center gap-2">
                <FormattedText value={shared ? content.text_19 : content.text_20} links={false} /> <span className="arrow-nudge relative top-px inline-flex items-center leading-none"><Icon name="arrow-forward-outline" size={16} /></span>
            </PaymentButton>
            <p className="mt-3 text-center text-xs leading-relaxed text-muted"><FormattedText value={content.text_21} /></p>
          </div>
          <div className="p-6 sm:p-7">
            <h2 className="font-semibold text-xl"><FormattedText value={content.text_22} /></h2>
            {cottage.amenities.length > 0 ? (
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                {cottage.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-2 text-sm leading-relaxed text-foreground-soft">
                    <span aria-hidden className="mt-0.5 text-accent">✓</span><FormattedText value={amenity} />
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4 text-sm text-foreground-soft"><FormattedText value={content.text_23} /></p>}
          </div>
        </aside>
      </div>
    </article>
  );
}
