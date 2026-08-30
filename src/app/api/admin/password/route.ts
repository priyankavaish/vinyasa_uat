import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { getSessionUser } from "@/lib/auth-server";
import { verifyAdmin, setAdminPassword } from "@/lib/db/users";

export const runtime = "nodejs";

const schema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8, "Use at least 8 characters.").max(200),
});

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession(req);
  if (unauthorized) return unauthorized;

  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the fields." },
      { status: 400 }
    );
  }

  const ok = await verifyAdmin(user.email, parsed.data.currentPassword);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await setAdminPassword(user.email, parsed.data.newPassword);
  return NextResponse.json({ ok: true });
}
