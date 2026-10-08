import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import {SESSION_COOKIE,readSessionToken} from "@/lib/auth";
import {enquiryReplySchema,sendEnquiryReply} from "@/lib/enquiry-replies";
import {revalidatePath} from "next/cache";
export const runtime="nodejs";
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 const admin=await readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
 if(!admin)return NextResponse.json({error:"Unauthorized."},{status:401});
 const {id}=await params;
 if(!z.string().uuid().safeParse(id).success)return NextResponse.json({error:"Invalid enquiry."},{status:400});
 const parsed=enquiryReplySchema.safeParse(await req.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||"Check the subject and message."},{status:400});
 const result=await sendEnquiryReply(id,admin.email,parsed.data);
 revalidatePath("/admin/contact");
 return NextResponse.json({ok:result.ok,message:result.message,...(!result.ok?{error:result.message}:{})},{status:result.status});
}
