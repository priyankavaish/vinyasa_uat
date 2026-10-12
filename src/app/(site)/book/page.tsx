
import FormattedText from "@/components/editorial/formatted-text";
import { pageSeoMetadata } from "@/lib/editorial/seo";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__book_page";
import { getEditorial } from "@/lib/editorial/server";
import { Suspense } from "react";
import StayBooking from "@/components/forms/stay-booking";
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
      <div className={styles.intro}><p className="eyebrow"><FormattedText value={content.eyebrow_1} /> &middot; Vinyasa Earth</p><h1 id="booking-heading" className="font-display"><FormattedText value={content.title_2} /></h1><p><FormattedText value={content.intro} /></p></div>
      <div className={styles.location}>
        <div><p>Maheshwas &middot; Jaipur</p><span>Mudhouses &middot; Tents &middot; Dorms</span></div>
      </div>
    </div>
    <div className={styles.layout}>
      <Suspense fallback={<p className="text-sm text-foreground-soft">Loading booking form...</p>}>
        <StayBooking cottages={cottages} content={{
          nameLabel: content.nameLabel, guestsLabel: content.guestsLabel, stayTypeLabel: content.stayTypeLabel, dateLabel: content.dateLabel,
          phoneLabel: content.phoneLabel, phoneHint: content.phoneHint, emailLabel: content.emailLabel,
          reserveLabel: content.reserveLabel, reserveOptions: content.reserveOptions,
          intentionLabel: content.intentionLabel, intentionOptions: content.intentionOptions,
          submitLabel: content.submitLabel, sendingLabel: content.sendingLabel,
          successTitle: content.successTitle, successMessage: content.successMessage, closeLabel: content.closeLabel,
          searchTitle: content.searchTitle, checkInLabel: content.checkInLabel, checkOutLabel: content.checkOutLabel,
          adultsLabel: content.adultsLabel, childrenLabel: content.childrenLabel, roomsLabel: content.roomsLabel,
          searchButton: content.searchButton, resultsTitle: content.resultsTitle, resultsSearchedTitle: content.resultsSearchedTitle,
          noResults: content.noResults, availableLabel: content.availableLabel, soldOutLabel: content.soldOutLabel,
          enquireLabel: content.enquireLabel, guestsUnit: content.guestsUnit, enquiryTitle: content.enquiryTitle, enquiryText: content.enquiryText,
        }} />
      </Suspense>
    </div>
  </section>;
}
