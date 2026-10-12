"use client";
import { useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormattedText from "@/components/editorial/formatted-text";
import { leadSchema, type LeadRequest } from "@/lib/schemas";
import type { Cottage } from "@/lib/content";
import SuccessDialog from "./success-dialog";

export type StayEnquiryContent = {
  nameLabel: string; guestsLabel: string; stayTypeLabel: string; dateLabel: string;
  phoneLabel: string; phoneHint: string; emailLabel: string;
  reserveLabel: string; reserveOptions: string[];
  intentionLabel: string; intentionOptions: string[];
  submitLabel: string; sendingLabel: string;
  successTitle: string; successMessage: string; closeLabel: string;
};

const inputClass = "mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent";
const labelClass = "block text-xs tracking-[0.08em] uppercase text-foreground-soft";

function stayLabel(stay: Cottage) {
  if (!stay.pricePerNight) return stay.name;
  const unit = stay.slug === "dorm" ? "per bed per night" : "per night";
  return `${stay.name} (₹${stay.pricePerNight.toLocaleString("en-IN")} ${unit})`;
}

export type StayPrefill = { stayType?: string; checkInDate?: string; checkOutDate?: string; guests?: string; rooms?: string };

export default function StayEnquiryForm({ cottages, content, prefill = {}, onSaved }: { cottages: Cottage[]; content: StayEnquiryContent; prefill?: StayPrefill; onSaved?: () => void }) {
  const id = useId();
  const searchParams = useSearchParams();
  const requested = searchParams.get("slug");
  const initialStay = prefill.stayType ?? cottages.find(stay => stay.slug === requested)?.name ?? cottages[0]?.name ?? "";
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);
  const [saved, setSaved] = useState(false);
  const [failure, setFailure] = useState("");
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<LeadRequest>({
    resolver: zodResolver(leadSchema), mode: "onTouched",
    defaultValues: { source: "stay-enquiry", name: "", email: "", phone: "", guests: prefill.guests ?? "", stayType: initialStay, checkInDate: prefill.checkInDate ?? "", checkOutDate: prefill.checkOutDate ?? "", rooms: prefill.rooms ?? "", reservePreference: "", intentions: [] },
  });

  async function submit(values: LeadRequest) {
    setFailure("");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await response.json();
      if (!response.ok) {
        for (const [field, messages] of Object.entries(data.fieldErrors || {})) setError(field as keyof LeadRequest, { message: (messages as string[])[0] });
        throw Error(data.error || "We could not send your enquiry. Please try again.");
      }
      if (onSaved) onSaved(); else setSaved(true);
    } catch (error) { setFailure(error instanceof Error ? error.message : "We could not send your enquiry. Please try again."); }
  }

  const req = <span className="text-accent" aria-hidden="true"> *</span>;
  const err = (message?: string, fieldId?: string) => message ? <p id={fieldId && `${fieldId}-error`} role="alert" className="mt-1 text-xs text-red-700">{message}</p> : null;

  return <>
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <fieldset disabled={isSubmitting} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className={labelClass}><FormattedText value={content.nameLabel} links={false} />{req}</label>
            <input id={`${id}-name`} autoComplete="name" required maxLength={121} className={inputClass} {...register("name")} />
            {err(errors.name?.message, `${id}-name`)}
          </div>
          <div>
            <label htmlFor={`${id}-guests`} className={labelClass}><FormattedText value={content.guestsLabel} links={false} />{req}</label>
            <input id={`${id}-guests`} type="number" inputMode="numeric" min={1} max={50} required className={inputClass} {...register("guests")} />
            {err(errors.guests?.message, `${id}-guests`)}
          </div>
          <div>
            <label htmlFor={`${id}-stay`} className={labelClass}><FormattedText value={content.stayTypeLabel} links={false} />{req}</label>
            <select id={`${id}-stay`} required className={inputClass} {...register("stayType")}>
              {cottages.map(stay => <option key={stay.slug} value={stay.name}>{stayLabel(stay)}</option>)}
            </select>
            {err(errors.stayType?.message, `${id}-stay`)}
          </div>
          <div>
            <label htmlFor={`${id}-date`} className={labelClass}><FormattedText value={content.dateLabel} links={false} />{req}</label>
            <input id={`${id}-date`} type="date" min={today} required className={inputClass} {...register("checkInDate")} />
            {err(errors.checkInDate?.message, `${id}-date`)}
          </div>
          <div>
            <label htmlFor={`${id}-phone`} className={labelClass}><FormattedText value={content.phoneLabel} links={false} />{req}</label>
            <input id={`${id}-phone`} type="tel" autoComplete="tel" required maxLength={20} className={inputClass} {...register("phone")} />
            <p className="mt-1 text-xs text-muted"><FormattedText value={content.phoneHint} links={false} /></p>
            {err(errors.phone?.message, `${id}-phone`)}
          </div>
          <div>
            <label htmlFor={`${id}-email`} className={labelClass}><FormattedText value={content.emailLabel} links={false} />{req}</label>
            <input id={`${id}-email`} type="email" autoComplete="email" required maxLength={150} className={inputClass} {...register("email")} />
            {err(errors.email?.message, `${id}-email`)}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className={labelClass}><FormattedText value={content.reserveLabel} links={false} />{req}</legend>
            <div className="mt-3 space-y-2.5 text-sm text-foreground-soft">
              {content.reserveOptions.map(option => <label key={option} className="flex items-center gap-2.5"><input type="radio" value={option} className="accent-[var(--accent)]" {...register("reservePreference")} /><FormattedText value={option} links={false} /></label>)}
            </div>
            {err(errors.reservePreference?.message)}
          </fieldset>
          <fieldset>
            <legend className={labelClass}><FormattedText value={content.intentionLabel} links={false} /></legend>
            <div className="mt-3 space-y-2.5 text-sm text-foreground-soft">
              {content.intentionOptions.map(option => <label key={option} className="flex items-center gap-2.5"><input type="checkbox" value={option} className="accent-[var(--accent)]" {...register("intentions")} /><FormattedText value={option} links={false} /></label>)}
            </div>
          </fieldset>
        </div>

        {failure && <p role="alert" className="text-sm text-red-700">{failure}</p>}
        <button type="submit" className="btn btn-accent w-full sm:w-auto">{isSubmitting ? content.sendingLabel : content.submitLabel}</button>
      </fieldset>
    </form>
    {!onSaved && <SuccessDialog open={saved} onClose={() => { setSaved(false); reset({ source: "stay-enquiry", name: "", email: "", phone: "", guests: prefill.guests ?? "", stayType: initialStay, checkInDate: prefill.checkInDate ?? "", checkOutDate: prefill.checkOutDate ?? "", rooms: prefill.rooms ?? "", reservePreference: "", intentions: [] }); }} closeLabel={content.closeLabel}>
      <h3 className="font-display text-3xl"><FormattedText value={content.successTitle} /></h3>
      <p className="mt-4 leading-7 text-foreground-soft"><FormattedText value={content.successMessage} /></p>
    </SuccessDialog>}
  </>;
}
