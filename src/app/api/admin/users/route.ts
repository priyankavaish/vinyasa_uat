import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { validPassword } from "@/lib/password-recovery";
export const runtime = "nodejs";
const schema = z.object({email:z.string().trim().email().max(200).transform(v=>v.toLowerCase()),password:z.string().refine(validPassword,"Use at least 8 characters, up to 72 bytes.")});
export async function POST(req: NextRequest) {
 const denied=await requireAdminSession(req); if(denied)return denied;
 const data=schema.safeParse(await req.json().catch(()=>null));
 if(!data.success)return NextResponse.json({error:data.error.issues[0]?.message || "Check the fields."},{status:400});
 const passwordHash=await bcrypt.hash(data.data.password,12);
 const users=await getDb().insert(adminUsers).values({email:data.data.email,passwordHash}).onConflictDoNothing({target:adminUsers.email}).returning({id:adminUsers.id});
 if(!users.length)return NextResponse.json({error:"A user with this email already exists."},{status:409});
 revalidatePath("/admin/users"); return NextResponse.json({ok:true},{status:201});
}
