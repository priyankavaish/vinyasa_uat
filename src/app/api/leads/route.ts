import { notifyEntry } from "@/lib/email-notifications";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { createLead, listLeads } from "@/lib/store";
import { requireAdminSession } from "@/lib/auth";
import { hasDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!hasDb()) {
    return NextResponse.json(
      { error: "Messaging is temporarily unavailable. Please email priyanka6199@gmail.com." },
      { status: 503 }
    );
  }

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
    const data = parsed.data;
    const lead = await createLead({
      source: data.source,
      name: data.source === "volunteer" ? `${data.name} ${data.lastName}` : data.name,
      email: data.email,
      phone: data.phone,
      message: data.source === "volunteer"
        ? `Volunteering period days: ${[...new Set(data.volunteeringDates)].sort().join(", ")}\nVolunteering type: ${data.volunteeringType}`
        : data.source === "contact"
          ? `Subject: ${data.subject}${data.message ? `\n\n${data.message}` : ""}`
          : data.message,
    });
    revalidatePath("/admin/contact");
    await notifyEntry("lead", lead);
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
