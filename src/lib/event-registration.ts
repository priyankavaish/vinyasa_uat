export type EventRegistrationSettings = { showBooking: boolean; showRegistration: boolean; bookingHtml: string };
export const eventRegistrationKey = (slug: string) => `event-registration:${slug}`;
export function eventRegistrationSettings(value: unknown): EventRegistrationSettings {
  const saved = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    bookingHtml: typeof saved.bookingHtml === "string" ? saved.bookingHtml : "",
    showBooking: typeof saved.showBooking === "boolean" ? saved.showBooking : true,
    showRegistration: typeof saved.showRegistration === "boolean" ? saved.showRegistration : false,
  };
}
export function eventRegistrationFromForm(form: FormData): (Omit<EventRegistrationSettings, "bookingHtml"> & { bookingHtml?: string }) | null {
  if (!form.has("eventRegistrationSettings")) return null;
  return { ...(form.has("eventBookingHtml") ? { bookingHtml: String(form.get("eventBookingHtml") ?? "") } : {}), showBooking: form.get("eventShowBooking") === "on", showRegistration: form.get("eventShowRegistration") === "on" };
}

export function hasBookingContent(html: string): boolean {
  return /<(?:img|hr)\b/i.test(html) || !!html.replace(/<[^>]*>|&nbsp;|\s/g, "");
}
