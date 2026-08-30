import { saveVisitOption, deleteVisitOption } from "@/lib/admin/actions";
import ImageField from "@/components/admin/image-field";
import DeleteButton from "@/components/admin/delete-button";
import type { VisitOptionRow } from "@/lib/db/schema";

const field = "mt-1 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-soft";

function Row({ item }: { item?: VisitOptionRow }) {
  return (
    <form action={saveVisitOption} className="rounded-lg border border-line bg-white p-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Title</label>
          <input name="title" required defaultValue={item?.title} className={field} />
        </div>
        <div>
          <label className={label}>Sort</label>
          <input name="sort" type="number" defaultValue={item?.sort ?? 0} className={field} />
        </div>
      </div>
      <div className="mt-3">
        <label className={label}>Description</label>
        <textarea name="description" rows={2} defaultValue={item?.description} className={field} />
      </div>
      <div className="mt-3">
        <ImageField name="imageUrl" label="Image" defaultValue={item?.imageUrl ?? ""} />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <button type="submit" className="btn btn-accent btn-sm">{item ? "Save" : "Add"}</button>
        {item && <DeleteButton id={item.id} action={deleteVisitOption} label="Delete this option?" />}
      </div>
    </form>
  );
}

export default function VisitOptionsEditor({ items }: { items: VisitOptionRow[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl italic">&ldquo;More ways to visit&rdquo; options</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {items.map((i) => (
          <Row key={i.id} item={i} />
        ))}
        <Row />
      </div>
    </div>
  );
}
