import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findAdminByEmail } from "@/lib/db/users";
import { getEmailConfig, sendAccountEmail } from "@/lib/email-notifications";
import { allowRecovery, issueReset, revokeReset } from "@/lib/password-recovery";
export const runtime="nodejs";
export async function POST(req:NextRequest) {
 const parsed=z.object({email:z.string().trim().email().max(200).transform(v=>v.toLowerCase())}).safeParse(await req.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:"Enter a valid email address."},{status:400});
 const config=await getEmailConfig().catch(()=>null);
 const origin=config?.siteUrl || process.env.SITE_ORIGIN || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.NODE_ENV !== "production" ? req.nextUrl.origin : "");
 if(!config || !origin)return NextResponse.json({error:"Password recovery email is not configured. Ask an administrator to complete Email settings."},{status:503});
 const ip=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
 if(!await allowRecovery("ip:"+ip,10,60))return NextResponse.json({error:"Too many requests. Please try again later."},{status:429});
 // The same response is returned for unknown accounts and account-level limits.
 if(await allowRecovery("email:"+parsed.data.email,3,15)){
 const user=await findAdminByEmail(parsed.data.email);
 if(user){const token=await issueReset(user.id);
 try{const url=new URL("/admin/reset-password",origin);url.searchParams.set("token",token);
 await sendAccountEmail(config,user.email,"Vinyasa Earth: reset your admin password",["A password reset was requested for your Vinyasa Earth admin account.","","Reset your password: "+url.toString(),"","This link expires in 30 minutes and can be used once.","If you did not request this, you can ignore this email."].join("\n"));
 }catch{await revokeReset(token);console.error("[email] Password recovery delivery failed.");}}
 }
 return NextResponse.json({ok:true,message:"If this email belongs to an admin account, a reset link will be sent. Check your inbox and Spam."});
}
