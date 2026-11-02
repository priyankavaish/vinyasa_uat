"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import FormattedText from "@/components/editorial/formatted-text";
import Image from "@/components/editorial/image";
import type { Cottage } from "@/lib/content";
import type { StayEnquiryContent } from "./stay-enquiry-form";
import BookingForm from "./booking-form";
import FormLoader from "./form-loader";
import styles from "@/app/(site)/book/booking.module.css";

export type StayBookingContent = StayEnquiryContent & {
  searchTitle: string; checkInLabel: string; checkOutLabel: string; adultsLabel: string; childrenLabel: string; roomsLabel: string;
  searchButton: string; resultsTitle: string; resultsSearchedTitle: string; noResults: string;
  availableLabel: string; soldOutLabel: string; whatsappLabel: string; whatsappMessage: string; guestsUnit: string;
  enquiryTitle: string; enquiryText: string;
};

const inputClass = "mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent";
const labelClass = "block text-xs tracking-[0.08em] uppercase text-foreground-soft";
const BOOK_TITLE = "Book your stay";
const BOOK_TEXT = "Choose your dates and pay securely online to confirm. Prices exclude 5% GST, added at checkout.";

function priceText(stay: Cottage) {
  if (!stay.pricePerNight) return "";
  return `₹${stay.pricePerNight.toLocaleString("en-IN")} ${stay.slug === "dorm" ? "per bed per night" : "per night"}`;
}

