import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { events } from "@/lib/db/schema";
import EventForm from "@/components/admin/event-form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const { id } = await params;
  const [row] = await getDb().select().from(events).where(eq(events.id, id)).limit(1);
  if (!row) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl italic">Edit {row.name}</h1>
      <div className="mt-6">
        <EventForm event={row} />
      </div>
    </div>
  );
}
