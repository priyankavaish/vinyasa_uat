import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/site";
const exploreLinks = [
  { href: "/stays", label: "Stays" },
  { href: "/events", label: "Events & Retreats" },
  { href: "/volunteering", label: "Corporate Offsites" },
  { href: "/about", label: "Our Story" },
  { href: "/useful-links", label: "Useful Links" },
  { href: "/blogs", label: "Blogs" },
] as const;



export const defaults = {
"exploreLinks": exploreLinks,
"ADDRESS": ADDRESS,
"CONTACT_EMAIL": CONTACT_EMAIL,
"CONTACT_PHONE_DISPLAY": CONTACT_PHONE_DISPLAY,
"text_1": "Vinyasa Earth",
"text_2": "A hand-built home for slow stays, creative practice, and meaningful gatherings in the quiet landscape of Rajasthan.",
"href_3": "/book",
"text_4": "Plan your stay",
"aria_label_5": "Footer navigation",
"text_6": "Explore",
"text_7": "Find us",
"href_8": "https://www.instagram.com/vinyasa.earth/",
"text_9": "@vinyasa.earth",
"href_youtube": "https://www.youtube.com/@VinyasaEarth",
"text_youtube": "Watch on YouTube",
"text_10": "© ",
"text_11": " Vinyasa Earth. Rooted in Rajasthan.",
"text_12": "Crafted with care by",
"href_13": "https://lexabiz.in/",
"text_14": "Lexabiz"
};
