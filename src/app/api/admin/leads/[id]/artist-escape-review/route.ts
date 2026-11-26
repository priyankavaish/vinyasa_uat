import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";
import { approvalDetails, approveArtist, getArtistRejection, rejectArtist } from "@/lib/artist-escape-booking";
import { withStayBookingLock } from "@/lib/stay-booking-lock";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };
const reviewSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve") }),
  z.object({ action: z.literal("reject"), remark: z.string().trim().min(1, "Enter a rejection remark.").max(2000) }),
]);

export async function GET(req: NextRequest, { params }: Context) {
  const admin = await readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = z.string().uuid().parse((await params).id);
    const approval = await approvalDetails(id, req.nextUrl.origin);
    const rejection = await getArtistRejection(id);
    return NextResponse.json({ approval, rejection }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load application review." }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: Context) {
  const admin = await readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });

  try {
    const id = z.string().uuid().parse((await params).id);
    const result = reviewSchema.safeParse(await req.json());
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    return await withStayBookingLock(async () => {
      if (result.data.action === "reject") {
        const rejection = await rejectArtist(id, admin.email, result.data.remark);
        return NextResponse.json({ approval: null, rejection });
      }
      const approval = await approveArtist(id, admin.email, req.nextUrl.origin);
      return NextResponse.json({ approval, rejection: null });
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save application review." }, { status: 400 });
  }
}