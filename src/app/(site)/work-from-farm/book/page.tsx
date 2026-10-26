import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import FormattedText from "@/components/editorial/formatted-text";
import FarmBooking from "@/components/forms/farm-booking";
import { getEditorial } from "@/lib/editorial/server";
import { defaults } from "@/lib/editorial/defaults/app__site__work_from_farm_page";
import { farmOffers } from "@/lib/work-from-farm";
import styles from "./farm-booking.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Plan your Work from Farm stay",
  description: "Choose your dates and accommodation, view Work from Farm rates and enquire about availability at Vinyasa Earth.",
  alternates: { canonical: "/work-from-farm/book" },
};
export default async function FarmBookPage() {
  const content = await getEditorial("app/(site)/work-from-farm/page", defaults);
  return <section className={styles.page} aria-labelledby="farm-booking-heading">
    <Link href="/work-from-farm" className={styles.back}>Back to Work from Farm</Link>
    <header className={styles.heading}>
      <p className="eyebrow">Work from Farm / Vinyasa Earth</p>
      <h1 id="farm-booking-heading">Plan your Work from Farm stay</h1>
      <p>A change of scene for your workday. Find your stay, see the price and enquire in two simple steps.</p>
    </header>
    <Suspense fallback={<p>Loading your stay options...</p>}>
      <FarmBooking offers={farmOffers(content.stays)} meals={content.meals} taxNote={content.text_13} />
    </Suspense>
    <p className={styles.footerNote}><FormattedText value={content.location} /></p>
  </section>;
}
