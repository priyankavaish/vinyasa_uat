import { Icon, type IconName } from "@/components/ui/icon";
const SERVICES_FALLBACK: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "leaf-outline",
    title: "Retreats",
    body: "Wellness, art, and corporate retreats with eco-lodging in the mud cottages.",
  },
  {
    icon: "camera-outline",
    title: "Venue hire",
    body: "Workshops, events, and creative shoots across the cottages and the amphitheatre.",
  },
  {
    icon: "ribbon-outline",
    title: "Brand partnerships",
    body: "Collaborations aligned with sustainability and wellness values.",
  },
  {
    icon: "sunny-outline",
    title: "Day experiences",
    body: "Non-overnight visits with lunch and a guided tour of the land.",
  },
];
const FAQ_FALLBACK = [
  {
    q: "How do I get there?",
    a: "The farm is road-accessible from Jaipur. An Uber or cab straight to the gate is the easiest way in.",
  },
  {
    q: "What are the stay options?",
    a: "Six themed mud cottages, a shared dorm, and tent stays, depending on the season.",
  },
  {
    q: "Are meals included?",
    a: "Vegetarian meals are included with retreat and residency packages, and available to add for other stays.",
  },
  {
    q: "Can I visit for the day?",
    a: "Yes — without an overnight booking, through an event or a day pass with lunch and a tour.",
  },
  {
    q: "How can I pay?",
    a: "Credit and debit cards, UPI, and bank transfers are all accepted.",
  },
  {
    q: "Can I bring my pet?",
    a: "Pets are generally welcome, with the owner responsible for them on the land.",
  },
];

type Hero = { eyebrow?: string; title?: string; description?: string };
type Service = { icon: string; title: string; body: string };
type Faq = { q: string; a: string };

export const defaults = {
seo: {
  title: "Contact",
  description:
    "Contact Vinyasa Earth in Jaipur about stays, retreats, residencies, venue hire and volunteering. Phone +91 77376 07227, vinyasa.ashram@gmail.com.",
  alternates: { canonical: "/contact" },
},
"SERVICES_FALLBACK": SERVICES_FALLBACK,
"FAQ_FALLBACK": FAQ_FALLBACK,
"text_1": "Get in touch",
"text_2": "We'd love to hear from you",
"text_3": "Questions about a stay, a retreat, venue hire, or volunteering — send a note and the team will write back.",
"text_4": "What we can help with",
"text_5": "Tell us why you're writing",
"text_6": "Good to know",
"text_7": "Common questions"
};
