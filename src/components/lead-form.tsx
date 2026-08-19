"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadRequest>({
    resolver: zodResolver(leadSchema),
    defaultValues: { source, name: "", email: "", phone: "", message: "" },
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
      reset({ source, name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-surface p-8 text-center">
        <p className="font-display italic text-2xl">Thank you, message sent.</p>
        <p className="mt-2 text-sm text-foreground-soft">We'll get back to you shortly.</p>
        <button
          type="button"
          className="mt-5 text-xs tracking-[0.08em] uppercase text-accent underline"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h3 className="font-display italic text-xl">{title}</h3>

      <div>
        <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-name`}>
          Name
        </label>
        <input
          id={`${source}-name`}
          className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-email`}>
          Email
        </label>
        <input
          id={`${source}-email`}
          type="email"
          className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-phone`}>
          Phone (optional)
        </label>
        <input
          id={`${source}-phone`}
          className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          {...register("phone")}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone.message}</p>}
      </div>

      {showMessage && (
        <div>
          <label className="block text-xs tracking-[0.08em] uppercase text-foreground-soft" htmlFor={`${source}-message`}>
            Message
          </label>
          <textarea
            id={`${source}-message`}
            rows={4}
            className="mt-1 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            {...register("message")}
          />
          {errors.message && <p className="mt-1 text-xs text-red-700">{errors.message.message}</p>}
        </div>
      )}

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-accent w-full transition-opacity disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
