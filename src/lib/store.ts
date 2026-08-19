import { randomUUID } from "crypto";
import { mkdir, appendFile, readFile, writeFile } from "fs/promises";
import path from "path";

// Demo-grade persistence: append-only JSONL, no DB. Swap for a real database
// before this leaves the demo phase (see plan's "NOT in scope").
const DATA_DIR = path.join(process.cwd(), "data");

export type Booking = {
  id: string;
  type: "stay" | "event";
  itemSlug: string;
  checkIn?: string;
  checkOut?: string;
  eventDate?: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  source: "contact" | "corporate" | "newsletter";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
};

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function appendRecord<T>(file: string, record: T): Promise<void> {
  await ensureDataDir();
  await appendFile(path.join(DATA_DIR, file), JSON.stringify(record) + "\n", "utf8");
}

async function readRecords<T>(file: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  const records: T[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed) as T);
    } catch {
      console.warn(`[store] skipped unparseable line in ${file}: ${trimmed.slice(0, 80)}`);
    }
  }
  return records;
}

// Rewrites the whole file. Fine at demo volume; a real DB would use an
// UPDATE instead once this store is retired.
async function rewriteRecords<T>(file: string, records: T[]): Promise<void> {
  await ensureDataDir();
  const body = records.map((r) => JSON.stringify(r)).join("\n") + (records.length ? "\n" : "");
  await writeFile(path.join(DATA_DIR, file), body, "utf8");
}

export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status">
): Promise<Booking> {
  const booking: Booking = {
    ...input,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await appendRecord("bookings.jsonl", booking);
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  extra?: Partial<Pick<Booking, "razorpayOrderId" | "razorpayPaymentId">>
): Promise<Booking | null> {
  const bookings = await readRecords<Booking>("bookings.jsonl");
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], status, ...extra };
  await rewriteRecords("bookings.jsonl", bookings);
  return bookings[idx];
}

export async function getBooking(id: string): Promise<Booking | null> {
  const bookings = await readRecords<Booking>("bookings.jsonl");
  return bookings.find((b) => b.id === id) ?? null;
}

export async function listBookings(): Promise<Booking[]> {
  const bookings = await readRecords<Booking>("bookings.jsonl");
  return bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createLead(input: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const lead: Lead = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  await appendRecord("leads.jsonl", lead);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  const leads = await readRecords<Lead>("leads.jsonl");
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
