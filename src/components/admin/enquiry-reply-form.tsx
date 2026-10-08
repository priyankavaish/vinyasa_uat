"use client";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import type {Lead} from "@/lib/store";
import type {EnquiryReply} from "@/lib/enquiry-replies";

export default function EnquiryReplyForm({lead,replies}:{lead:Lead;replies:EnquiryReply[]}){
 const router=useRouter(),requestId=useRef<string|null>(null);
 const [subject,setSubject]=useState("Re: Your "+lead.source.replaceAll("-"," ")+" enquiry - Vinyasa Earth");
 const [message,setMessage]=useState(""),[status,setStatus]=useState(""),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false);
 const field="mt-1 w-full border border-line bg-white px-3 py-2 text-sm";
 return <section className="mt-6 border-t border-line pt-5">
 <h3 className="font-display text-xl">Reply by email</h3>
 <p className="mt-1 text-xs text-foreground-soft">Send a reply directly to the person who submitted this enquiry.</p>
 <form className="mt-4 space-y-4" onSubmit={async event=>{
  event.preventDefault();setBusy(true);setStatus("");setFailed(false);
  requestId.current??=crypto.randomUUID();
  try{
   const response=await fetch("/api/admin/leads/"+lead.id+"/reply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:requestId.current,subject,message})});
   const result=await response.json();setStatus(result.message||result.error||"Could not send this reply.");setFailed(!response.ok);
   if(response.ok){setMessage("");requestId.current=null;}
   router.refresh();
  }catch{setFailed(true);setStatus("Could not confirm sending. Keep this message and retry without changing it to avoid sending a duplicate.");}
  finally{setBusy(false);}
 }}>
 <fieldset disabled={busy} className="space-y-4">
 <label className="block text-sm" htmlFor={"reply-to-"+lead.id}>To<input id={"reply-to-"+lead.id} type="email" readOnly value={lead.email} className={field}/></label>
 <label className="block text-sm" htmlFor={"reply-subject-"+lead.id}>Subject<input id={"reply-subject-"+lead.id} required maxLength={200} value={subject} onChange={event=>{setSubject(event.target.value);requestId.current=null;}} className={field}/></label>
 <label className="block text-sm" htmlFor={"reply-message-"+lead.id}>Message<textarea id={"reply-message-"+lead.id} required maxLength={10000} rows={6} value={message} onChange={event=>{setMessage(event.target.value);requestId.current=null;}} placeholder={"Hi "+lead.name+",\n\nThank you for reaching out..."} className={field}/></label>
 <button type="submit" className="btn btn-accent">{busy?"Sending...":"Send reply"}</button>
 </fieldset></form>
 <p role="status" aria-live="polite" className={"mt-3 text-sm "+(failed?"text-red-700":"")}>{status}</p>
 <p className="mt-2 text-xs text-foreground-soft">Uses the sender connected in <Link href="/admin/settings" className="text-accent underline">Email settings</Link>.</p>
 {replies.length>0&&<div className="mt-6"><h4 className="font-semibold">Reply history</h4><div className="mt-3 space-y-3">{replies.map(reply=><details key={reply.id} className="border border-line bg-white p-4">
 <summary className="cursor-pointer text-sm"><span className="font-semibold">{reply.subject}</span><span className="ml-2 capitalize text-foreground-soft">{reply.state==="sending"?"Awaiting confirmation":reply.state}</span></summary>
 <p className="mt-3 break-all text-xs text-foreground-soft">To: {reply.to} · By: {reply.sentBy} · {new Date(reply.updatedAt).toLocaleString("en-IN")}</p>
 <p className="mt-3 whitespace-pre-wrap break-words text-sm">{reply.message}</p>
 {reply.error&&<p className="mt-2 text-xs text-red-700">{reply.error}</p>}
 {reply.state==="failed"&&<button type="button" disabled={busy} className="mt-3 text-sm text-accent underline" onClick={()=>{setSubject(reply.subject);setMessage(reply.message);requestId.current=reply.id;setStatus("Failed reply loaded. Check the message, then press Send reply.");setFailed(false);}}>Load failed reply to retry</button>}
 </details>)}</div></div>}
 </section>;
}
