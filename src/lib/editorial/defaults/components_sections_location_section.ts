import { Icon, type IconName } from "@/components/ui/icon";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GOOGLE_MAPS_EMBED_SRC, GOOGLE_MAPS_LINK, GOOGLE_RATING } from "@/lib/site";
const CONTACT_ITEMS: Array<{ label: string; value: string; icon: IconName; href?: string }> = [
  { label: "Address", value: ADDRESS, icon: "home-outline" },
  { label: "Phone / WhatsApp", value: CONTACT_PHONE_DISPLAY, icon: "logo-whatsapp", href: `tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}` },
  { label: "Email", value: CONTACT_EMAIL, icon: "ribbon-outline", href: `mailto:${CONTACT_EMAIL}` },
  { label: "Hours", value: `${GOOGLE_RATING.hours} (Google Business Profile)`, icon: "sunny-outline" },
];



export const defaults = {
"CONTACT_ITEMS": CONTACT_ITEMS,
"ADDRESS": ADDRESS,
"GOOGLE_MAPS_EMBED_SRC": GOOGLE_MAPS_EMBED_SRC,
"GOOGLE_MAPS_LINK": GOOGLE_MAPS_LINK,
"GOOGLE_RATING": GOOGLE_RATING,
"text_1": "Vinyasa Earth",
"aria_label_2": "Open Vinyasa Earth in Google Maps",
"title_3": "Vinyasa Earth location",
"text_4": "Write to us",
"text_5": "Start a conversation",
"title_6": "Send a message",
"text_7": " Find us",
"text_8": "Close to nature, rooted in Rajasthan",
"text_9": "Get directions "
};
