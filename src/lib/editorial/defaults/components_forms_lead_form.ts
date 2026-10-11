import type { LeadRequest } from "@/lib/schemas";

type Props = {
  source: LeadRequest["source"];
  title: string;
  submitLabel?: string;
  showMessage?: boolean;
};
type Status = "idle" | "submitting" | "success" | "error";

export const defaults = {
"text_1": "Thank you, we have received your message.",
"text_2": "We'll get back to you shortly. This is an enquiry, not a confirmed booking.",
"text_3": "Send another",
"text_4": "Name",
"text_5": "Email",
"text_6": "Phone (optional)",
"text_7": "Message",
"text_8": "Sending…",
"volunteerSuccessTitle": "Thank you, application received.",
"volunteerSuccessMessage": "The Vinyasa team will review your application and get in touch. Submitting the form does not confirm a place.",
"closeLabel": "Close"
};
