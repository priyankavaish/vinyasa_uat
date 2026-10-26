"use client";

import { useId, useRef, useState } from "react";
import ImageField from "./image-field";
import { type EventHost, type EventHostHeading } from "@/lib/event-hosts";

const field = "mt-1.5 w-full border border-line bg-background px-3 py-2 text-base outline-none focus:border-accent";
export default function EventHostFields({ initial = [], heading = "Host" }: { initial?: EventHost[]; heading?: EventHostHeading }) {
  const [hosts, setHosts] = useState(() => initial.map((host, index) => ({ ...host, editorKey: index })));
  const prefix = useId();
  const nextKey = useRef(initial.length);
  const update = (index: number, value: Partial<EventHost>) => setHosts(old => old.map((host, i) => i === index ? { ...host, ...value } : host));
  const move = (index: number, direction: number) => setHosts(old => {
    const next = [...old]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; return next;
  });
  return <section aria-labelledby={prefix} className="min-w-0 space-y-5 border-t border-line pt-7">
    <h2 id={prefix} className="font-display text-2xl">Hosts / artists</h2>
    <label className="block max-w-xs text-sm font-semibold">Section heading<select name="eventHostHeading" defaultValue={heading} className={field}><option value="Host">Host</option><option value="Artist">Artist</option></select></label>
    <p className="text-sm leading-6 text-muted">Optional. Add the people involved in this event. Each person can have a photo, role, bio and social profile links. Leave the list empty to hide this section.</p>
    <input type="hidden" name="eventHosts" value={JSON.stringify(hosts.map(({ editorKey: _, ...host }) => host))} />
    {hosts.map((host, index) => <fieldset key={host.editorKey} data-host-editor className="min-w-0 space-y-4 border border-line bg-surface p-4 sm:p-5">
      <legend className="px-2 font-semibold">Host / artist {index + 1}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Name<input required maxLength={160} className={field} value={host.name} onChange={e => update(index, { name: e.target.value })} /></label>
        <label className="block text-sm font-semibold">Role (optional)<input maxLength={160} placeholder="Artist, facilitator, retreat host..." className={field} value={host.role} onChange={e => update(index, { role: e.target.value })} /></label>
      </div>
      <ImageField label="Photo (optional)" value={host.image} onChange={image => update(index, { image })} />
      <label className="block text-sm font-semibold">About this person (optional)<textarea rows={4} maxLength={6000} className={field} value={host.bio} onChange={e => update(index, { bio: e.target.value })} /></label>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Social profiles (optional)</p>
        {host.socials.map((social, linkIndex) => <div key={linkIndex} data-social-editor className="grid min-w-0 gap-3 border-l-2 border-line pl-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
          <label className="block text-sm">Profile name<input required maxLength={60} placeholder="Instagram" className={field} value={social.label} onChange={e => update(index, { socials: host.socials.map((link, i) => i === linkIndex ? { ...link, label: e.target.value } : link) })} /></label>
          <label className="block text-sm">Profile URL<input required type="url" pattern="https?://.*" maxLength={2000} placeholder="https://..." className={field} value={social.url} onChange={e => update(index, { socials: host.socials.map((link, i) => i === linkIndex ? { ...link, url: e.target.value } : link) })} /></label>
          <button type="button" className="min-h-11 self-end text-sm text-accent underline" aria-label={`Remove profile ${linkIndex + 1} for host ${index + 1}`} onClick={() => update(index, { socials: host.socials.filter((_, i) => i !== linkIndex) })}>Remove profile</button>
        </div>)}
        <button type="button" disabled={host.socials.length >= 8} className="btn btn-outline btn-sm" onClick={() => update(index, { socials: [...host.socials, { label: "Instagram", url: "" }] })}>Add social profile</button>
      </div>
      <div className="flex flex-wrap gap-4 border-t border-line pt-3">
        <button type="button" disabled={index === 0} className="min-h-11 text-sm text-accent underline disabled:opacity-40" onClick={() => move(index, -1)}>Move up</button>
        <button type="button" disabled={index === hosts.length - 1} className="min-h-11 text-sm text-accent underline disabled:opacity-40" onClick={() => move(index, 1)}>Move down</button>
        <button type="button" className="min-h-11 text-sm text-accent underline" aria-label={`Remove host ${index + 1}`} onClick={() => setHosts(old => old.filter((_, i) => i !== index))}>Remove host / artist</button>
      </div>
    </fieldset>)}
    <button type="button" disabled={hosts.length >= 30} className="btn btn-outline" onClick={() => { const editorKey = nextKey.current++; setHosts(old => [...old, { editorKey, name: "", role: "", image: "", bio: "", socials: [] }]); }}>Add host / artist</button>
  </section>;
}
