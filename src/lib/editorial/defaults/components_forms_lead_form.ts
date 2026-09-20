import type { LeadRequest } from "@/lib/schemas";

type Props = {
  source: LeadRequest["source"];
  title: string;
  submitLabel?: string;
  showMessage?: boolean;
};
type Status = "idle" | "submitting" | "success" | "error";

export const defaults = {
"text_1": "Thank you, message sent.",
"text_2": "We'll get back to you shortly.",
"text_3": "Send another",
"text_4": "Name",
"text_5": "Email",
"text_6": "Phone (optional)",
"text_7": "Message",
"text_8": "Sending…"
};
