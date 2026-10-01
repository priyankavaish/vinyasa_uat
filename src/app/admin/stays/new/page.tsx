import CottageForm from "@/components/admin/cottage-form";

export const dynamic = "force-dynamic";

export default function NewCottagePage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic">Add mudhouse</h1>
      <p className="mt-1 text-sm text-foreground-soft">Appears on /stays once published.</p>
      <div className="mt-6">
        <CottageForm />
      </div>
    </div>
  );
}
