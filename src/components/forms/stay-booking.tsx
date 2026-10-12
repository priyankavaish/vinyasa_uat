"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import FormattedText from "@/components/editorial/formatted-text";
import Image from "@/components/editorial/image";
import type { Cottage } from "@/lib/content";
import StayEnquiryForm, { type StayEnquiryContent } from "./stay-enquiry-form";
import SuccessDialog from "./success-dialog";
import styles from "@/app/(site)/book/booking.module.css";

export type StayBookingContent = StayEnquiryContent & {
  searchTitle: string; checkInLabel: string; checkOutLabel: string; adultsLabel: string; childrenLabel: string; roomsLabel: string;
  searchButton: string; resultsTitle: string; resultsSearchedTitle: string; noResults: string;
  availableLabel: string; soldOutLabel: string; enquireLabel: string; guestsUnit: string;
  enquiryTitle: string; enquiryText: string;
};

const inputClass = "mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent";
const labelClass = "block text-xs tracking-[0.08em] uppercase text-foreground-soft";

function priceText(stay: Cottage) {
  if (!stay.pricePerNight) return "";
  return `₹${stay.pricePerNight.toLocaleString("en-IN")} ${stay.slug === "dorm" ? "per bed per night" : "per night"}`;
}

export default function StayBooking({ cottages, content, aside }: { cottages: Cottage[]; content: StayBookingContent; aside?: ReactNode }) {
  const [search, setSearch] = useState({ checkIn: "", checkOut: "", adults: "2", children: "0", rooms: "1" });
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [thanks, setThanks] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (dialogOpen && !dlg.open) dlg.showModal();
    if (!dialogOpen && dlg.open) dlg.close();
  }, [dialogOpen]);
  const requestedSlug = useSearchParams().get("slug");
  const fromStay = cottages.find(stay => stay.slug === requestedSlug);
  // The enquiry form only opens when someone arrives from a stay page's "Check availability",
  // or picks "Enquire" on one of the stays listed here.
  const [selected, setSelected] = useState<{ stay: string; key: number } | null>(fromStay ? { stay: fromStay.name, key: 0 } : null);
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const guests = Number(search.adults || 0) + Number(search.children || 0);
  const rooms = Math.max(1, Number(search.rooms || 1));
  const results = useMemo(() => cottages
    .filter(stay => !searched || (stay.maxGuests || 99) * rooms >= guests)
    .map(stay => ({ stay, soldOut: stay.quantity === 0 })), [cottages, searched, guests, rooms]);

  function set<K extends keyof typeof search>(key: K, value: string) { setSearch(current => ({ ...current, [key]: value })); }

  function runSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!search.checkIn) return setError("Please choose a check-in date.");
    if (search.checkIn < today) return setError("Check-in date cannot be in the past.");
    if (!search.checkOut) return setError("Please choose a check-out date.");
    if (search.checkOut <= search.checkIn) return setError("Check-out must be after check-in.");
    if (guests < 1) return setError("Please add at least one guest.");
    setError("");
    setSearched(true);
    const fitting = cottages.filter(stay => (stay.maxGuests || 99) * rooms >= guests && stay.quantity !== 0);
    openForm((fitting[0] ?? cottages[0])?.name);
  }

  function openForm(stayName?: string) {
    setSelected({ stay: stayName ?? "", key: Date.now() });
    setDialogOpen(true);
  }

  function enquire(stay: Cottage) { openForm(stay.name); }

  const enquirySection = (
      <section id="stay-enquiry" className={`${styles.form} scroll-mt-28`} aria-labelledby="stay-enquiry-title">
      <h2 id="stay-enquiry-title" className="font-display text-2xl"><FormattedText value={content.enquiryTitle} /></h2>
      <p className="mb-5 mt-2 text-sm text-foreground-soft"><FormattedText value={content.enquiryText} /></p>
      <StayEnquiryForm
        key={selected?.key ?? 0}
        cottages={cottages}
        content={content}
        prefill={{ stayType: selected?.stay, checkInDate: search.checkIn, checkOutDate: search.checkOut, guests: searched || selected ? String(guests) : "", rooms: search.rooms }}
      />
    </section>
  );

  return <>
    <div className="min-w-0 space-y-8 max-lg:order-2">
      {selected && fromStay && enquirySection}
      {!fromStay && <section aria-labelledby="stay-results-title">
        <h2 id="stay-results-title" className="font-display text-2xl leading-8"><FormattedText value={searched ? content.resultsSearchedTitle : content.resultsTitle} /></h2>
        {results.length === 0
          ? <p className="mt-4 border border-line bg-surface p-5 text-sm text-foreground-soft"><FormattedText value={content.noResults} /></p>
          : <ul className="mt-5 grid gap-4">
            {results.map(({ stay, soldOut }) => <li key={stay.slug} className="grid gap-4 border border-line bg-surface p-4 sm:grid-cols-[180px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden bg-clay-surface sm:aspect-auto sm:min-h-[130px]">
                {stay.image && <Image src={stay.image} alt={stay.name} fill sizes="(min-width: 640px) 180px, 90vw" className="object-cover" />}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl italic"><FormattedText value={stay.name} links={false} /></h3>
                  <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${soldOut ? "text-muted" : "text-secondary"}`}>{soldOut ? content.soldOutLabel : content.availableLabel}</span>
                </div>
                <p className="mt-1 text-xs text-foreground-soft">
                  <FormattedText value={stay.tagline} links={false} />{stay.maxGuests ? <> · {stay.maxGuests} {content.guestsUnit}</> : null}
                </p>
                {priceText(stay) && <p className="mt-2 text-sm font-semibold">{priceText(stay)} <span className="font-normal text-muted">+ 18% GST</span></p>}
                <button type="button" onClick={() => enquire(stay)} disabled={soldOut} className="btn btn-accent mt-4 self-start disabled:opacity-50">{content.enquireLabel}</button>
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
        <button type="submit" className="btn btn-accent mt-5 w-full"><FormattedText value={content.searchButton} links={false} /></button>
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
            <h2 className="font-display text-2xl"><FormattedText value={content.enquiryTitle} /></h2>
            <p className="mt-2 text-sm text-foreground-soft"><FormattedText value={content.enquiryText} /></p>
          </div>
          <button type="button" onClick={() => setDialogOpen(false)} aria-label={content.closeLabel} className="grid h-9 w-9 shrink-0 place-items-center border border-line text-foreground-soft transition-colors hover:border-accent hover:text-accent">&times;</button>
        </div>
        <StayEnquiryForm
          key={selected?.key ?? 0}
          cottages={cottages}
          content={content}
          prefill={{ stayType: selected?.stay, checkInDate: search.checkIn, checkOutDate: search.checkOut, guests: searched || selected ? String(guests) : "", rooms: search.rooms }}
          onSaved={() => { setDialogOpen(false); setThanks(true); }}
        />
      </div>}
    </dialog>
    <SuccessDialog open={thanks} onClose={() => setThanks(false)} closeLabel={content.closeLabel}>
      <h3 className="font-display text-3xl"><FormattedText value={content.successTitle} /></h3>
      <p className="mt-4 leading-7 text-foreground-soft"><FormattedText value={content.successMessage} /></p>
    </SuccessDialog>
  </>;
}
