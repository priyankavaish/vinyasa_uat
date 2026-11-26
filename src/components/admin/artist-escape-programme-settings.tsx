"use client";

import { useEffect, useState, type FormEvent } from "react";
import FormLoader from "@/components/forms/form-loader";
import { formatArtistDate } from "@/lib/artist-escape-programme";
import type { getArtistProgramme } from "@/lib/artist-escape-programme-store";

type Schedule = Awaited<ReturnType<typeof getArtistProgramme>>;
const field = "mt-2 w-full border border-line bg-background px-3 py-2";

export default function ArtistEscapeProgrammeSettings({ initial }: { initial: Schedule }) {
  const [schedule, setSchedule] = useState(initial);
  const [draft, setDraft] = useState(initial.programme);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setSchedule(initial), [initial]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/artist-escape/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save programme.");
      setSchedule(data);
      setDraft(data.programme);
      setMessage("Programme settings saved.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save programme.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="mt-6 border border-line bg-surface p-5">
      <summary className="cursor-pointer font-semibold">Artist Escape programme settings</summary>
      <FormLoader active={busy} label="Saving programme settings..." />
      <form onSubmit={save} className="mt-4">
        <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm">First arrival Monday<input type="date" required className={field} value={draft.start} onChange={event => setDraft({ ...draft, start: event.target.value })} /></label>
          <label className="text-sm">Last night (Sunday)<input type="date" required className={field} value={draft.lastNight} onChange={event => setDraft({ ...draft, lastNight: event.target.value })} /></label>
          <label className="text-sm">Artists per week<input type="number" required min={1} max={10} className={field} value={draft.capacity} onChange={event => setDraft({ ...draft, capacity: Number(event.target.value) })} /></label>
          <button type="submit" className="btn btn-accent w-fit">Save programme</button>
        </fieldset>
        {message && <p role="status" className="mt-3 text-sm">{message}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      </form>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th scope="col">Week of</th><th scope="col">Available</th><th scope="col">Held</th><th scope="col">Confirmed</th></tr></thead>
          <tbody>{schedule.weeks.map(week => (
            <tr key={week.arrival} className="border-t border-line">
              <th scope="row" className="py-2 font-normal">{formatArtistDate(week.arrival)}</th>
              <td>{Math.max(0, schedule.programme.capacity - week.held - week.confirmed)}</td>
              <td>{week.held}</td>
              <td>{week.confirmed}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </details>
  );
}
