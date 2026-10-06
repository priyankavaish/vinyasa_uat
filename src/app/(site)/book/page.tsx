import { pageSeoMetadata } from "@/lib/editorial/seo";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__book_page";
import { getEditorial } from "@/lib/editorial/server";
import { Suspense } from "react";
import Link from "next/link";
import Image from "@/components/editorial/image";
import BookingForm from "@/components/forms/booking-form";
import { getCottages } from "@/lib/cms";
import styles from "./booking.module.css";

export async function generateMetadata(): Promise<import("next").Metadata> {
  return pageSeoMetadata((await getEditorial("app/(site)/book/page", editorialDefaults)).seo, editorialDefaults.seo);
}
export const dynamic = "force-dynamic";
export default async function BookPage() {
  const content = await getEditorial("app/(site)/book/page", editorialDefaults);
  const cottages = await getCottages();
  return <section className={styles.page} aria-labelledby="booking-heading">
    <div className={styles.heading}>
      <div className={styles.intro}><p className="eyebrow">{content.eyebrow_1} &middot; Vinyasa Earth</p><h1 id="booking-heading" className="font-display">{content.title_2}</h1><p>Select your stay option and dates. Your total includes 18% GST.</p></div>
      <div className={styles.location}>
        <svg aria-hidden="true" viewBox="0 0 64 64" fill="none"><path d="M17 49c12-8 21-19 29-35M29 39C15 39 12 29 13 20c12 0 21 6 21 14M37 29c-1-12 6-19 17-20 1 12-4 22-16 24M22 45c-9 2-15-2-18-9 9-4 18-3 23 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div><p>Maheshwas &middot; Jaipur</p><span>Mudhouses &middot; Tents &middot; Dorms</span></div>
      </div>
    </div>
    <div className={styles.layout}>
      <div id="stay-booking" className={styles.form}><Suspense fallback={<p className="text-sm text-foreground-soft">Loading booking form...</p>}><BookingForm mode="stay" cottages={cottages} events={[]} /></Suspense></div>
      <aside className={styles.aside}>
        <div className={styles.photo}><Image src={content.image_3} alt={content.imageAlt_4} fill priority quality={80} sizes="(min-width: 1024px) 330px, 90vw" className={styles.image} /></div>
        <h2 className="font-display">A little room to simply be.</h2>
        <p className={styles.description}>Hand-built mudhouses, open skies, and unhurried mornings at Vinyasa Earth, Jaipur.</p>
        <Link href="/stays" className={styles.explore}>Explore our stays <span aria-hidden="true">↗</span></Link>
      </aside>
    </div>
  </section>;
}
