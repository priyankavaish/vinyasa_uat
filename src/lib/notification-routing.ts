import {z} from "zod";
const address=z.string().trim().email("Enter valid email addresses only.").max(254).transform(value=>value.toLowerCase());
export const recipientsSchema=z.object({
 to:z.array(address).min(1,"Add at least one To email address.").max(20),
 cc:z.array(address).max(20).default([]),
 bcc:z.array(address).max(20).default([]),
}).strict().transform(value=>{
 const seen=new Set<string>();
 const unique=(items:string[])=>items.filter(item=>{if(seen.has(item))return false;seen.add(item);return true;});
 return {to:unique(value.to),cc:unique(value.cc),bcc:unique(value.bcc)};
});
export type NotificationRecipients=z.infer<typeof recipientsSchema>;
export const routingSchema=z.object({defaults:recipientsSchema}).strict();
export type NotificationRouting=z.infer<typeof routingSchema>;
export function parseEmailAddresses(value:string){return value.split(/[,;\n]+/).map(item=>item.trim()).filter(Boolean);}
