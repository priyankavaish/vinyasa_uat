"use client";
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_forms_booking_form";
import { useEditorial } from "@/components/editorial/provider";


import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import { PAYMENT_MESSAGES } from "@/lib/payment-messages";
import SuccessDialog from "./success-dialog";
import TermsDialog from "./terms-dialog";
import FormLoader from "./form-loader";
import {
  cottages as seedCottages,
  events as seedEvents,
  type Cottage,
  type EventProgram,
} from "@/lib/content";
import { bookingPrice, gstPercentFor } from "@/lib/booking-pricing";
import { isStaySoldOut } from "@/lib/stay-stock";
import { bookingRequestSchema, type BookingRequest } from "@/lib/schemas";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; close: () => void; on: (event: "payment.failed", callback: (response?: { error?: { description?: string } }) => void) => void };
  }
}

type Status = "idle" | "creating-booking" | "awaiting-payment" | "verifying" | "success" | "error";

function nightsBetween(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function BookingForm({
  cottages = seedCottages,
  events = seedEvents,
  mode = "stay",
  prefill,
}: {
  cottages?: Cottage[];
  events?: EventProgram[];
  mode?: "stay" | "event";
  prefill?: { slug?: string; checkIn?: string; checkOut?: string; guests?: number; rooms?: number };
}) {
  const content = useEditorial("components/forms/booking-form", editorialDefaults);

  const searchParams = useSearchParams();
  const initialType = mode;
  const options = mode === "stay" ? cottages : events;
  const requestedSlug = prefill?.slug ?? searchParams.get("slug");
  const initialSlug = options.find(item => item.slug === requestedSlug)?.slug ?? options[0]?.slug ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [errorTitle, setErrorTitle] = useState<string>(PAYMENT_MESSAGES.failed.title);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ id: string; email: string; name: string; dates: string; total: number } | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogClosed, setDialogClosed] = useState(false);
  // Both boxes start unticked and must be ticked before payment; the server stores the acceptance time.
  const [acceptWay, setAcceptWay] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptAttempted, setAcceptAttempted] = useState(false);
  const [openDialog, setOpenDialog] = useState<"way" | "policy" | null>(null);
  const [mockPayment, setMockPayment] = useState<{ resolve: (outcome: "success" | "failed" | "cancelled") => void } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingRequest>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      type: initialType,
      itemSlug: initialSlug,
      guests: prefill?.guests ?? 2,
      rooms: prefill?.rooms ?? 1,
      checkIn: prefill?.checkIn ?? "",
      checkOut: prefill?.checkOut ?? "",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
    },
  });

  const type = watch("type");
  const itemSlug = watch("itemSlug");
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const rooms = Math.max(1, Number(watch("rooms")) || 1);
  const [left, setLeft] = useState<number | null | undefined>(undefined);
  const todayIso = useMemo(() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; }, []);

  const item = useMemo(() => {
    if (type === "stay") return cottages.find((c) => c.slug === itemSlug) ?? cottages[0];
    return events.find((e) => e.slug === itemSlug) ?? events[0];
  }, [type, itemSlug, cottages, events]);

  // Live stock for the chosen nights: paid bookings and fresh unpaid holds already count against it.
  useEffect(() => {
    if (type !== "stay" || !checkIn || !checkOut || checkOut <= checkIn) { setLeft(undefined); return; }
    const controller = new AbortController();
    fetch(`/api/stays/availability?checkIn=${checkIn}&checkOut=${checkOut}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setLeft(data.left?.[itemSlug] ?? null))
      .catch(() => { if (!controller.signal.aborted) setLeft(undefined); });
    return () => controller.abort();
  }, [type, itemSlug, checkIn, checkOut]);
  const soldOut = type === "stay" && (isStaySoldOut(cottages.find((c) => c.slug === itemSlug)) || left === 0);
  const notEnoughLeft = type === "stay" && typeof left === "number" && left > 0 && rooms > left;

  const baseAmount = useMemo(() => {
    if (!item) return 0;
    if (type === "stay" && "pricePerNight" in item) {
      const nights = nightsBetween(checkIn, checkOut) || 1;
      return item.pricePerNight * nights * rooms;
    }
    if ("priceFrom" in item) return item.priceFrom;
    return 0;
  }, [type, item, checkIn, checkOut, rooms]);

  const gstPercent = gstPercentFor(type);
  const pricing = bookingPrice(baseAmount, gstPercent);
  const amount = pricing.totalAmount;
  const money = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  async function onSubmit(values: BookingRequest) {
    if (soldOut || notEnoughLeft || !item) return;
    if (!acceptWay || !acceptTerms) {
      setAcceptAttempted(true);
      document.getElementById(!acceptWay ? "accept-way" : "accept-terms")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStatus("creating-booking");
    setErrorMessage(null);
    setErrorTitle(PAYMENT_MESSAGES.failed.title);
    setErrorDialogOpen(false);
    setDialogClosed(false);
    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, amount, acceptGuidelines: true, acceptTerms: true }),
      });
      if (!bookingRes.ok) {
        const body = await bookingRes.json().catch(() => ({}));
        throw new Error(body?.error ?? "Could not create the booking. Please try again.");
      }
      const { booking, order } = await bookingRes.json();
      // Tell the server the payment did not happen so the stay is released and the team can follow up.
      const reportFailure = (reason: "cancelled" | "failed", detail?: string) => {
        void fetch(`/api/bookings/${booking.id}/fail`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason, detail }), keepalive: true }).catch(() => {});
      };

      setStatus("awaiting-payment");

      let checkoutPhase: "waiting" | "verifying" | "success" | "failed" = "waiting";
      async function verify(payload: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        checkoutPhase = "verifying";
        setStatus("verifying");
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: booking.id, ...payload }),
          });
          if (!verifyRes.ok) throw new Error("Payment could not be verified.");
          checkoutPhase = "success";
          setStatus("success");
          setConfirmed({
            id: booking.id, email: values.guestEmail, total: amount, name: item.name,
            dates: values.type === "stay" ? `${values.checkIn} to ${values.checkOut}` : values.eventDate ?? "",
          });
        } catch (err) {
          setStatus("error");
          setErrorTitle(PAYMENT_MESSAGES.unverified.title);
          setErrorMessage(PAYMENT_MESSAGES.unverified.message);
          setErrorDialogOpen(true);
        }
      }

      if (order.mock) {
        // No real Razorpay key configured (local/demo only): show a stand-in payment window so the
        // whole flow, including the failure path, can be tried without Razorpay.
        const outcome = await new Promise<"success" | "failed" | "cancelled">(resolve => setMockPayment({ resolve }));
        setMockPayment(null);
        if (outcome !== "success") {
          reportFailure(outcome);
          setStatus("error");
          setErrorTitle(outcome === "failed" ? PAYMENT_MESSAGES.failed.title : PAYMENT_MESSAGES.cancelled.title);
          setErrorMessage(outcome === "failed" ? PAYMENT_MESSAGES.failed.message : PAYMENT_MESSAGES.cancelled.message);
          setErrorDialogOpen(true);
          return;
        }
        await verify({
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock",
        });
        return;
      }

      if (!window.Razorpay) throw new Error("Payment checkout could not load. Please refresh and try again.");
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: order.amount,
        currency: order.currency,
        name: "Vinyasa Earth",
        description: `${item.name} booking`,
        order_id: order.id,
        prefill: { name: values.guestName, email: values.guestEmail, contact: values.guestPhone },
        theme: { color: "#8f3b31" },
        handler: (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          void verify(response);
        },
        retry: { enabled: false },
        modal: {
          ondismiss: () => {
            if (checkoutPhase !== "waiting") return;
            reportFailure("cancelled");
            setStatus("error");
            setErrorTitle(PAYMENT_MESSAGES.cancelled.title);
            setErrorMessage(PAYMENT_MESSAGES.cancelled.message);
            setErrorDialogOpen(true);
          },
        },
      });
      rzp.on("payment.failed", (response?: { error?: { description?: string } }) => {
        if (checkoutPhase !== "waiting") return;
        checkoutPhase = "failed";
        reportFailure("failed", response?.error?.description);
        rzp.close();
        setStatus("error");
        setErrorTitle(PAYMENT_MESSAGES.failed.title);
        setErrorMessage(PAYMENT_MESSAGES.failed.message);
        setErrorDialogOpen(true);
      });
      rzp.open();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setErrorDialogOpen(true);
    }
  }

  const submitting = status === "creating-booking" || status === "awaiting-payment" || status === "verifying";

  if (status === "success" && confirmed) {
    const summary = <>
      <p className="font-display italic text-3xl">Booking confirmed</p>
      <p className="mt-3 text-sm text-foreground-soft">Thank you! Your payment of ₹{confirmed.total.toLocaleString("en-IN")} was received for <strong>{confirmed.name}</strong>{confirmed.dates ? <> ({confirmed.dates})</> : null}.</p>
      <p className="mt-2 text-sm text-foreground-soft">A confirmation has been sent to <strong>{confirmed.email}</strong>.</p>
      <p className="mt-2 text-xs text-muted">Booking reference <span className="font-mono">{confirmed.id}</span></p>
    </>;
    return (
      <>
      <SuccessDialog open={!dialogClosed} onClose={() => setDialogClosed(true)}>{summary}</SuccessDialog>
      <div data-booking-complete className="border border-line bg-surface p-8 text-center sm:p-10">{summary}</div>
      </>
    );
  }

  return (
    <>
      <FormLoader active={status === "creating-booking" || status === "verifying"} label="Processing…" />
      <SuccessDialog open={!!mockPayment} onClose={() => mockPayment?.resolve("cancelled")}>
        <h3 className="font-display text-2xl">Test payment</h3>
        <p className="mt-3 text-sm text-foreground-soft">Razorpay keys are not configured, so this is a stand-in for the payment window. Total to pay: ₹{amount.toLocaleString("en-IN")}.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-accent" onClick={() => mockPayment?.resolve("success")}>Pay ₹{amount.toLocaleString("en-IN")} (success)</button>
          <button type="button" className="btn btn-outline" onClick={() => mockPayment?.resolve("failed")}>Simulate failure</button>
        </div>
      </SuccessDialog>
      <SuccessDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <h3 className="font-display text-3xl">{errorTitle}</h3>
        <p role="alert" className="mt-4 text-sm text-foreground-soft">{errorMessage}</p>
      </SuccessDialog>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_6} /></label>
            <select
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("type")}
            >
              {mode === "stay" ? <option value="stay">{content.text_7 === "Mudhouse stay" ? "Stay" : content.text_7}</option> : <option value="event">{content.text_8}</option>}
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft">
              <FormattedText value={type === "stay" ? (content.text_9 === "Mudhouse" ? "Stay option" : content.text_9) : content.text_10} />
            </label>
            <select
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("itemSlug")}
            >
              {(type === "stay" ? cottages : events).map((i) => (
                <option key={i.slug} value={i.slug} disabled={type === "stay" && cottages.find((c) => c.slug === i.slug)?.quantity === 0}>
                  {i.name}{type === "stay" && cottages.find((c) => c.slug === i.slug)?.quantity === 0 ? " — Currently not available" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {type === "stay" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_11} /></label>
              <input
                type="date"
                min={todayIso}
                className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
                {...register("checkIn")}
              />
              {errors.checkIn && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.checkIn.message} /></p>}
            </div>
            <div>
              <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_12} /></label>
              <input
                type="date"
                min={checkIn || todayIso}
                className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
                {...register("checkOut")}
              />
              {errors.checkOut && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.checkOut.message} /></p>}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_13} /></label>
            <input
              type="date"
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("eventDate")}
            />
          </div>
        )}

        <div className={type === "stay" ? "grid gap-4 sm:grid-cols-2" : undefined}>
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_14} /></label>
            <input
              type="number"
              min={1}
              max={20}
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("guests")}
            />
            {errors.guests && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.guests.message} /></p>}
          </div>
          {type === "stay" && <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft">{itemSlug === "dorm" ? "Beds" : "Rooms / units"}</label>
            <input type="number" min={1} max={10} className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm" {...register("rooms")} />
            {errors.rooms && <p className="mt-1 text-xs text-red-700">{errors.rooms.message}</p>}
          </div>}
        </div>
        {type === "stay" && checkIn && checkOut && checkOut > checkIn && left !== undefined && left !== null && (
          <p role="status" className={"text-sm " + (soldOut || notEnoughLeft ? "text-red-700" : "text-secondary")}>
            {soldOut ? "Currently not available for these dates. Please choose other dates or another stay." : notEnoughLeft ? `Only ${left} left for these dates.` : `${left} available for these dates.`}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_15} /> <span className="text-accent" aria-hidden="true">*</span></label>
            <input
              required autoComplete="name"
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("guestName")}
            />
            {errors.guestName && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.guestName.message} /></p>}
          </div>
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_16} /> <span className="text-accent" aria-hidden="true">*</span></label>
            <input
              type="email" required autoComplete="email"
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("guestEmail")}
            />
            {errors.guestEmail && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.guestEmail.message} /></p>}
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_17} /> <span className="text-accent" aria-hidden="true">*</span></label>
          <input
            type="tel" required autoComplete="tel" inputMode="tel"
            className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
            {...register("guestPhone")}
          />
          {errors.guestPhone && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.guestPhone.message} /></p>}
        </div>

        <section aria-label="Agreements" className="space-y-4 border border-line bg-surface p-4 sm:p-6">
          <p className="text-sm text-foreground-soft">Please read the <button type="button" onClick={() => setOpenDialog("way")} className="font-semibold text-accent underline">{content.wayTitle}</button> and the <button type="button" onClick={() => setOpenDialog("policy")} className="font-semibold text-accent underline">{content.policyTitle}</button> before you book.</p>
          <label htmlFor="accept-way" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
            <input id="accept-way" type="checkbox" checked={acceptWay} onChange={e => setAcceptWay(e.target.checked)} aria-required="true" className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]" />
            <span>{content.wayCheckbox} <span className="text-accent" aria-hidden="true">*</span></span>
          </label>
          <label htmlFor="accept-terms" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
            <input id="accept-terms" type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} aria-required="true" className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]" />
            <span>{content.policyCheckbox} <span className="text-accent" aria-hidden="true">*</span></span>
          </label>
        </section>
        <TermsDialog open={openDialog === "way"} onClose={() => setOpenDialog(null)}>
          <section aria-labelledby="way-title">
            <h3 id="way-title" className="font-display text-2xl italic text-clay-ink">{content.wayTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-soft">{content.wayIntro}</p>
          <ol className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {content.wayItems.map(([title, text], index) => <li key={title} className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-accent text-[11px] font-semibold text-accent">{index + 1}</span>
              <div><p className="text-sm font-semibold text-foreground">{title}</p><p className="mt-1 text-sm leading-relaxed text-foreground-soft">{text}</p></div>
            </li>)}
          </ol>
          </section>
        </TermsDialog>
        <TermsDialog open={openDialog === "policy"} onClose={() => setOpenDialog(null)}>
          <section aria-labelledby="policy-title">
            <h3 id="policy-title" className="font-display text-2xl italic text-clay-ink">{content.policyTitle}</h3>
          <dl className="mt-3 space-y-3">
            {content.policyItems.map(([title, text]) => <div key={title}><dt className="text-sm font-semibold text-foreground">{title}</dt><dd className="mt-0.5 text-sm leading-relaxed text-foreground-soft">{text}</dd></div>)}
          </dl>
          </section>
        </TermsDialog>

        <div className="space-y-2 text-sm text-foreground-soft">{type === "stay" && item && "pricePerNight" in item && <div className="flex justify-between gap-4"><span>₹{item.pricePerNight.toLocaleString("en-IN")} × {nightsBetween(checkIn, checkOut) || 1} night{(nightsBetween(checkIn, checkOut) || 1) === 1 ? "" : "s"} × {rooms} {itemSlug === "dorm" ? "bed" : "unit"}{rooms === 1 ? "" : "s"}</span><span /></div>}<div className="flex justify-between gap-4"><span>Base price (excluding GST)</span><span>₹<FormattedText value={money(pricing.baseAmount)} /></span></div><div className="flex justify-between gap-4"><span>GST ({gstPercent}%)</span><span>₹<FormattedText value={money(pricing.gstAmount)} /></span></div></div>
        <div className="flex items-center justify-between border border-line bg-surface px-4 py-3">
          <span className="text-sm text-foreground-soft">Total including {gstPercent}% GST</span>
          <span className="tabular-nums text-xl font-semibold text-foreground">₹<FormattedText value={amount.toLocaleString("en-IN")} /></span>
        </div>

        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm text-red-700">
            <FormattedText value={errorMessage} />
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || soldOut || notEnoughLeft || !item || !acceptWay || !acceptTerms}
          className="btn btn-accent w-full transition-opacity disabled:opacity-60"
        >
          <FormattedText value={soldOut ? "Currently not available" : !item ? "Unavailable" : submitting ? content.text_19 : `Pay ₹${amount.toLocaleString("en-IN")} & Confirm`} links={false} />
        </button>
      </form>
    </>
  );
}
