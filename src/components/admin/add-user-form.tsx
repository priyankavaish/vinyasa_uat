"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
export default function AddUserForm(){
 const router=useRouter(),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const field="mt-1 w-full border border-line bg-white px-3 py-2 text-sm";
 return <section className="mt-6 max-w-lg border border-line bg-white p-6"><h2 className="text-xl">Add user</h2><p className="mt-2 text-sm text-foreground-soft">New users receive full administrator access to content, bookings, enquiries and settings.</p>
 <form className="mt-5 space-y-4" onSubmit={async e=>{e.preventDefault();const form=e.currentTarget,data=new FormData(form);if(data.get("password")!==data.get("confirm")){setMessage("Passwords do not match.");return;}setBusy(true);setMessage("");try{const res=await fetch("/api/admin/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:data.get("email"),password:data.get("password")})});const result=await res.json();if(!res.ok)throw Error(result.error);form.reset();setMessage("User added. They can sign in with the email and password you provided.");router.refresh();}catch(error){setMessage(error instanceof Error?error.message:"Could not add user.");}finally{setBusy(false);}}}>
 <fieldset disabled={busy} className="space-y-4"><label className="block text-sm">Email<input name="email" type="email" required autoComplete="off" className={field}/></label><label className="block text-sm">Password<input name="password" type="password" minLength={8} maxLength={72} required autoComplete="new-password" className={field}/></label><label className="block text-sm">Confirm password<input name="confirm" type="password" required autoComplete="new-password" className={field}/></label><button className="btn btn-accent" type="submit">{busy?"Adding...":"Add user"}</button></fieldset></form><p className="mt-4 text-sm" role="status">{message}</p></section>;
}
