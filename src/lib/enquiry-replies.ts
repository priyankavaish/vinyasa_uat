import "server-only";
import {createHash} from "node:crypto";
import {eq,like,sql} from "drizzle-orm";
import {getDb} from "@/lib/db";
import {leads,siteContent} from "@/lib/db/schema";
import {getEmailConfig,sendAccountEmail} from "@/lib/email-notifications";
import {z} from "zod";

export const enquiryReplySchema=z.object({
 requestId:z.string().uuid(),
 subject:z.string().trim().min(1,"Enter a subject.").max(200).refine(value=>!/[\r\n]/.test(value),"Subject must be a single line."),
 message:z.string().trim().min(1,"Enter your message.").max(10000),
}).strict();
export type EnquiryReply={
 id:string;leadId:string;to:string;subject:string;message:string;sentBy:string;
 state:"sending"|"sent"|"failed";createdAt:string;updatedAt:string;contentHash:string;error?:string;
};
type Result={ok:boolean;status:number;message:string;reply?:EnquiryReply};
export async function listEnquiryReplies(){
 const rows=await getDb().select({value:siteContent.value}).from(siteContent).where(like(siteContent.key,"enquiry-reply:%"));
 return rows.map(row=>row.value as EnquiryReply).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
export async function sendEnquiryReply(leadId:string,adminEmail:string,input:z.infer<typeof enquiryReplySchema>):Promise<Result>{
 const db=getDb();
 const [lead]=await db.select().from(leads).where(eq(leads.id,leadId)).limit(1);
 if(!lead)return {ok:false,status:404,message:"This enquiry no longer exists."};
 if(!z.string().email().safeParse(lead.email).success)return {ok:false,status:400,message:"This enquiry does not have a valid reply email address."};
 const config=await getEmailConfig().catch(()=>null);
 if(!config)return {ok:false,status:503,message:"Connect an email sender in Admin > Settings before sending replies. Your message has not been sent."};
 const now=new Date().toISOString(),key="enquiry-reply:"+leadId+":"+input.requestId;
 const contentHash=createHash("sha256").update(JSON.stringify([lead.email,input.subject,input.message])).digest("hex");
 const reply:EnquiryReply={id:input.requestId,leadId,to:lead.email,subject:input.subject,message:input.message,sentBy:adminEmail,state:"sending",createdAt:now,updatedAt:now,contentHash};
 const claimed=await db.execute(sql`INSERT INTO site_content(key,value)VALUES(${key},${JSON.stringify(reply)}::jsonb)
 ON CONFLICT(key)DO UPDATE SET value=EXCLUDED.value,updated_at=now()
 WHERE site_content.value->>'state'='failed' AND site_content.value->>'contentHash'=${contentHash} RETURNING key`);
 const rows=Array.isArray(claimed)?claimed:(claimed as {rows?:unknown[]}).rows||[];
 if(!rows.length){
  const [existing]=await db.select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,key)).limit(1);
  const previous=existing?.value as EnquiryReply|undefined;
  if(previous?.contentHash!==contentHash)return {ok:false,status:409,message:"This send request was already used for another message. Refresh the enquiry before composing a new reply."};
  if(previous.state==="sent")return {ok:true,status:200,message:"This reply has already been sent.",reply:previous};
  return {ok:false,status:409,message:"This reply is already being sent or awaiting confirmation. Refresh the enquiry before trying again."};
 }
 try{
  await sendAccountEmail(config,lead.email,input.subject,input.message,config.sender,key);
 }catch{
  reply.state="failed";reply.error="The email service could not confirm sending. Check email settings and retry.";reply.updatedAt=new Date().toISOString();
  await db.update(siteContent).set({value:reply,updatedAt:new Date()}).where(eq(siteContent.key,key));
  return {ok:false,status:502,message:reply.error,reply};
 }
 reply.state="sent";reply.updatedAt=new Date().toISOString();
 try{await db.update(siteContent).set({value:reply,updatedAt:new Date()}).where(eq(siteContent.key,key));}
 catch{
  console.error("[email] Reply accepted but history update failed",{leadId,replyId:input.requestId});
  return {ok:true,status:200,message:"Email accepted for sending, but the history update is pending. Do not resend this message.",reply};
 }
 return {ok:true,status:200,message:"Reply sent. A copy is saved with this enquiry.",reply};
}
