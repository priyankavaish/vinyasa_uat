import {redirect} from "next/navigation";
import {getSessionUser} from "@/lib/auth-server";
import {listEnquiryReplies} from "@/lib/enquiry-replies";
import { listEmailStates } from "@/lib/email-notifications";
import EmailDelivery from "@/components/admin/email-delivery";
import { listLeads } from "@/lib/store";
import { hasDb } from "@/lib/db";
import LeadsTable from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  if(!await getSessionUser())redirect("/admin/login");
  if (!hasDb()) {
    return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  }
  const [leads, states, replies] = await Promise.all([listLeads(), listEmailStates(["lead"]),listEnquiryReplies()]);

  return (
    <div>
      <h1 className="font-display text-3xl italic">Contact queries</h1>
      <p className="mt-1 text-sm text-foreground-soft">
        {leads.length} total · all contact enquiries, volunteer requests and artist applications.
      </p>
      <EmailDelivery states={states} />
      <div className="mt-6">
        <LeadsTable leads={leads} replies={replies} />
      </div>
    </div>
  );
}
