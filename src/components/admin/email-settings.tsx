"use client";

import { useEffect, useState } from "react";
import { saveEmailSettings, testEmailSettings } from "@/lib/email-actions";

type Summary = {
 configured: boolean; recipient: string; provider: string; sender: string;
 host: string; port: number; user: string; siteUrl?: string;
};

export default function EmailSettings({ summary }: { summary: Summary }) {
 const [siteUrl, setSiteUrl] = useState(summary.siteUrl || "");
 const [provider, setProvider] = useState(summary.provider);
 const [sender, setSender] = useState(summary.sender || "");
 const [user, setUser] = useState(summary.user || "");
 const [secret, setSecret] = useState("");
 const [saved, setSaved] = useState(summary.configured ? { provider: summary.provider, sender: summary.sender, user: summary.user } : null);
 const [busy, setBusy] = useState(false);
 const [message, setMessage] = useState("");
 const [failed, setFailed] = useState(false);
 useEffect(() => { if (!summary.siteUrl) setSiteUrl(window.location.origin); }, [summary.siteUrl]);
 const loginUser = provider === "gmail" ? sender : provider === "resend" ? "" : user;
 const keepCredential = saved?.provider === provider && saved.sender === sender && saved.user === loginUser;
 const field = "mt-1 w-full border border-line bg-white px-3 py-2 text-sm";

 return <section className="mt-6 border border-line bg-white p-6">
  <h2 className="font-display text-xl">Email sender (one-time connection)</h2>
  <p className="mt-2 text-sm">Connect the account used to send notification emails. Choose who receives them in the To field above.</p>
  <p className="mt-2 text-sm text-foreground-soft">Connect once for contact, volunteer, artist, newsletter, corporate and booking forms. No separate setup for each form.</p>
  <div className="mt-5 border border-line bg-background p-4">
   <h3 className="text-sm font-semibold">One-time Gmail connection</h3>
   <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm">
    <li><a href="https://myaccount.google.com/signinoptions/two-step-verification" target="_blank" rel="noopener noreferrer" className="text-accent underline">Open Google security</a> and turn on 2-Step Verification for the Gmail account you want to connect.</li>
    <li><a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-accent underline">Create a Google App Password</a>. Name it Vinyasa Website, then copy the password Google shows.</li>
    <li>Enter that Gmail address and paste the App Password below. Press Save &amp; send test email.</li>
   </ol>
   <p className="mt-3 text-xs text-foreground-soft">Your website administrator can complete this once before handing the site over. Everyday users do not need to repeat it.</p>
  </div>
  <form className="mt-5 space-y-4" onSubmit={async event => {
   event.preventDefault(); setBusy(true); setMessage(""); setFailed(false);
   const data = new FormData(event.currentTarget);
   try {
    const result = await saveEmailSettings(data);
    if (!result.ok) { setFailed(true); setMessage(result.message); return; }
    setSaved({ provider, sender, user: loginUser }); setSecret("");
    const test = await testEmailSettings();
    setFailed(!test.ok);
    setMessage(test.ok ? "Settings saved. " + test.message : "Settings saved, but the test email could not be sent. Check the connected account and App Password, then try again.");
   } catch { setFailed(true); setMessage("Could not complete setup. Please try again."); }
   finally { setBusy(false); }
  }}>
   <fieldset disabled={busy} className="space-y-4">
    <label className="block text-sm" htmlFor="notification-sender">{provider === "gmail" ? "Gmail address to connect" : "Sender email"}
     <input id="notification-sender" name="sender" type="email" required placeholder="sender@example.com" value={sender} onChange={event => { setSender(event.target.value); setMessage(""); }} className={field}/>
    </label>
    {provider === "smtp" ? <label className="block text-sm">Email login username<input name="user" required value={user} onChange={event=>setUser(event.target.value)} className={field}/></label> : <input type="hidden" name="user" value={loginUser}/>}
    <label className="block text-sm" htmlFor="notification-secret">{provider === "resend" ? "Resend API key" : provider === "gmail" ? "Google App Password" : "SMTP password"}
     <input id="notification-secret" name="secret" type="password" autoComplete="new-password" required={!keepCredential} value={secret} onChange={event=>setSecret(event.target.value)} placeholder={keepCredential ? "Already saved. Leave blank to keep it." : provider === "gmail" ? "Paste the password Google generated" : "Enter your credential"} className={field}/>
    </label>
    {provider === "gmail" && <p className="text-xs text-foreground-soft">Use the App Password generated for the Gmail address above. Your regular Gmail password will not work here.</p>}
    <details open={provider !== "gmail"} className="border-t border-line pt-3">
     <summary className="cursor-pointer text-sm text-accent">Advanced settings / existing WordPress email service</summary>
     <div className="mt-4 space-y-4">
      <label className="block text-sm">Email service<select name="provider" value={provider} onChange={event=>{setProvider(event.target.value);setSecret("");setMessage("");}} className={field}><option value="gmail">Gmail</option><option value="smtp">Existing SMTP service</option><option value="resend">Resend</option></select></label>
      <label className="block text-sm">Website address<input name="siteUrl" type="url" required value={siteUrl} onChange={event=>setSiteUrl(event.target.value)} className={field}/><span className="mt-1 block text-xs text-foreground-soft">Filled automatically. Use your live website address after deployment; password reset links use this address.</span></label>
      {provider === "smtp" ? <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">SMTP host<input name="host" required defaultValue={summary.host} className={field}/></label><label className="text-sm">SMTP port<input name="port" type="number" required min={1} max={65535} defaultValue={summary.port} className={field}/></label></div> : <><input type="hidden" name="host" value=""/><input type="hidden" name="port" value={provider === "gmail" ? "465" : "587"}/></>}
      {provider === "resend" && <p className="text-sm text-foreground-soft">Use a verified Resend sender address and an API key with email sending access.</p>}
     </div>
    </details>
    <button className="btn btn-accent w-full" type="submit">{busy ? "Saving and sending test..." : "Save & send test email"}</button>
   </fieldset>
  </form>
  <p role="status" aria-live="polite" className={"mt-4 text-sm " + (failed ? "text-red-700" : "")}>{message}</p>
  <p className="mt-4 text-xs text-foreground-soft">Entries are always available in the admin panel. Use Retry email on earlier entries after connecting. Password reset links go to the registered admin email. Credentials are encrypted and never displayed.</p>
 </section>;
}
