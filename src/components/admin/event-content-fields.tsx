"use client";
import { useState } from "react";
import { Fields } from "./editorial-editor";
export default function EventContentFields({value,template}:{value:unknown;template:unknown}) {
 const [draft,setDraft]=useState(value);
 return <section className="min-w-0 space-y-5 border-t border-line pt-7"><h2 className="font-display text-2xl">Event page content</h2><p className="text-sm text-muted">Edit this event's sections, text, buttons and images here. Save event applies all your changes.</p><input type="hidden" name="eventDetails" value={JSON.stringify(draft)} /><Fields value={draft} template={template} path="Content" onChange={setDraft}/></section>;
}
