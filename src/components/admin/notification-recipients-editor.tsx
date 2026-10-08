"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {saveNotificationRouting,testEmailSettings} from "@/lib/email-actions";
import {parseEmailAddresses,type NotificationRouting} from "@/lib/notification-routing";
export default function NotificationRecipientsEditor({routing}:{routing:NotificationRouting}){
 const router=useRouter();
 const [addresses,setAddresses]=useState({to:routing.defaults.to.join(", "),cc:routing.defaults.cc.join(", "),bcc:routing.defaults.bcc.join(", ")});
 const [busy,setBusy]=useState(""),[message,setMessage]=useState(""),[dirty,setDirty]=useState(false);
 const field="mt-1 w-full border border-line bg-white px-3 py-2 text-sm";
 function edit(key:"to"|"cc"|"bcc",value:string){setAddresses(previous=>({...previous,[key]:value}));setDirty(true);setMessage("");}
 return <section id="form-recipients" className="mt-6 border border-line bg-white p-6">
 <h2 className="font-display text-xl">Receive all form submissions</h2>
 <p className="mt-2 text-sm text-foreground-soft">Enter your team's email once. Contact, volunteer, artist, corporate, newsletter, stay and event booking notifications will all go to these recipients.</p>
 <form noValidate className="mt-5" onSubmit={async event=>{event.preventDefault();setBusy("save");setMessage("");try{
 const result=await saveNotificationRouting({defaults:{to:parseEmailAddresses(addresses.to),cc:parseEmailAddresses(addresses.cc),bcc:parseEmailAddresses(addresses.bcc)}});
 setMessage(result.message);if(result.ok){setDirty(false);router.refresh();}
 }catch{setMessage("Could not save. Please retry.");}finally{setBusy("");}}}>
 <fieldset disabled={!!busy} className="space-y-4">
 <label className="block text-sm" htmlFor="notification-to">Send notifications to (To)<textarea id="notification-to" rows={2} required value={addresses.to} onChange={event=>edit("to",event.target.value)} placeholder="notifications@example.com" className={field}/></label>
 <p className="text-xs text-foreground-soft">For more than one recipient, separate email addresses with commas.</p>
 <details open={!!addresses.cc||!!addresses.bcc} className="border-t border-line pt-3"><summary className="cursor-pointer text-sm text-accent">Optional copies: CC / BCC</summary><div className="mt-4 space-y-3">
 <label className="block text-sm" htmlFor="notification-cc">CC<textarea id="notification-cc" rows={2} value={addresses.cc} onChange={event=>edit("cc",event.target.value)} placeholder="team@example.com" className={field}/></label>
 <label className="block text-sm" htmlFor="notification-bcc">BCC (hidden copies)<textarea id="notification-bcc" rows={2} value={addresses.bcc} onChange={event=>edit("bcc",event.target.value)} placeholder="archive@example.com" className={field}/></label>
 </div></details>
 <div className="flex flex-wrap gap-3"><button className="btn btn-accent" type="submit">{busy==="save"?"Saving...":"Save notification email"}</button>
 <button className="btn btn-outline" type="button" disabled={dirty} onClick={async()=>{setBusy("test");setMessage("");try{setMessage((await testEmailSettings()).message);}catch{setMessage("Could not send a test. Check the email sender connection below.");}finally{setBusy("");}}}>{busy==="test"?"Sending...":"Send test email"}</button></div>
 {dirty&&<p className="text-xs text-foreground-soft">Save your changes before sending a test.</p>}
 </fieldset></form>
 <p role="status" aria-live="polite" className="mt-4 text-sm">{message}</p>
 <p className="mt-3 text-xs text-foreground-soft">This one setting applies to every website form. Email delivery requires the sender connection below to be configured once.</p>
 </section>;
}
