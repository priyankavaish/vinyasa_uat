"use client";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadRequest } from "@/lib/schemas";
import { residencyCountries, type artistInResidence } from "@/lib/editorial/defaults/artist-in-residence";

const inputClass = "mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
export default function ResidencyApplicationForm({ options, source = "artist-residence" }: { options: typeof artistInResidence.application; source?: "artist-residence" | "artist-unite" }) {
  const id = useId();
  const [saved, setSaved] = useState(false);
  const [failure, setFailure] = useState("");
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LeadRequest>({
    resolver: zodResolver(leadSchema), mode: "onTouched",
    defaultValues: { source, name: "", lastName: "", email: "", phone: "", artPractice: "", portfolio: "", country: "", researchInquiry: "" },
  });
  async function submit(values: LeadRequest) {
    setFailure("");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await response.json();
      if (!response.ok) {
        for (const [field, messages] of Object.entries(data.fieldErrors || {})) setError(field as keyof LeadRequest, { message: (messages as string[])[0] });
        throw Error(data.error || "We could not send your application. Please try again.");
      }
      setSaved(true);
    } catch (error) { setFailure(error instanceof Error ? error.message : "We could not send your application. Please try again."); }
  }
  if (saved) return <div role="status" className="self-start border border-line bg-surface p-7"><h3 className="font-display text-3xl">Thank you for applying.</h3><p className="mt-4 leading-7 text-foreground-soft">{source === "artist-unite" ? "Your Artist Unite application has been received. The Vinyasa team will review your details and get in touch." : "Your application has been received. Please email your detailed research proposal to vinyasa.ashram@gmail.com to complete the next step."}</p></div>;
  const fields = [
    { key: "name", label: "First Name", type: "text", autoComplete: "given-name", required: true },
    { key: "lastName", label: "Last Name", type: "text", autoComplete: "family-name", required: false },
    { key: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: true, hint: "WhatsApp preferred" },
    { key: "email", label: "Email", type: "email", autoComplete: "email", required: true },
    { key: "artPractice", label: "Art Practice", required: true },
    { key: "portfolio", label: "Portfolio", type: "url", required: true, hint: "Website / URL" },
    { key: "country", label: "Country", required: true },
    { key: "researchInquiry", label: "Area of Research/Enquiry", required: true, hint: "Describe in brief" },
  ] as const;
  return <form onSubmit={handleSubmit(submit)} noValidate className="border border-line bg-surface p-5 sm:p-7">
    <fieldset disabled={isSubmitting} className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
      <legend className="sr-only">{source === "artist-unite" ? "Artist Unite application" : "Artist-in-Residence application"}</legend>
      {fields.filter(field => source === "artist-residence" || !["country", "researchInquiry"].includes(field.key)).map(field => {
        const required = field.required || (source === "artist-unite" && field.key === "lastName");
        const error = errors[field.key]?.message;
        const fieldId = `${id}-${field.key}`;
        return <div key={field.key} className={field.key === "researchInquiry" ? "sm:col-span-2" : ""}>
          <label htmlFor={fieldId} className="text-xs uppercase tracking-[0.12em] text-foreground-soft">{source === "artist-unite" && field.key === "artPractice" ? "Artform" : source === "artist-unite" && field.key === "portfolio" ? "Portfolio / URL" : field.label}{required && <span className="text-accent" aria-hidden="true"> *</span>}</label>
          {(field.key === "artPractice" && options.artPractices.length > 0) || field.key === "country" ? <select id={fieldId} {...register(field.key)} required aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : undefined} className={inputClass}><option value="">{field.key === "country" ? "Select your country" : "Select your art practice"}</option>{(field.key === "country" ? residencyCountries : options.artPractices).map(option => <option key={option} value={option}>{option}</option>)}</select>
          : field.key === "researchInquiry" ? <textarea id={fieldId} {...register(field.key)} required maxLength={4000} rows={4} aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : undefined} className={inputClass} />
          : <input id={fieldId} {...register(field.key)} type={"type" in field ? field.type : "text"} autoComplete={"autoComplete" in field ? field.autoComplete : undefined} required={required} maxLength={field.key === "portfolio" ? 2000 : field.key === "phone" ? 20 : field.key === "email" ? 150 : 60} aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : undefined} className={inputClass} />}
          {"hint" in field && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
          {error && <p id={`${fieldId}-error`} role="alert" className="mt-1 text-xs text-accent">{error}</p>}
        </div>;
      })}
      <button type="submit" className="btn btn-accent mt-1 sm:col-span-2">{isSubmitting ? "Sending..." : source === "artist-unite" ? "Initiate application" : "Submit application"}</button>
    </fieldset>
    {failure && <p role="alert" className="mt-4 text-sm text-accent">{failure}</p>}
  </form>;
}