export default function StayBooking({ cottages, content, aside }: { cottages: Cottage[]; content: StayBookingContent; aside?: ReactNode }) {
  const [search, setSearch] = useState({ checkIn: "", checkOut: "", adults: "2", children: "0", rooms: "1" });
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  // Units still free per stay for the searched nights (null = no stock limit set).
  const [left, setLeft] = useState<Record<string, number | null> | null>(null);
  const [checking, setChecking] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (dialogOpen && !dlg.open) dlg.showModal();
    if (!dialogOpen && dlg.open) dlg.close();
  }, [dialogOpen]);
  const requestedSlug = useSearchParams().get("slug");
  const fromStay = cottages.find(stay => stay.slug === requestedSlug);
  // The booking form opens inline when someone arrives from a stay page's "Check availability",
  // or in a dialog when they pick "Book now" on one of the stays listed here.
  const [selected, setSelected] = useState<{ stay: string; key: number } | null>(fromStay ? { stay: fromStay.slug, key: 0 } : null);
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const guests = Number(search.adults || 0) + Number(search.children || 0);
  const rooms = Math.max(1, Number(search.rooms || 1));
  const results = useMemo(() => cottages
    .filter(stay => !searched || (stay.maxGuests || 99) * rooms >= guests)
    .map(stay => {
      const unitsLeft = left?.[stay.slug] ?? null;
      return { stay, unitsLeft, soldOut: stay.quantity === 0 || unitsLeft === 0 };
    }), [cottages, searched, guests, rooms, left]);

  function set<K extends keyof typeof search>(key: K, value: string) { setSearch(current => ({ ...current, [key]: value })); }

  async function runSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!search.checkIn) return setError("Please choose a check-in date.");
    if (search.checkIn < today) return setError("Check-in date cannot be in the past.");
    if (!search.checkOut) return setError("Please choose a check-out date.");
    if (search.checkOut <= search.checkIn) return setError("Check-out must be after check-in.");
    if (guests < 1) return setError("Please add at least one guest.");
    setError("");
    setSearched(true);
    setChecking(true);
    try {
      const res = await fetch(`/api/stays/availability?checkIn=${search.checkIn}&checkOut=${search.checkOut}`, { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? "Could not check availability. Please try again.");
      setLeft(body.left);
    } catch (failure) {
      setLeft(null);
      setError(failure instanceof Error ? failure.message : "Could not check availability. Please try again.");
    } finally { setChecking(false); }
  }

  function openForm(stay: Cottage) {
    setSelected({ stay: stay.slug, key: Date.now() });
    setDialogOpen(true);
  }

  const bookingFormFor = (slug?: string) => <BookingForm
    key={selected?.key ?? 0}
    mode="stay"
    cottages={cottages}
    prefill={{ slug, checkIn: searched ? search.checkIn : undefined, checkOut: searched ? search.checkOut : undefined, guests: searched ? guests : undefined, rooms: searched ? rooms : undefined }}
  />;

  const bookingSection = (
    <section id="stay-enquiry" className={`${styles.form} scroll-mt-28`} aria-labelledby="stay-booking-title">
      <h2 id="stay-booking-title" className="sr-only">{BOOK_TITLE}</h2>
      {bookingFormFor(fromStay?.slug)}
    </section>
  );

  return <>
    <FormLoader active={checking} label="Checking availability…" />
    <div className="min-w-0 space-y-8 max-lg:order-2">
      {fromStay && bookingSection}
      {!fromStay && <section aria-labelledby="stay-results-title">
        <h2 id="stay-results-title" className="font-display text-2xl leading-8"><FormattedText value={searched ? content.resultsSearchedTitle : content.resultsTitle} /></h2>
        {results.length === 0
          ? <p className="mt-4 border border-line bg-surface p-5 text-sm text-foreground-soft"><FormattedText value={content.noResults} /></p>
          : <ul className="mt-5 grid gap-4">
            {results.map(({ stay, soldOut, unitsLeft }) => <li key={stay.slug} className="grid gap-4 border border-line bg-surface p-4 sm:grid-cols-[180px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden bg-clay-surface sm:aspect-auto sm:min-h-[130px]">
                {stay.image && <Image src={stay.image} alt={stay.name} fill sizes="(min-width: 640px) 180px, 90vw" className="object-cover" />}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl italic"><FormattedText value={stay.name} links={false} /></h3>
                  <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${soldOut ? "text-muted" : "text-secondary"}`}>
                    {soldOut ? (searched ? "Not available for these dates" : "Currently not available") : unitsLeft !== null && unitsLeft <= 3 ? `Only ${unitsLeft} left` : content.availableLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground-soft">
                  <FormattedText value={stay.tagline} links={false} />{stay.maxGuests ? <> · {stay.maxGuests} {content.guestsUnit}</> : null}
                </p>
                {priceText(stay) && <p className="mt-2 text-sm font-semibold">{priceText(stay)} <span className="font-normal text-muted">+ 5% GST</span></p>}
                <button type="button" disabled={soldOut} onClick={() => openForm(stay)} className="btn btn-accent mt-4 inline-flex! flex-row items-center gap-2 self-start disabled:opacity-50">
                  {soldOut ? "Currently not available" : "Book now"}<Icon name="arrow-forward-outline" size={16} />
                </button>
              </div>
            </li>)}
          </ul>}
      </section>}
    </div>

    <div className={`space-y-6 max-lg:order-1 lg:sticky lg:top-28 lg:self-start ${fromStay ? "" : "lg:mt-[3.25rem]"}`}>
      {!fromStay && <form onSubmit={runSearch} noValidate className="border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-2xl text-accent"><FormattedText value={content.searchTitle} /></h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="search-in" className={labelClass}><FormattedText value={content.checkInLabel} links={false} /></label>
            <input id="search-in" type="date" min={today} value={search.checkIn} onChange={e => set("checkIn", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="search-out" className={labelClass}><FormattedText value={content.checkOutLabel} links={false} /></label>
            <input id="search-out" type="date" min={search.checkIn || today} value={search.checkOut} onChange={e => set("checkOut", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="search-adults" className={labelClass}><FormattedText value={content.adultsLabel} links={false} /></label>
              <select id="search-adults" value={search.adults} onChange={e => set("adults", e.target.value)} className={inputClass}>{Array.from({ length: 20 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}</select>
            </div>
            <div>
              <label htmlFor="search-children" className={labelClass}><FormattedText value={content.childrenLabel} links={false} /></label>
              <select id="search-children" value={search.children} onChange={e => set("children", e.target.value)} className={inputClass}>{Array.from({ length: 11 }, (_, i) => i).map(n => <option key={n} value={n}>{n}</option>)}</select>
            </div>
          </div>
          <div>
            <label htmlFor="search-rooms" className={labelClass}><FormattedText value={content.roomsLabel} links={false} /></label>
            <select id="search-rooms" value={search.rooms} onChange={e => set("rooms", e.target.value)} className={inputClass}>{Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}</select>
          </div>
        </div>
        {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
        <button type="submit" disabled={checking} className="btn btn-accent mt-5 w-full disabled:opacity-60"><FormattedText value={checking ? "Checking availability…" : content.searchButton} links={false} /></button>
      </form>}
      {aside}
    </div>

    <dialog
      ref={dialogRef}
      onClose={() => setDialogOpen(false)}
      onClick={(e) => { if (e.target === dialogRef.current) setDialogOpen(false); }}
      className="m-auto w-[min(94vw,46rem)] max-h-[92vh] border border-line bg-surface p-0 text-foreground shadow-[0_40px_100px_-30px_rgba(35,25,15,0.5)] backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      {dialogOpen && <div className="max-h-[92vh] overflow-y-auto p-5 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">{BOOK_TITLE}</h2>
            <p className="mt-2 text-sm text-foreground-soft">{BOOK_TEXT}</p>
          </div>
          <button type="button" onClick={() => setDialogOpen(false)} aria-label={content.closeLabel} className="grid h-9 w-9 shrink-0 place-items-center border border-line text-foreground-soft transition-colors hover:border-accent hover:text-accent">&times;</button>
        </div>
        {bookingFormFor(selected?.stay)}
      </div>}
    </dialog>
  </>;
}
