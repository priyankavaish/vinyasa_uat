"use client";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormattedText from "@/components/editorial/formatted-text";
import { leadSchema, type LeadRequest } from "@/lib/schemas";
import SuccessDialog from "./success-dialog";

export type OrganizerFormContent = {
  nameLabel: string; programTypeLabel: string; programTypePlaceholder: string; programTypes: string[];
  emailLabel: string; phoneLabel: string; submitLabel: string; sendingLabel: string;
  successTitle: string; successMessage: string; closeLabel: string; deckUrl: string; deckLabel: string;
};
const inputClass = "mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

// Turn a normal Google Drive "view" link into a direct download link.
function downloadUrl(url: string) {
  const id = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)?.[1];
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

export default function OrganizerEnquiryForm({ content }: { content: OrganizerFormContent }) {
  const id = useId();
  const [saved, setSaved] = useState(false);
  const [failure, setFailure] = useState("");
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<LeadRequest>({
    resolver: zodResolver(leadSchema), mode: "onTouched",
    defaultValues: { source: "organizer", name: "", email: "", phone: "", programType: "" },
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
      setSaved(true);
    } catch (error) { setFailure(error instanceof Error ? error.message : "We could not send your enquiry. Please try again."); }
  }
  const fields = [
    { key: "name", label: content.nameLabel, type: "text", autoComplete: "name" },
    { key: "programType", label: content.programTypeLabel },
    { key: "email", label: content.emailLabel, type: "email", autoComplete: "email" },
    { key: "phone", label: content.phoneLabel, type: "tel", autoComplete: "tel" },
  ] as const;
  return <>
    <form onSubmit={handleSubmit(submit)} noValidate className="border border-line bg-surface p-5 sm:p-7">
      <fieldset disabled={isSubmitting} className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {fields.map(field => {
          const error = errors[field.key]?.message;
          const fieldId = `${id}-${field.key}`;
          return <div key={field.key}>
            <label htmlFor={fieldId} className="text-xs uppercase tracking-[0.12em] text-foreground-soft"><FormattedText value={field.label} links={false} /><span className="text-accent" aria-hidden="true"> *</span></label>
            {field.key === "programType"
              ? <select id={fieldId} {...register("programType")} required aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : undefined} className={inputClass}><option value="">{content.programTypePlaceholder}</option>{content.programTypes.map(option => <option key={option} value={option}>{option}</option>)}</select>
              : <input id={fieldId} {...register(field.key)} type={"type" in field ? field.type : "text"} autoComplete={"autoComplete" in field ? field.autoComplete : undefined} required aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : undefined} maxLength={field.key === "email" ? 150 : field.key === "phone" ? 20 : 121} className={inputClass} />}
            {error && <p id={`${fieldId}-error`} role="alert" className="mt-1 text-xs text-accent">{error}</p>}
          </div>;
        })}
        <button type="submit" className="btn btn-accent mt-1 sm:col-span-2">{isSubmitting ? content.sendingLabel : content.submitLabel}</button>
      </fieldset>
      {failure && <p role="alert" className="mt-4 text-sm text-accent">{failure}</p>}
    </form>
    <SuccessDialog open={saved} onClose={() => { setSaved(false); reset(); }} closeLabel={content.closeLabel}>
      <h3 className="font-display text-3xl"><FormattedText value={content.successTitle} /></h3>
      <p className="mt-4 leading-7 text-foreground-soft"><FormattedText value={content.successMessage} /></p>
      {content.deckUrl && <a href={downloadUrl(content.deckUrl)} target="_blank" rel="noopener noreferrer" className="btn btn-accent mt-5"><FormattedText value={content.deckLabel} links={false} /></a>}
    </SuccessDialog>
  </>;
}
