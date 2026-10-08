import "server-only";
import {eq} from "drizzle-orm";
import {getDb} from "@/lib/db";
import {siteContent} from "@/lib/db/schema";
import {routingSchema, type NotificationRouting} from "@/lib/notification-routing";
export const NOTIFICATION_ROUTING_KEY="email-notifications:recipients";
// Preserve the previously authorized destination until an admin saves routing.
const legacyRecipient="priyanka6199@gmail.com";
export async function getNotificationRouting():Promise<NotificationRouting>{
 const [row]=await getDb().select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,NOTIFICATION_ROUTING_KEY)).limit(1);
 if(!row)return {defaults:{to:[legacyRecipient],cc:[],bcc:[]}};
 // Earlier per-form rules no longer apply: all forms use the common recipients.
 return routingSchema.parse({defaults:(row.value as {defaults:unknown}).defaults});
}
