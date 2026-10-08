"use client";
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_forms_booking_form";
import { useEditorial } from "@/components/editorial/provider";


import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import {
  cottages as seedCottages,
  events as seedEvents,
  type Cottage,
  type EventProgram,
} from "@/lib/content";
import { bookingPrice } from "@/lib/booking-pricing";
import { isStaySoldOut } from "@/lib/stay-stock";
import { bookingRequestSchema, type BookingRequest } from "@/lib/schemas";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
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
}: {
  cottages?: Cottage[];
  events?: EventProgram[];
  mode?: "stay" | "event";
}) {
  const content = useEditorial("components/forms/booking-form", editorialDefaults);

  const searchParams = useSearchParams();
  const initialType = mode;
  const options = mode === "stay" ? cottages : events;
  const requestedSlug = searchParams.get("slug");
  const initialSlug = options.find(item => item.slug === requestedSlug)?.slug ?? options[0]?.slug ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

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
      guests: 2,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
    },
  });

  const type = watch("type");
  const itemSlug = watch("itemSlug");
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const item = useMemo(() => {
    if (type === "stay") return cottages.find((c) => c.slug === itemSlug) ?? cottages[0];
    return events.find((e) => e.slug === itemSlug) ?? events[0];
  }, [type, itemSlug, cottages, events]);

  const soldOut = type === "stay" && isStaySoldOut(cottages.find((c) => c.slug === itemSlug));

  const baseAmount = useMemo(() => {
    if (!item) return 0;
    if (type === "stay" && "pricePerNight" in item) {
      const nights = nightsBetween(checkIn, checkOut) || 1;
      return item.pricePerNight * nights;
    }
    if ("priceFrom" in item) return item.priceFrom;
    return 0;
  }, [type, item, checkIn, checkOut]);

  const pricing = bookingPrice(baseAmount);
  const amount = pricing.totalAmount;
  const money = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  async function onSubmit(values: BookingRequest) {
    if (soldOut || !item) return;
    setStatus("creating-booking");
    setErrorMessage(null);
    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, amount }),
      });
      if (!bookingRes.ok) {
        const body = await bookingRes.json().catch(() => ({}));
        throw new Error(body?.error ?? "Could not create the booking. Please try again.");
      }
      const { booking, order } = await bookingRes.json();

      setStatus("awaiting-payment");

      async function verify(payload: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        setStatus("verifying");
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: booking.id, ...payload }),
          });
          if (!verifyRes.ok) throw new Error("Payment could not be verified.");
          setStatus("success");
          setConfirmedId(booking.id);
        } catch (err) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Payment could not be verified.");
        }
      }

      if (order.mock) {
        // No real Razorpay key configured: skip the widget, simulate the
        // success callback so the demo flow still completes end-to-end.
        await verify({
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock",
        });
        return;
      }

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
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });
      rzp.open();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const submitting = status === "creating-booking" || status === "awaiting-payment" || status === "verifying";

  if (status === "success") {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <p className="font-display italic text-3xl"><FormattedText value={content.text_1} /></p>
        <p className="mt-3 text-sm text-foreground-soft"><FormattedText value={content.text_2} /><span className="font-mono"><FormattedText value={confirmedId} /></span><FormattedText value={content.text_3} /><span className="font-mono"><FormattedText value={content.text_4} /></span>.
        </p>
      </div>
    );
  }

  return (
    <>
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
                  {i.name}{type === "stay" && cottages.find((c) => c.slug === i.slug)?.quantity === 0 ? " — Sold out" : ""}
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
                className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
                {...register("checkIn")}
              />
              {errors.checkIn && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.checkIn.message} /></p>}
            </div>
            <div>
              <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_12} /></label>
              <input
                type="date"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_15} /></label>
            <input
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("guestName")}
            />
            {errors.guestName && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.guestName.message} /></p>}
          </div>
          <div>
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_16} /></label>
            <input
              type="email"
              className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
              {...register("guestEmail")}
            />
            {errors.guestEmail && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.guestEmail.message} /></p>}
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft"><FormattedText value={content.text_17} /></label>
          <input
            className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm"
            {...register("guestPhone")}
          />
          {errors.guestPhone && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.guestPhone.message} /></p>}
        </div>

        <div className="space-y-2 text-sm text-foreground-soft"><div className="flex justify-between gap-4"><span>Base price (excluding GST)</span><span>₹<FormattedText value={money(pricing.baseAmount)} /></span></div><div className="flex justify-between gap-4"><span>GST (18%)</span><span>₹<FormattedText value={money(pricing.gstAmount)} /></span></div></div>
        <div className="flex items-center justify-between border border-line bg-surface px-4 py-3">
          <span className="text-sm text-foreground-soft">Total including 18% GST</span>
          <span className="tabular-nums text-xl font-semibold text-foreground">₹<FormattedText value={amount.toLocaleString("en-IN")} /></span>
        </div>

        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm text-red-700">
            <FormattedText value={errorMessage} />
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || soldOut || !item}
          className="btn btn-accent w-full transition-opacity disabled:opacity-60"
        >
          <FormattedText value={soldOut ? "Sold out" : !item ? "Unavailable" : submitting ? content.text_19 : `Pay ₹${amount.toLocaleString("en-IN")} & Confirm`} links={false} />
        </button>
      </form>
    </>
  );
}
