import { Icon, type IconName } from "@/components/ui/icon";
const ACTIONS: ActionLink[] = [
  {
    label: "Check in",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSd8cvRcZ3jD1e--9ydBTe7K00nBEqFlfK09heSp0TUZGueTnw/viewform",
    note: "Share your arrival details",
    icon: "home-outline",
  },
  {
    label: "Make a payment",
    href: "https://razorpay.me/@vinyasaverse",
    note: "Pay securely via Razorpay",
    icon: "ribbon-outline",
  },
  {
    label: "Schedule a call",
    href: "https://calendly.com/vinyasa-earth/connect_call",
    note: "Book a time on Calendly",
    icon: "calendar-outline",
  },
  {
    label: "Leave a Google review",
    href: "https://g.page/r/CZ31HyYgcIyDEBM/review",
    note: "Rate your stay on Google",
    icon: "sparkles-outline",
  },
  {
    label: "Event details template",
    href: "https://docs.google.com/document/d/1MVugxj2JRDGTwBleAM3ysXOg15FWXMbB8SEVYKKC6o4/copy",
    note: "Google Doc — make a copy",
    icon: "compass-outline",
  },
];
const BANK = [
  { label: "Account name", value: "VINYASAVERSE PRIVATE LIMITED" },
  { label: "Account number", value: "925020041471810" },
  { label: "IFSC code", value: "UTIB0005901" },
  { label: "GST", value: "08AALCV7206K1ZV" },
];

type ActionLink = { label: string; href: string; note: string; icon: IconName };

export const defaults = {
seo: {
  title: "Useful Links",
  description:
    "The frequently-used links for Vinyasa Earth — check-in, payments, booking a call, reviews, plus bank and GST details.",
  alternates: { canonical: "/useful-links" },
},
"ACTIONS": ACTIONS,
"BANK": BANK,
"text_1": "Frequently used",
"text_2": "Useful links",
"text_3": "The handful of links and details that come up again and again — pinned in one place for guests and partners.",
"text_4": "Bank & tax details",
"text_5": "For direct transfers",
"text_6": "Payments to Vinyasaverse Private Limited. Please share the reference with us after transferring.",
"text_7": "Quick actions",
"text_8": "Get things done"
};
