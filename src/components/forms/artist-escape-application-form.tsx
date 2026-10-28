"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SuccessDialog from "./success-dialog";
import FormLoader from "./form-loader";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Italy", "Spain", "Netherlands", "Switzerland", "Israel", "South Africa", "Brazil",
  "Argentina", "Mexico", "Japan", "Singapore", "United Arab Emirates", "Other",
];

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  email: z.string().trim().email().max(150),
  phone: z
    .string()
    .trim()
    .min(7, "Required")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  country: z.string().min(1, "Please select a country"),
  portfolio: z.string().trim().min(1, "Required").max(300),
  intent: z.string().trim().max(2000).optional().or(z.literal("")),
  lookForward: z.string().trim().max(2000).optional().or(z.literal("")),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

type Status = "idle" | "submitting" | "success" | "error";

const field = "mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent";
const label = "block text-xs tracking-[0.08em] uppercase text-foreground-soft";

export default function ArtistEscapeApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "", country: "", portfolio: "", intent: "", lookForward: "",
    },
  });

  async function onSubmit(values: ApplicationValues) {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const message = [
        `Country: ${values.country}`,
        `Portfolio: ${values.portfolio}`,
        values.intent ? `\nIntent of application:\n${values.intent}` : "",
        values.lookForward ? `\nWhat they look forward to at Vinyasa:\n${values.lookForward}` : "",
      ].filter(Boolean).join("\n");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "artist-escape",
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phone: values.phone,
          message,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
    <SuccessDialog open={status === "success"} onClose={() => setStatus("idle")}>
      <p className="font-display italic text-2xl">Application sent</p>
      <p className="mt-2 text-sm text-foreground-soft">We'll be in touch to set up a 1:1 call.</p>
    </SuccessDialog>
    <FormLoader active={status === "submitting"} />
    <form onSubmit={handleSubmit(onSubmit)} className="border border-line bg-surface p-6 sm:p-9" noValidate>
      <h3 className="font-display italic text-2xl">Artist Escape Application</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="ae-first-name">First Name *</label>
          <input id="ae-first-name" className={field} {...register("firstName")} />
          {errors.firstName && <p className="mt-1 text-xs text-red-700">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="ae-last-name">Last Name *</label>
          <input id="ae-last-name" className={field} {...register("lastName")} />
          {errors.lastName && <p className="mt-1 text-xs text-red-700">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className={label} htmlFor="ae-email">Email *</label>
          <input id="ae-email" type="email" className={field} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="ae-phone">Phone Number *</label>
          <input id="ae-phone" className={field} {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone.message}</p>}
        </div>

        <div>
          <label className={label} htmlFor="ae-country">Country *</label>
          <select id="ae-country" className={field} defaultValue="" {...register("country")}>
            <option value="" disabled>— Select a country —</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.country && <p className="mt-1 text-xs text-red-700">{errors.country.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="ae-portfolio">Portfolio *</label>
          <input id="ae-portfolio" className={field} placeholder="Google Drive / Behance / Instagram" {...register("portfolio")} />
          {errors.portfolio && <p className="mt-1 text-xs text-red-700">{errors.portfolio.message}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="ae-intent">Intent of application</label>
        <textarea id="ae-intent" rows={4} maxLength={2000} className={field} {...register("intent")} />
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="ae-look-forward">What do you look forward to do at your stay at Vinyasa?</label>
        <textarea id="ae-look-forward" rows={4} maxLength={2000} className={field} {...register("lookForward")} />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-accent mt-6 w-full transition-opacity disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </button>
    </form>
    </>
  );
}
