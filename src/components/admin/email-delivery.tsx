"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resendEntryEmail } from "@/lib/email-actions";
import type { EmailState } from "@/lib/email-notifications";
export default function EmailDelivery({ states }: { states: EmailState[] }) {
 const router=useRouter();const [busy,setBusy]=useState("");const [error,setError]=useState("");
 const pending=states.filter(s=>s.state!=="sent");
 return <section className="mt-6 border border-line bg-white p-4"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-semibold">Email notifications</h2><Link href="/admin/settings" className="text-sm text-accent underline">Email settings</Link></div><p className="mt-2 text-sm">{states.filter(s=>s.state==="sent").length} sent · {pending.length} need attention · Recipient: priyanka6199@gmail.com</p>
 {pending.length>0 && <div className="mt-3 space-y-3">{pending.map(s=><div key={s.kind+s.entryId} className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3"><div className="min-w-0"><p className="text-sm capitalize">{s.kind} · {s.state}</p><p className="break-all text-xs text-foreground-soft">Reference: {s.entryId}</p><p className="text-xs text-foreground-soft">{s.error || "Sending. Retry if this does not finish."}</p></div><button type="button" disabled={!!busy} className="btn btn-outline btn-sm disabled:opacity-50" onClick={async()=>{setBusy(s.entryId);setError("");try{await resendEntryEmail(s.kind,s.entryId);router.refresh();}catch{setError("Could not retry. Check email settings.");}finally{setBusy("");}}}>{busy===s.entryId ? "Sending..." : "Retry email"}</button></div>)}</div>}<p role="status" className="mt-2 text-sm">{error}</p></section>;
}
