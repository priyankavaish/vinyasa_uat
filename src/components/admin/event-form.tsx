import { saveEvent } from "@/lib/admin/actions";
import ImageField from "@/components/admin/image-field";
import RichEditorField from "@/components/admin/rich-editor-field";
import type { EventRow } from "@/lib/db/schema";

const field = "mt-1.5 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft";

export default function EventForm({ event }: { event?: EventRow }) {
  return (
    <form action={saveEvent} className="max-w-2xl space-y-5">
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Name</label>
          <input name="name" required defaultValue={event?.name} className={field} />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input name="slug" defaultValue={event?.slug} placeholder="auto from name" className={field} />
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
          <input name="dateLabel" defaultValue={event?.dateLabel} className={field} />
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

      <RichEditorField name="bodyHtml" label="Detail page content" defaultValue={event?.bodyHtml ?? ""} />

      <div className="flex gap-3">
        <button type="submit" className="btn btn-accent">Save event</button>
        <a href="/admin/events" className="btn btn-outline">Cancel</a>
      </div>
    </form>
  );
}
