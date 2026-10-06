"use client";
import { useEffect, useState } from "react";
import { saveEmailSettings, testEmailSettings } from "@/lib/email-actions";
type Summary = { configured: boolean; recipient: string; provider: string; sender: string; host: string; port: number; user: string; siteUrl?: string };
export default function EmailSettings({ summary }: { summary: Summary }) {
 const [siteUrl,setSiteUrl]=useState(summary.siteUrl || "");
 useEffect(()=>{if(!summary.siteUrl)setSiteUrl(window.location.origin);},[summary.siteUrl]);
 const [provider, setProvider] = useState(summary.provider);
 const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [configured,setConfigured]=useState(summary.configured);
 const field = "mt-1 w-full border border-line bg-white px-3 py-2 text-sm";
 return <section className="mt-6 border border-line bg-white p-6"><h2 className="font-display text-xl">Email setup</h2><p className="mt-2 text-sm">Website form notifications go to <strong>{summary.recipient}</strong>.</p><p className="mt-2 text-sm text-foreground-soft">{configured ? "Email configuration saved. Use Send test email to check delivery." : "Email setup required. Form entries are saved even while email is unavailable."}</p>
 <p className="mt-2 text-sm text-foreground-soft">Password reset emails go to the registered admin account.</p><ol className="mt-4 list-decimal space-y-2 pl-5 text-sm"><li>Enable 2-Step Verification in your Google account.</li><li>Create an <a className="text-accent underline" href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer">App Password</a> named Vinyasa website.</li><li>Choose Gmail below. Use the same Gmail address for Sender email and Email login username, and paste the App Password.</li><li>Save, send a test email, then use Retry email on earlier entries.</li></ol>
 <form className="mt-5 space-y-4" onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;setBusy(true);setMessage("");try{const result=await saveEmailSettings(new FormData(form));setMessage(result.message);if(result.ok){setConfigured(true);(form.elements.namedItem("secret") as HTMLInputElement).value="";}}catch{setMessage("Could not save. Please retry.");}finally{setBusy(false);}}}>
 <fieldset disabled={busy} className="space-y-4">
 <label className="block text-sm">Website address<input name="siteUrl" type="url" required value={siteUrl} onChange={e=>setSiteUrl(e.target.value)} className={field}/><span className="mt-1 block text-xs text-foreground-soft">Use the live website address after deployment. Password reset links use this address.</span></label>
 <label className="block text-sm">Email service<select name="provider" value={provider} onChange={e=>setProvider(e.target.value)} className={field}><option value="gmail">Gmail (App Password)</option><option value="smtp">Other SMTP service</option><option value="resend">Resend</option></select></label>
 <label className="block text-sm">Sender email<input name="sender" type="email" required defaultValue={summary.sender || "priyanka6199@gmail.com"} className={field}/></label>
 {provider !== "resend" && <label className="block text-sm">Email login username<input name="user" required defaultValue={summary.user || "priyanka6199@gmail.com"} className={field}/></label>}
 {provider === "smtp" ? <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">SMTP host<input name="host" required defaultValue={summary.host} className={field}/></label><label className="text-sm">SMTP port<input name="port" type="number" min={1} max={65535} defaultValue={summary.port} className={field}/></label></div> : <><input type="hidden" name="host" value=""/><input type="hidden" name="port" value={provider === "gmail" ? "465" : "587"}/></>}
 {provider === "resend" && <input type="hidden" name="user" value=""/>}
 <label className="block text-sm">{provider==="resend" ? "Resend API key" : "App Password / SMTP password"}<input name="secret" type="password" autoComplete="new-password" placeholder={configured ? "Leave blank to keep the saved credential" : "Enter your credential here"} className={field}/></label>
 <p className="text-xs text-foreground-soft">Credentials are encrypted on the server and are never displayed here.</p>
 {provider === "gmail" && <p className="text-sm text-foreground-soft">Enable Google 2-Step Verification, then generate an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-accent underline">App Password</a> for this website. Use that App Password here, rather than your normal Gmail password.</p>}
 {provider === "resend" && <p className="text-sm text-foreground-soft">Use a sender address verified in Resend and an API key with email sending access.</p>}
 <div className="flex flex-wrap gap-3"><button className="btn btn-accent" type="submit">Save email settings</button><button className="btn btn-outline" type="button" disabled={!configured} onClick={async()=>{setBusy(true);try{const result=await testEmailSettings();setMessage(result.message);}catch{setMessage("Test email failed. Please retry.");}finally{setBusy(false);}}}>Send test email</button></div>
 </fieldset></form><p role="status" aria-live="polite" className="mt-4 text-sm">{busy ? "Please wait..." : message}</p></section>;
}
