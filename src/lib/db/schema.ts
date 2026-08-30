import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  uuid,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Auth + analytics
// ---------------------------------------------------------------------------

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  referer: text("referer"),
  ua: text("ua"),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Bookings + leads (moved off the old JSONL store)
// ---------------------------------------------------------------------------

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(), // "stay" | "event"
  itemSlug: text("item_slug").notNull(),
  checkIn: text("check_in"),
  checkOut: text("check_out"),
  eventDate: text("event_date"),
  guests: integer("guests").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"), // pending | paid | failed
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  source: text("source").notNull(), // contact | corporate | newsletter | volunteer
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// CMS content
// ---------------------------------------------------------------------------

export const cottages = pgTable("cottages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  element: text("element").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("home-outline"),
  accent: text("accent").notNull().default("#8f3b31"),
  pricePerNight: integer("price_per_night").notNull().default(0),
  maxGuests: integer("max_guests").notNull().default(2),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  bodyHtml: text("body_html").notNull().default(""),
  sort: integer("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const visitOptions = pgTable("visit_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const partners = pgTable("partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull().default(""),
  description: text("description").notNull().default(""),
  link: text("link").notNull().default("/contact"),
  sort: integer("sort").notNull().default(0),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  kind: text("kind").notNull().default("retreat"), // workshop | retreat | residency
  durationLabel: text("duration_label").notNull().default(""),
  dateLabel: text("date_label").notNull().default(""),
  facilitator: text("facilitator").notNull().default(""),
  priceFrom: integer("price_from").notNull().default(0),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  bodyHtml: text("body_html").notNull().default(""),
  sort: integer("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  coverUrl: text("cover_url").notNull().default(""),
  bodyHtml: text("body_html").notNull().default(""),
  status: text("status").notNull().default("draft"), // draft | published
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// key/value blob for editable page copy (home, about, contact)
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CottageRow = typeof cottages.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type BlogRow = typeof blogs.$inferSelect;
export type VisitOptionRow = typeof visitOptions.$inferSelect;
export type PartnerRow = typeof partners.$inferSelect;
export type BookingRow = typeof bookings.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
