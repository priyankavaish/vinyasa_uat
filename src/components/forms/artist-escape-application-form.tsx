"use client";

import { useEffect, useState, type FormEvent } from "react";
import { artistApplicationSchema, formatArtistDate, STAY_WEEKS, type ArtistProgramme, type ArtistStay } from "@/lib/artist-escape-programme";
import FormLoader from "./form-loader";
import SuccessDialog from "./success-dialog";

type Schedule = { programme: ArtistProgramme; arrivals: Record<ArtistStay["weeks"], string[]> };
const field = "mt-2 w-full border border-line bg-background px-4 py-2.5 text-sm";

export default function ArtistEscapeApplicationForm() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [weeks, setWeeks] = useState<ArtistStay["weeks"] | "">("");
  const [arrival, setArrival] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const arrivals = weeks ? schedule?.arrivals[weeks] ?? [] : [];
  const closed = schedule && !Object.values(schedule.arrivals).some(dates => dates.length);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/artist-escape/application", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Could not load availability. Please refresh and try again.");
        const data = await response.json();
        if (!controller.signal.aborted) setSchedule(data);
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Could not load availability.");
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    const result = artistApplicationSchema.safeParse({ ...Object.fromEntries(new FormData(form)), weeks, arrival });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/artist-escape/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.arrivals && schedule) {
          setSchedule({ ...schedule, arrivals: data.arrivals });
          setArrival("");
        }
        throw new Error(data.error || "Could not submit your application.");
      }
      form.reset();
      setWeeks("");
      setArrival("");
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not submit your application.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SuccessDialog open={success} onClose={() => setSuccess(false)}>
        <p className="font-display italic text-2xl">We have received your application.</p>
        <p className="mt-2 text-sm text-foreground-soft">Our team will review your application and get back to you soon.</p>
      </SuccessDialog>
      <FormLoader active={busy} label="Submitting application..." />
      <form onSubmit={submit} className="space-y-5 border border-line bg-surface p-6 sm:p-9">
        <h3 className="font-display italic text-2xl">Artist Escape application</h3>
        {schedule && <p className="text-sm text-foreground-soft">{formatArtistDate(schedule.programme.start)} – {formatArtistDate(schedule.programme.lastNight)} · {schedule.programme.capacity} artists per week · Stay and meals included</p>}
        <p className="text-xs text-foreground-soft">All fields are required.</p>
        {closed && <p role="status">There are no available arrivals for this intake.</p>}
        <fieldset className="grid min-w-0 grid-cols-1 items-start gap-x-6 gap-y-5 md:grid-cols-2" disabled={busy || !schedule || !!closed}>
          <label className="block text-sm">
            What’s your full name? <span aria-hidden="true" className="text-accent">*</span>
            <input name="name" autoComplete="name" className={field} required maxLength={120} />
          </label>
          <label className="block text-sm">
            What’s your WhatsApp number? <span aria-hidden="true" className="text-accent">*</span>
            <input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" className={field} required maxLength={25} />
            <span className="mt-1 block text-xs text-foreground-soft">Include your country code.</span>
          </label>
          <label className="block text-sm">
            What’s your email address? <span aria-hidden="true" className="text-accent">*</span>
            <input name="email" type="email" autoComplete="email" className={field} required maxLength={150} />
          </label>
          <label className="block text-sm">
            How long would you like to stay? <span aria-hidden="true" className="text-accent">*</span>
            <select className={field} required value={weeks} onChange={event => { setWeeks(event.target.value ? Number(event.target.value) as ArtistStay["weeks"] : ""); setArrival(""); }}>
              <option value="">Select stay length</option>
              {STAY_WEEKS.map(length => <option key={length} value={length}>{length} {length === 1 ? "week" : "weeks"}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            Which Monday would you like to arrive? <span aria-hidden="true" className="text-accent">*</span>
            <select className={field} required disabled={!arrivals.length} value={arrival} onChange={event => setArrival(event.target.value)}>
              <option value="">{!weeks ? "Select stay length first" : arrivals.length ? "Select arrival Monday" : "No arrivals for this stay length"}</option>
              {arrivals.map(date => <option value={date} key={date}>{formatArtistDate(date)}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            Portfolio <span aria-hidden="true" className="text-accent">*</span>
            <input name="portfolio" type="url" className={field} required maxLength={500} placeholder="https://" />
            <span className="mt-1 block text-xs text-foreground-soft">An Instagram profile, website, showreel, writing sample or Google Drive link is fine.</span>
          </label>
          <label className="block text-sm md:col-span-2">
            What would you like to work on or explore at Vinyasa? <span aria-hidden="true" className="text-accent">*</span>
            <textarea name="intent" className={field} rows={3} required maxLength={2000} />
            <span className="mt-1 block text-xs text-foreground-soft">A line or two is enough. A rough idea is welcome.</span>
          </label>
          <button type="submit" className="btn btn-accent justify-self-start disabled:opacity-50 md:col-span-2" disabled={!arrival}>Submit application</button>
        </fieldset>
        {!schedule && !error && <p role="status">Loading available weeks...</p>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </form>
    </>
  );
}
