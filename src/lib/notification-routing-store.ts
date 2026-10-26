import "server-only";
import {eq} from "drizzle-orm";
import {getDb} from "@/lib/db";
import {siteContent} from "@/lib/db/schema";
import {routingSchema, type NotificationRouting} from "@/lib/notification-routing";
export const NOTIFICATION_ROUTING_KEY="email-notifications:recipients";
const legacyRecipient="priyanka6199@gmail.com";
// Dedicated inbox requested for stays and Work from Farm enquiries.
const stayRecipients={to:["lexabizagency@gmail.com"],cc:[],bcc:[]};
export async function getNotificationRouting():Promise<NotificationRouting>{
 const [row]=await getDb().select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,NOTIFICATION_ROUTING_KEY)).limit(1);
 if(!row)return {defaults:{to:[legacyRecipient],cc:[],bcc:[]},stays:stayRecipients};
 const saved=row.value as {defaults:unknown;stays?:unknown};
 // Read only supported routes; older per-form rules remain inactive.
 return routingSchema.parse({defaults:saved.defaults,stays:saved.stays ?? stayRecipients});
}
