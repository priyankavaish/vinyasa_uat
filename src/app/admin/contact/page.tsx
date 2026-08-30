import { listLeads } from "@/lib/store";
import { hasDb } from "@/lib/db";
import LeadsTable from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  if (!hasDb()) {
    return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  }
  const leads = await listLeads();

  return (
    <div>
      <h1 className="font-display text-3xl italic">Contact queries</h1>
      <p className="mt-1 text-sm text-foreground-soft">
        {leads.length} total · every message from the contact, volunteer and corporate forms.
      </p>
      <div className="mt-6">
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
