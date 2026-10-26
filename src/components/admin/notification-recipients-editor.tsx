"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {saveNotificationRouting,testEmailSettings} from "@/lib/email-actions";
import {parseEmailAddresses,type NotificationRecipients,type NotificationRouting} from "@/lib/notification-routing";

const addressFields=(recipients:NotificationRecipients)=>({to:recipients.to.join(", "),cc:recipients.cc.join(", "),bcc:recipients.bcc.join(", ")});
type AddressFields=ReturnType<typeof addressFields>;
export default function NotificationRecipientsEditor({routing}:{routing:NotificationRouting}){
 const router=useRouter();
 const [addresses,setAddresses]=useState(addressFields(routing.defaults));
 const [stays,setStays]=useState(addressFields(routing.stays || routing.defaults));
 const [busy,setBusy]=useState(""),[message,setMessage]=useState(""),[dirty,setDirty]=useState(false);
 const field="mt-1 w-full border border-line bg-white px-3 py-2 text-sm";
 function edit(group:"defaults"|"stays",key:keyof AddressFields,value:string){
  (group==="stays" ? setStays : setAddresses)(previous=>({...previous,[key]:value}));setDirty(true);setMessage("");
 }
 const parsed=(value:AddressFields)=>({to:parseEmailAddresses(value.to),cc:parseEmailAddresses(value.cc),bcc:parseEmailAddresses(value.bcc)});
 async function test(audience:"defaults"|"stays"){
  setBusy(audience);setMessage("");
  try{setMessage((await testEmailSettings(audience)).message);}
  catch{setMessage("Could not send a test. Check the email sender connection below.");}
  finally{setBusy("");}
 }
 function recipientFields(group:"defaults"|"stays",value:AddressFields){
  const id=group==="stays" ? "stay-notification" : "notification";
  return <>
   <label className="block text-sm" htmlFor={id+"-to"}>Send notifications to (To)<textarea id={id+"-to"} rows={2} required value={value.to} onChange={event=>edit(group,"to",event.target.value)} placeholder="notifications@example.com" className={field}/></label>
   <details open={!!value.cc||!!value.bcc} className="border-t border-line pt-3"><summary className="cursor-pointer text-sm text-accent">Optional copies: CC / BCC</summary><div className="mt-4 space-y-3">
    <label className="block text-sm" htmlFor={id+"-cc"}>CC<textarea id={id+"-cc"} rows={2} value={value.cc} onChange={event=>edit(group,"cc",event.target.value)} className={field}/></label>
    <label className="block text-sm" htmlFor={id+"-bcc"}>BCC (hidden copies)<textarea id={id+"-bcc"} rows={2} value={value.bcc} onChange={event=>edit(group,"bcc",event.target.value)} className={field}/></label>
   </div></details>
  </>;
 }
 return <section id="form-recipients" className="mt-6 border border-line bg-white p-6">
 <h2 className="font-display text-xl">Enquiry notification emails</h2>
 <p className="mt-2 text-sm text-foreground-soft">Choose a separate inbox for stays and Work from Farm. Other website notifications use your general recipients.</p>
 <form noValidate className="mt-5" onSubmit={async event=>{event.preventDefault();setBusy("save");setMessage("");try{
  const result=await saveNotificationRouting({defaults:parsed(addresses),stays:parsed(stays)});
  setMessage(result.message);if(result.ok){setDirty(false);router.refresh();}
 }catch{setMessage("Could not save. Please retry.");}finally{setBusy("");}}}>
 <fieldset disabled={!!busy} className="space-y-5">
  <div className="space-y-3"><h3 className="text-base font-semibold">General notifications</h3><p className="text-sm text-foreground-soft">Contact, volunteer, artist, corporate, newsletter and booking notifications.</p>{recipientFields("defaults",addresses)}
   <button className="btn btn-outline" type="button" disabled={dirty} onClick={()=>test("defaults")}>{busy==="defaults"?"Sending...":"Send general test email"}</button>
  </div>
  <div className="space-y-3 border-t border-line pt-5"><h3 className="text-base font-semibold">Stays &amp; Work from Farm enquiries</h3><p className="text-sm text-foreground-soft">Enquiries from the stays and Work from Farm booking forms go only to these recipients.</p>{recipientFields("stays",stays)}
   <p className="text-xs leading-5 text-foreground-soft">Open an enquiry in this inbox and press Reply to respond to the guest. Send the reply from this mailbox.</p>
   <button className="btn btn-outline" type="button" disabled={dirty} onClick={()=>test("stays")}>{busy==="stays"?"Sending...":"Send stays test email"}</button>
  </div>
  <p className="text-xs text-foreground-soft">Separate multiple addresses with commas. Each group's CC and BCC apply only to that group.</p>
  <button className="btn btn-accent" type="submit">{busy==="save"?"Saving...":"Save notification emails"}</button>
  {dirty&&<p className="text-xs text-foreground-soft">Save your changes before sending a test.</p>}
 </fieldset></form>
 <p role="status" aria-live="polite" className="mt-4 text-sm">{message}</p>
 <p className="mt-3 text-xs text-foreground-soft">Notifications use the sender connection below. Replies sent from your email inbox use that mailbox's account.</p>
 </section>;
}
