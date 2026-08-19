import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { createLead, listLeads } from "@/lib/store";
import { requireAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const lead = await createLead(parsed.data);
    return NextResponse.json({ lead });
  } catch (err) {
    console.error("[api/leads] failed to create lead", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdminSession(req);
  if (unauthorized) return unauthorized;
  const leads = await listLeads();
  return NextResponse.json({ leads });
}
