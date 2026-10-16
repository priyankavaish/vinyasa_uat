import BookingButtonFields from "./booking-button-fields";
import { loadBookingButton } from "@/lib/admin/booking-button-store";
import { saveCottage } from "@/lib/admin/actions";
import ImageField from "@/components/admin/image-field";
import GalleryField from "@/components/admin/gallery-field";
import RichEditorField from "@/components/admin/rich-editor-field";
import type { CottageRow } from "@/lib/db/schema";

const ICONS = [
  "flame-outline", "water-outline", "moon-outline", "leaf-outline",
  "wind-outline", "circle-outline", "people-outline", "home-outline",
];

const field = "mt-1.5 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft";

export default async function CottageForm({ cottage }: { cottage?: CottageRow }) {
  const payment = cottage ? await loadBookingButton(`stay:${cottage.slug}`) : undefined;
  return (
    <form action={saveCottage} className="max-w-2xl space-y-5">
      {cottage && <input type="hidden" name="id" value={cottage.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Name</label>
          <input name="name" required defaultValue={cottage?.name} className={field} />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input name="slug" defaultValue={cottage?.slug} placeholder="auto from name" className={field} />
        </div>
        <div>
          <label className={label}>Element</label>
          <input name="element" defaultValue={cottage?.element} className={field} />
        </div>
        <div>
          <label className={label}>Tagline</label>
          <input name="tagline" defaultValue={cottage?.tagline} className={field} />
        </div>
        <div>
          <label className={label}>Price per night (₹)</label>
          <input name="pricePerNight" type="number" min={0} defaultValue={cottage?.pricePerNight ?? 0} className={field} />
        </div>
        <div>
          <label className={label}>Max guests</label>
          <input name="maxGuests" type="number" min={1} defaultValue={cottage?.maxGuests ?? 2} className={field} />
        </div>
        <div>
          <label className={label}>Icon</label>
          <select name="icon" defaultValue={cottage?.icon ?? "home-outline"} className={field}>
            {ICONS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Accent colour</label>
          <input name="accent" defaultValue={cottage?.accent ?? "#8f3b31"} className={field} />
        </div>
        <div>
          <label className={label}>Sort order</label>
          <input name="sort" type="number" defaultValue={cottage?.sort ?? 0} className={field} />
        </div>
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" name="published" defaultChecked={cottage?.published ?? true} />
          Published (visible on site)
        </label>
      </div>

      <div>
        <label className={label}>Short description</label>
        <textarea name="description" rows={3} defaultValue={cottage?.description} className={field} />
      </div>

      <div>
        <label className={label}>Amenities (one per line)</label>
        <textarea
          name="amenities"
          rows={4}
          defaultValue={(cottage?.amenities ?? []).join("\n")}
          className={field}
        />
      </div>

      <ImageField name="imageUrl" label="Main image" defaultValue={cottage?.imageUrl ?? ""} />

      <GalleryField name="gallery" label="Gallery" defaultValue={cottage?.gallery ?? []} />

      <RichEditorField name="bodyHtml" label="Detail page content" defaultValue={cottage?.bodyHtml ?? ""} />

      <BookingButtonFields initial={payment} />

      <div className="flex gap-3">
        <button type="submit" className="btn btn-accent">Save stay</button>
        <a href="/admin/stays" className="btn btn-outline">Cancel</a>
      </div>
    </form>
  );
}
