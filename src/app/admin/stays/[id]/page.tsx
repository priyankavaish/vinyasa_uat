import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { cottages } from "@/lib/db/schema";
import CottageForm from "@/components/admin/cottage-form";

export const dynamic = "force-dynamic";

export default async function EditCottagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const { id } = await params;
  const [row] = await getDb().select().from(cottages).where(eq(cottages.id, id)).limit(1);
  if (!row) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl italic">Edit {row.name}</h1>
      <div className="mt-6">
        <CottageForm cottage={row} />
      </div>
    </div>
  );
}
