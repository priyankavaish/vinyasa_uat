"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormattedText from "@/components/editorial/formatted-text";
import { plainText } from "@/lib/editorial/text";
import { Icon, type IconName } from "@/components/ui/icon";
import SuccessDialog from "./success-dialog";
import { farmMoney, farmNights, farmQuote, farmToday, farmUnit, type FarmOffer } from "@/lib/work-from-farm";
import styles from "@/app/(site)/work-from-farm/book/farm-booking.module.css";

const displayDate = (value: string) => value ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T00:00:00Z")) : "";

export default function FarmBooking({ offers, meals, taxNote }: { offers: FarmOffer[]; meals: { label: string; price: string }[]; taxNote: string }) {
  const requested = useSearchParams().get("stay");
  const [stayId, setStayId] = useState(() => offers.find(offer => offer.id === requested)?.id || offers[0]?.id || "");
  const [dates, setDates] = useState({ checkIn: "", checkOut: "", guests: "1", cottages: "1" });
  const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "" });
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const today = useMemo(farmToday, []);
  const offer = offers.find(item => item.id === stayId);
  const unit = offer ? farmUnit(offer) : null;
  const nights = farmNights(dates.checkIn, dates.checkOut);
  const quote = offer ? farmQuote(offer, nights, Number(dates.guests), Number(dates.cottages)) : null;
  const minCottages = Math.max(1, Math.ceil(Number(dates.guests || 1) / 2));
  const minCheckout = dates.checkIn ? new Date(Date.parse(dates.checkIn + "T00:00:00Z") + 86400000).toISOString().slice(0, 10) : today;
  const update = (field: keyof typeof dates, value: string) => setDates(old => ({
    ...old, [field]: value,
    ...(field === "checkIn" && old.checkOut <= value ? { checkOut: "" } : {}),
    ...(field === "guests" ? { cottages: String(Math.max(Number(old.cottages || 1), Math.ceil(Number(value || 1) / 2))) } : {}),
  }));
  const changeStep = (next: number) => {
    setError("");
    setStep(next);
    requestAnimationFrame(() => {
      stepHeading.current?.focus({ preventScroll: true });
      stepHeading.current?.scrollIntoView({ block: "start" });
    });
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!offer) return setError("Please select an accommodation option.");
    if (!nights || dates.checkIn < today) return setError("Please choose a valid check-in and check-out date.");
    if (unit === "cottage" && Number(dates.cottages) < minCottages) return setError("Please add enough cottages for your guests. Each cottage accommodates up to two people.");
    if (step === 1) { changeStep(2); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "work-from-farm", farmStayId: offer.id, checkInDate: dates.checkIn, checkOutDate: dates.checkOut,
          guests: dates.guests, rooms: dates.cottages, ...contact,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(Object.values(result.fieldErrors || {}).flat().join(" ") || result.error || "We could not send your enquiry. Please try again.");
      setSuccess(true);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Please try again."); }
    finally { setBusy(false); }
  }

  if (!offers.length) return <p className={styles.panel}>Work from Farm accommodation is being updated. Please contact Vinyasa Earth to plan your stay.</p>;

  return <>
    <nav className={styles.steps} aria-label="Enquiry progress">
      <button type="button" disabled={step === 1 || busy} onClick={() => changeStep(1)} aria-current={step === 1 ? "step" : undefined}><span>{step === 2 ? "✓" : "1"}</span> Stay &amp; dates</button>
      <span className={styles.stepLine} />
      <span aria-current={step === 2 ? "step" : undefined}><span>2</span> Your details</span>
    </nav>
    <form id="farm-enquiry" onSubmit={submit} className={styles.layout} data-step={step} aria-label="Work from Farm enquiry">
      <section className={styles.panel} aria-labelledby="farm-step-title">
        <div className={styles.panelHeading}>
          <p className={styles.stepLabel}>Step {step} of 2</p>
          <h2 id="farm-step-title" ref={stepHeading} tabIndex={-1}>{step === 1 ? "Make yourself at home" : "How can we reach you?"}</h2>
          <p>{step === 1 ? "Pick a stay and choose the dates that work for you." : "We'll get in touch to confirm availability for your stay."}</p>
        </div>
        {step === 1 ? <>
          <fieldset className={styles.accommodation}>
            <legend>Choose your accommodation</legend>
            <div className={styles.offerGrid}>{offers.map(item => {
              const itemQuote = farmQuote(item, nights, Number(dates.guests), Number(dates.cottages));
              return <label key={item.id} className={styles.offer} data-selected={item.id === stayId}>
                <input type="radio" name="farmStay" value={item.id} checked={stayId === item.id} onChange={() => setStayId(item.id)} required aria-label={plainText(item.name)} />
                <Icon name={item.icon as IconName} size={25} />
                <span className={styles.offerName}><FormattedText value={item.name} /></span>
                <span className={styles.offerRate}>{itemQuote ? <>{farmMoney(itemQuote.rate)} <span>/ {itemQuote.unit} / night</span></> : <FormattedText value={item.rows[0]?.price || "Rate on enquiry"} />}</span>
              </label>;
            })}</div>
            {offer && <details key={offer.id} className={styles.details}>
              <summary>About this stay &amp; all rates</summary>
              <p><FormattedText value={offer.description} /></p>
              <dl className={styles.rateList}>{offer.rows.map((row, index) => <div key={index}><dt><FormattedText value={row.label} /></dt><dd><FormattedText value={row.price} /></dd></div>)}</dl>
              <p><FormattedText value={taxNote} /></p>
            </details>}
          </fieldset>
          <fieldset className={styles.dateSection}>
            <legend>Your dates &amp; guests</legend>
            <div className={styles.fields}>
              <label>Check-in<input type="date" required min={today} value={dates.checkIn} onChange={event => update("checkIn", event.target.value)} /></label>
              <label>Check-out<input type="date" required min={minCheckout} value={dates.checkOut} onChange={event => update("checkOut", event.target.value)} /></label>
              <label>Number of guests<input type="number" min={1} max={50} required value={dates.guests} onChange={event => update("guests", event.target.value)} /></label>
              {unit === "cottage" && <label>Number of cottages<input type="number" min={minCottages} max={50} required value={dates.cottages} onChange={event => update("cottages", event.target.value)} /><span>Up to two guests per cottage.</span></label>}
            </div>
            <p className={styles.note}>Longer stay? Your rate adjusts automatically.</p>
          </fieldset>
        </> : <fieldset disabled={busy} className={styles.contact}>
          <legend className="sr-only">Your contact details</legend>
          <div className={styles.fields}>
            <label className={styles.full}>Name<input name="name" required minLength={2} maxLength={121} autoComplete="name" value={contact.name} onChange={event => setContact({ ...contact, name: event.target.value })} /></label>
            <label>Email<input name="email" type="email" required maxLength={150} autoComplete="email" value={contact.email} onChange={event => setContact({ ...contact, email: event.target.value })} /></label>
            <label>WhatsApp / phone number<input name="phone" type="tel" required minLength={7} maxLength={20} autoComplete="tel" value={contact.phone} onChange={event => setContact({ ...contact, phone: event.target.value })} /></label>
          </div>
          <details className={styles.details} open={contact.message ? true : undefined}>
            <summary>Add a note (optional)</summary>
            <label className={styles.message}>Anything you'd like us to know?<textarea name="message" rows={3} maxLength={6000} value={contact.message} onChange={event => setContact({ ...contact, message: event.target.value })} /></label>
          </details>
        </fieldset>}
      </section>

      <aside className={styles.summary} aria-labelledby="farm-estimate-title">
        <div className={styles.summaryHeading}><h2 id="farm-estimate-title">Your stay at a glance</h2>{step === 2 && <button type="button" onClick={() => changeStep(1)} disabled={busy}>Edit stay</button>}</div>
        <p className={styles.selectedName}>{offer && <FormattedText value={offer.name} />}</p>
        {nights > 0 && <p className={styles.stayDates}>{displayDate(dates.checkIn)} – {displayDate(dates.checkOut)}<br />{nights} {nights === 1 ? "night" : "nights"} · {dates.guests} {dates.guests === "1" ? "guest" : "guests"}{unit === "cottage" ? " · " + dates.cottages + (dates.cottages === "1" ? " cottage" : " cottages") : ""}</p>}
        <div aria-live="polite" aria-atomic="true" data-farm-quote className={styles.quote}>
          {quote ? <>
            <p className={styles.totalLabel}>Estimated total <span>including 18% GST</span></p>
            <p className={styles.amount}>{farmMoney(quote.totalAmount)}</p>
            <p className={styles.rate}>{farmMoney(quote.rate)} / {quote.unit} / night</p>
            <details className={styles.details}>
              <summary>Price breakdown</summary>
              <dl className={styles.rateList}>
                <div><dt>{nights} nights × {quote.units} {quote.unit}{quote.units === 1 ? "" : "s"}</dt><dd>{farmMoney(quote.baseAmount)}</dd></div>
                <div><dt>GST (18%)</dt><dd>{farmMoney(quote.gstAmount)}</dd></div>
              </dl>
            </details>
          </> : <p className={styles.prompt}>{nights ? "Our team will confirm the rate for your selected stay." : "Add your dates to see your total."}</p>}
        </div>
        {meals.length > 0 ? <details className={styles.details}><summary>Meals &amp; prices (optional)</summary><p className={styles.note}>Meals are optional and charged separately.</p><dl className={styles.rateList}>{meals.map((meal, index) => <div key={index}><dt><FormattedText value={meal.label} /></dt><dd><FormattedText value={meal.price} /></dd></div>)}</dl></details> : <p className={styles.note}>Meals are optional and charged separately.</p>}
      </aside>

      <div className={styles.actions}>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.actionButtons}>
          {step === 2 && <button type="button" className={styles.backButton} disabled={busy} onClick={() => changeStep(1)}>Back</button>}
          <button type="submit" disabled={busy} className="btn btn-accent">{step === 1 ? "Continue to your details" : busy ? "Sending enquiry..." : "Enquire about availability"}</button>
        </div>
        <p className={styles.note}>{step === 1 ? "No payment needed. This is an availability enquiry." : "Our team will confirm availability and help you complete your booking."}</p>
      </div>
    </form>
    <SuccessDialog open={success} onClose={() => setSuccess(false)}>
      <h2 className="font-display text-3xl">Thank you for your Work from Farm enquiry.</h2>
      <p className="mt-4 leading-7 text-foreground-soft">Our team will get in touch about your dates, accommodation and Work from Farm rates.</p>
    </SuccessDialog>
  </>;
}
