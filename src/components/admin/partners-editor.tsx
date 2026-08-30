import { savePartner, deletePartner } from "@/lib/admin/actions";
import ImageField from "@/components/admin/image-field";
import DeleteButton from "@/components/admin/delete-button";
import type { PartnerRow } from "@/lib/db/schema";

const field = "mt-1 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-soft";

function Row({ item }: { item?: PartnerRow }) {
  return (
    <form action={savePartner} className="rounded-lg border border-line bg-white p-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Name</label>
          <input name="name" required defaultValue={item?.name} className={field} />
        </div>
        <div>
          <label className={label}>Sort</label>
          <input name="sort" type="number" defaultValue={item?.sort ?? 0} className={field} />
        </div>
        <div>
          <label className={label}>Description</label>
          <input name="description" defaultValue={item?.description} className={field} />
        </div>
        <div>
          <label className={label}>Link</label>
          <input name="link" defaultValue={item?.link ?? "/contact"} className={field} />
        </div>
      </div>
      <div className="mt-3">
        <ImageField name="logoUrl" label="Logo" defaultValue={item?.logoUrl ?? ""} />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <button type="submit" className="btn btn-accent btn-sm">{item ? "Save" : "Add"}</button>
        {item && <DeleteButton id={item.id} action={deletePartner} label="Delete this partner?" />}
      </div>
    </form>
  );
}

export default function PartnersEditor({ items }: { items: PartnerRow[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl italic">Accessory partners</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {items.map((i) => (
          <Row key={i.id} item={i} />
        ))}
        <Row />
      </div>
    </div>
  );
}
