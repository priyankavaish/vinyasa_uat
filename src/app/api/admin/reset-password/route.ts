import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { allowRecovery,resetPassword,validPassword } from "@/lib/password-recovery";
export const runtime="nodejs";
export async function POST(req:NextRequest) {
 const data=z.object({token:z.string().regex(/^[A-Za-z0-9_-]{43}$/),password:z.string().refine(validPassword,"Use at least 8 characters, up to 72 bytes.")}).safeParse(await req.json().catch(()=>null));
 if(!data.success)return NextResponse.json({error:"Check the reset link and password (at least 8 characters, up to 72 bytes)."},{status:400});
 const ip=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
 if(!await allowRecovery("reset-ip:"+ip,20,15))return NextResponse.json({error:"Too many attempts. Please try again later."},{status:429});
 if(!await resetPassword(data.data.token,data.data.password))return NextResponse.json({error:"This reset link has expired or has already been used. Request a new link."},{status:400});
 return NextResponse.json({ok:true,message:"Password updated. Sign in with your new password."});
}
