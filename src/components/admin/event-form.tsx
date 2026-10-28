import BookingButtonFields from "./booking-button-fields";
import { loadBookingButton } from "@/lib/admin/booking-button-store";
import EventContentFields from "./event-content-fields";
import EventHostFields from "./event-host-fields";
import GalleryField from "./gallery-field";
import { loadEventGallery } from "@/lib/admin/event-gallery-store";
import { loadEventHosts } from "@/lib/admin/event-hosts-store";
import { getEditorial } from "@/lib/editorial/server";
import { defaults } from "@/lib/editorial/defaults/app__site__events__slug__page";
import { eventEditorialKey, eventDetailValue } from "@/lib/editorial/event-details";
import { saveEvent } from "@/lib/admin/actions";
import ImageField from "@/components/admin/image-field";
import RichEditorField from "@/components/admin/rich-editor-field";
import type { EventRow } from "@/lib/db/schema";

const field = "mt-1.5 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft";

export default async function EventForm({ event }: { event?: EventRow }) {
  const details = event ? eventDetailValue(await getEditorial(eventEditorialKey, defaults), event.slug) : null;
  const template = event ? eventDetailValue(defaults, event.slug) : null;
  const hostSettings = event ? await loadEventHosts(event.slug, details) : { hosts: [], heading: "Host" as const };
  const gallery = event ? await loadEventGallery(event.slug) : { enabled: true, images: [] };
  const payment = event ? await loadBookingButton(`event:${event.slug}`) : undefined;
  return (
    <form action={saveEvent} className="min-w-0 max-w-4xl space-y-5">
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Name</label>
          <input name="name" required defaultValue={event?.name} className={field} />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input name="slug" readOnly={!!details} defaultValue={event?.slug} placeholder="auto from name" className={field} />
        </div>
        <div>
          <label className={label}>Kind</label>
          <select name="kind" defaultValue={event?.kind ?? "retreat"} className={field}>
            <option value="workshop">workshop</option>
            <option value="retreat">retreat</option>
            <option value="residency">residency</option>
          </select>
        </div>
        <div>
          <label className={label}>Price from (₹, 0 = by donation)</label>
          <input name="priceFrom" type="number" min={0} defaultValue={event?.priceFrom ?? 0} className={field} />
        </div>
        <div>
          <label className={label}>Duration label</label>
          <input name="durationLabel" defaultValue={event?.durationLabel} className={field} />
        </div>
        <div>
          <label className={label}>Date label</label>
          <input name="dateLabel" required placeholder="15-24 Oct 2026" defaultValue={event?.dateLabel} className={field} />
          <p className="mt-1 text-xs text-muted">Single day: 24 Oct 2026. Multiple days: 15-24 Oct 2026 or 29 Dec 2026 - 1 Jan 2027.</p>
        </div>
        <div>
          <label className={label}>Facilitator</label>
          <input name="facilitator" defaultValue={event?.facilitator} className={field} />
        </div>
        <div>
          <label className={label}>Sort order</label>
          <input name="sort" type="number" defaultValue={event?.sort ?? 0} className={field} />
        </div>
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" name="published" defaultChecked={event?.published ?? true} />
          Published
        </label>
      </div>

      <div>
        <label className={label}>Short description</label>
        <textarea name="description" rows={3} defaultValue={event?.description} className={field} />
      </div>

      <ImageField name="imageUrl" label="Image" defaultValue={event?.imageUrl ?? ""} />

      {details ? <><input type="hidden" name="bodyHtml" value={event?.bodyHtml ?? ""} /><EventContentFields key={event?.slug} value={details} template={template} /></> : <div className="space-y-3"><p className="text-sm leading-6 text-muted">Every event uses the same page layout. Add headings to organize the programme into sections, and include photos or links where needed.</p><RichEditorField name="bodyHtml" label="About & programme" defaultValue={event?.bodyHtml ?? ""} /></div>}

      <section className="space-y-3 border-t border-line pt-5" data-event-gallery-editor>
        <h2 className="font-display text-xl">Photo gallery</h2>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="eventGalleryEnabled" defaultChecked={gallery.enabled} />Show photo gallery on this event</label>
        <GalleryField name="eventGallery" label="Event gallery photos" defaultValue={gallery.images} />
        <p className="text-sm leading-6 text-muted">Upload photos for this event, then drag to reorder. They show as a swipeable 2×4 grid (8 photos per slide) that auto-scrolls, same as the Volunteer page. With no event photos, the page shows original photos of the Vinyasa grounds. Untick the option above to hide the gallery.</p>
      </section>
      <EventHostFields initial={hostSettings.hosts} heading={hostSettings.heading} />
      <BookingButtonFields initial={payment} />

      <div className="flex gap-3">
        <button type="submit" className="btn btn-accent">Save event</button>
        <a href="/admin/events" className="btn btn-outline">Cancel</a>
      </div>
    </form>
  );
}
