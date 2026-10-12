import { z } from "zod";

export const bookingRequestSchema = z.object({
  type: z.enum(["stay", "event"]),
  itemSlug: z.string().min(1).max(80),
  checkIn: z.string().date().optional(),
  checkOut: z.string().date().optional(),
  eventDate: z.string().date().optional(),
  guests: z.coerce.number().int().min(1).max(20),
  guestName: z.string().trim().min(2).max(100),
  guestEmail: z.string().trim().email().max(150),
  guestPhone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
});
export type BookingRequest = z.infer<typeof bookingRequestSchema>;

export const leadSchema = z.object({
  source: z.enum(["contact", "corporate", "newsletter", "volunteer", "artist-escape", "artist-residence", "artist-unite", "organizer", "stay-enquiry"]),
  name: z.string({ required_error: "Please enter your name.", invalid_type_error: "Please enter your name." }).trim().max(121, "Please keep your name under 122 characters."),
  email: z.string({ required_error: "Please enter your email address.", invalid_type_error: "Please enter a valid email address." }).trim().min(1, "Please enter your email address.").email("Please enter a valid email address, like name@example.com.").max(150, "Please keep your email address under 151 characters."),
  phone: z
    .string()
    .trim()
    .max(20, "Please enter a phone number with no more than 20 characters.")
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(6000, "Please keep your message under 6,001 characters.").optional().or(z.literal("")),
  subject: z.string().trim().max(200, "Please keep your subject under 201 characters.").optional(),
  lastName: z.string().trim().max(60, "Please keep your last name under 61 characters.").optional(),
  artPractice: z.string().trim().max(100).optional(),
  portfolio: z.string().trim().max(2000, "Please use a shorter portfolio link.").optional(),
  country: z.string().trim().max(100).optional(),
  researchInquiry: z.string().trim().max(4000, "Please keep your research enquiry under 4,001 characters.").optional(),
  volunteeringDates: z.array(z.string().date("Please select a valid volunteering date.")).optional(),
  whatsapp: z.string().trim().max(20, "Please enter a WhatsApp number with no more than 20 characters.").regex(/^[0-9+\-\s()]*$/, "Please enter a valid WhatsApp number.").optional().or(z.literal("")),
  guests: z.string().trim().max(4).optional(),
  stayType: z.string().trim().max(150).optional(),
  checkInDate: z.string().trim().max(20).optional(),
  checkOutDate: z.string().trim().max(20).optional(),
  rooms: z.string().trim().max(3).optional(),
  reservePreference: z.string().trim().max(100).optional(),
  intentions: z.array(z.string().trim().max(60)).max(8).optional(),
  programType: z.string().trim().max(100).optional(),
  volunteeringType: z.string().trim().max(100).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  const required = (path: string, message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
  if (data.name.length < 2) {
    const field = (data.source === "volunteer" || data.source === "artist-residence" || data.source === "artist-unite") ? "first name" : "name";
    required("name", data.name ? `Please enter at least 2 characters for your ${field}.` : `Please enter your ${field}.`);
  }
  if (data.source === "contact" && !data.subject) required("subject", "Please enter a subject.");
  if (data.source === "artist-residence" || data.source === "artist-unite") {
    if (!data.phone || data.phone.replace(/[^0-9]/g, "").length < 7) required("phone", "Please enter a valid phone number.");
    if (!data.artPractice) required("artPractice", data.source === "artist-unite" ? "Please enter your artform." : "Please select your art practice.");
    if (!data.portfolio || !z.string().url().safeParse(data.portfolio).success || !/^https?:\/\//i.test(data.portfolio)) required("portfolio", "Please enter a valid portfolio link, starting with https://.");
    if (data.source === "artist-unite" && !data.lastName) required("lastName", "Please enter your last name.");
    if (data.source === "artist-residence" && !data.country) required("country", "Please select your country.");
    if (data.source === "artist-residence" && !data.researchInquiry) required("researchInquiry", "Please briefly describe your research or enquiry.");
  }
  if (data.source === "stay-enquiry") {
    if (!data.phone || data.phone.replace(/[^0-9]/g, "").length < 7) required("phone", "Please enter a valid contact number.");
    const guests = Number(data.guests);
    if (!data.guests || !Number.isInteger(guests) || guests < 1 || guests > 50) required("guests", "Please enter the number of guests.");
    if (!data.stayType) required("stayType", "Please select a stay type.");
    if (!data.checkInDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.checkInDate) || Number.isNaN(Date.parse(data.checkInDate))) required("checkInDate", "Please choose the date you want to check availability for.");
    if (!data.reservePreference) required("reservePreference", "Please choose how you would like to reserve.");
  }
  if (data.source === "organizer") {
    if (!data.programType) required("programType", "Please select a program type.");
    if (!data.phone || data.phone.replace(/[^0-9]/g, "").length < 7) required("phone", "Please enter a valid phone number.");
  }
  if (data.source === "volunteer") {
    if (!data.lastName) required("lastName", "Please enter your last name.");
    if (!data.phone || data.phone.replace(/[^0-9]/g, "").length < 7) required("phone", "Please enter a valid mobile number.");
    if (!data.volunteeringDates?.length) required("volunteeringDates", "Please select a volunteering date or date range.");
    if (!data.volunteeringType) required("volunteeringType", "Please select a volunteering type.");
  }
});
export type LeadRequest = z.infer<typeof leadSchema>;

export const razorpayVerifySchema = z.object({
  bookingId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});
