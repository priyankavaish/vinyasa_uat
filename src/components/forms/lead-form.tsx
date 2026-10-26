"use client";
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_forms_lead_form";
import { useEditorial } from "@/components/editorial/provider";


import MultiDateCalendar from "./multi-date-calendar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SuccessDialog from "./success-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadRequest } from "@/lib/schemas";

type Props = {
  source: LeadRequest["source"];
  title: string;
  submitLabel?: string;
  showMessage?: boolean;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadForm({ source, title, submitLabel = "Send", showMessage = true }: Props) {
  const content = useEditorial("components/forms/lead-form", editorialDefaults);

  const isVolunteer = source === "volunteer";
  const compact = isVolunteer || source === "contact";
  const phoneRequired = isVolunteer || source === "contact";
  const requiredMark = <span className="text-accent" aria-hidden="true"> *</span>;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadRequest>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: { source, name: "", email: "", phone: "", whatsapp: "", message: "", subject: "", lastName: "", volunteeringDates: [] },
  });

  async function onSubmit(values: LeadRequest) {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      reset({ source, name: "", email: "", phone: "", message: "", subject: "", lastName: "", volunteeringDates: [] });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
    <SuccessDialog open={status === "success"} onClose={() => setStatus("idle")} closeLabel={content.closeLabel}>
      <p className="font-display italic text-2xl"><FormattedText value={isVolunteer ? content.volunteerSuccessTitle : content.text_1} /></p>
      <p className="mt-2 text-sm text-foreground-soft"><FormattedText value={isVolunteer ? content.volunteerSuccessMessage : content.text_2} /></p>
    </SuccessDialog>
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "space-y-3" : "space-y-4"} noValidate>
      <h3 className="font-display italic text-xl"><FormattedText value={title} /></h3>

      <div className={compact ? "grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 [&>*]:min-w-0" : "space-y-4"}>
      <div>
        <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-name`}><FormattedText value={isVolunteer ? "First Name" : content.text_4} />{requiredMark}</label>
        <input
          id={`${source}-name`} required autoComplete={isVolunteer ? "given-name" : "name"}
          className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.name.message} /></p>}
      </div>

      {isVolunteer && (
        <div>
          <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-last-name`}>Last Name{requiredMark}</label>
          <input id={`${source}-last-name`} required autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? `${source}-last-name-error` : undefined} className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" {...register("lastName")} />
          {errors.lastName && <p id={`${source}-last-name-error`} role="alert" className="mt-1 text-xs text-red-700"><FormattedText value={errors.lastName.message} /></p>}
        </div>
      )}

      <div>
        <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-email`}><FormattedText value={content.text_5} />{requiredMark}</label>
        <input
          id={`${source}-email`}
          type="email" required autoComplete="email"
          className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.email.message} /></p>}
      </div>

      {source === "contact" && (
        <div>
          <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-subject`}>Subject{requiredMark}</label>
          <input id={`${source}-subject`} required className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" {...register("subject")} />
          {errors.subject && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.subject.message} /></p>}
        </div>
      )}
      <div>
        <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-phone`}>{isVolunteer ? <>Mobile Number{requiredMark}</> : source === "contact" ? <>Phone{requiredMark}</> : content.text_6}</label>
        <input
          id={`${source}-phone`} type="tel" required={phoneRequired} minLength={phoneRequired ? 7 : undefined} maxLength={20} autoComplete="tel"
          aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${source}-phone-error` : undefined}
          className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          {...register("phone")}
        />
        {errors.phone && <p id={`${source}-phone-error`} role="alert" className="mt-1 text-xs text-red-700"><FormattedText value={errors.phone.message} /></p>}
      </div>
      {isVolunteer && (
        <div>
          <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-whatsapp`}><FormattedText value={content.whatsappLabel} links={false} /></label>
          <input id={`${source}-whatsapp`} type="tel" autoComplete="tel" className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" {...register("whatsapp")} />
          {errors.whatsapp && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.whatsapp.message} /></p>}
        </div>
      )}

      {isVolunteer && (
        <>
          <div className="sm:col-span-2">
          <MultiDateCalendar id={`${source}-dates`} value={watch("volunteeringDates") ?? []} onChange={dates => setValue("volunteeringDates", dates, { shouldValidate: true, shouldDirty: true })} error={errors.volunteeringDates?.message} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-type`}><FormattedText value={content.volunteeringTypeLabel} links={false} />{requiredMark}</label>
            <select id={`${source}-type`} required className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" {...register("volunteeringType")}>
              <option value="">{content.volunteeringTypePlaceholder}</option>
              {content.volunteeringTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.volunteeringType && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.volunteeringType.message} /></p>}
          </div>
        </>
      )}
      {showMessage && !isVolunteer && (
        <div className={compact ? "sm:col-span-2" : undefined}>
          <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-message`}><FormattedText value={content.text_7} /></label>
          <textarea
            id={`${source}-message`}
            rows={compact ? 3 : 4}
            className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            {...register("message")}
          />
          {errors.message && <p className="mt-1 text-xs text-red-700"><FormattedText value={errors.message.message} /></p>}
        </div>
      )}

      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-700">
          <FormattedText value={errorMessage} />
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-accent w-full transition-opacity disabled:opacity-60"
      >
        <FormattedText value={status === "submitting" ? content.text_8 : submitLabel} links={false} />
      </button>
    </form>
    </>
  );
}
