export type EventRegistrationSettings = { showBooking: boolean; showRegistration: boolean };
export const eventRegistrationKey = (slug: string) => `event-registration:${slug}`;
export function eventRegistrationSettings(value: unknown): EventRegistrationSettings {
  const saved = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    showBooking: typeof saved.showBooking === "boolean" ? saved.showBooking : true,
    showRegistration: typeof saved.showRegistration === "boolean" ? saved.showRegistration : false,
  };
}
export function eventRegistrationFromForm(form: FormData): EventRegistrationSettings | null {
  if (!form.has("eventRegistrationSettings")) return null;
  return { showBooking: form.get("eventShowBooking") === "on", showRegistration: form.get("eventShowRegistration") === "on" };
}
