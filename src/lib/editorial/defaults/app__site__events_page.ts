import { Icon, type IconName } from "@/components/ui/icon";
import gatherImg from "@/app/assets/new/community-02.jpg";
const KIND_META: Record<string, { icon: IconName; accent: string; label: string }> = {
  residency: { icon: "compass-outline", accent: "#8f3b31", label: "Residency" },
  retreat: { icon: "leaf-outline", accent: "#6b7a5e", label: "Retreat" },
  workshop: { icon: "sparkles-outline", accent: "#a06a2c", label: "Workshop" },
};
const EVENT_DISPLAY: Record<string, { name: string; date: string; duration: string; facilitator?: string; description: string; image: string }> = {
  "artist-in-residence": { name: "Artist-in-Residence Program (October \u2013 Jan 2027)", date: "1 Oct 2026 - 31 Jan 2027", duration: "4 months - October to January", description: "A four-month immersive residency where two selected artists live, explore and create in a nature-led, community-oriented environment.", image: "/seed/community-05.jpg" },
  "anhad-ka-baaja": { name: "Anhad ka Baaja", date: "12 Sep 2026", duration: "One evening - 6:00 pm", facilitator: "Priyal", description: "An intimate evening of Kabir bhajans, listening and singing along to poetry that is meant to be felt and shared.", image: "/seed/community-02.jpg" },
  "the-pause-within": { name: "The Pause Within", date: "18-20 Sep 2026", duration: "3 days / 2 nights", facilitator: "Nikita Chawda", description: "A two-night residential retreat exploring how stress lives differently in each of us and what those experiences are trying to tell us.", image: "/seed/grounds-08.jpg" },
  "artist-unite": { name: "Artist Unite - A Residency of Self Creation", date: "15-24 Oct 2026", duration: "10 days", description: "An intensive residency on collaborative artistic practice and a chance to experience how other artists work.", image: "/seed/community-06.jpg" },
  zariya: { name: "Zariya - Connecting Creators", date: "24 Oct 2026", duration: "One day - 4:00 to 11:00 pm", description: "Vinyasa Earth's annual sunset gathering of art, conversations, performances, music and creative people.", image: "/seed/community-01.jpg" },
  "drishti-new-years-retreat": { name: "Drishti - New Year's Retreat", date: "29 Dec 2026 - 1 Jan 2027", duration: "3 days", description: "Step away from the noise, reflect on the year that has been and make grounded space for the one ahead.", image: "/seed/grounds-05.jpg" },
  "performing-lab-retreat": { name: "Performing Lab Retreat", date: "17-22 Jan 2027", duration: "5 days", facilitator: "Sukh Ahlstrom", description: "A five-day intensive in physical theatre, Kalaripayattu and movement for performers and creative explorers.", image: "/seed/community-03.jpg" },
};



export const defaults = {
seo: {
    keywords: "",
  title: "Events & Retreats",
  description: "Artist residencies, retreats, workshops and gatherings at Vinyasa Earth.",
  alternates: { canonical: "/events" },
},
"KIND_META": KIND_META,
"EVENT_DISPLAY": EVENT_DISPLAY,
"gatherImg": gatherImg,
"text_1": "From a single evening of Kabir bhajans to a four-month residency, every programme follows the rhythm of the land and its community. Gatherings that make room to create, connect and slow down — each one seasonal, and intentionally small.",
"eyebrow_2": "Residencies / Retreats / Workshops",
"title_3": "Time and space to make what matters",
"description_4": "From a single evening of Kabir bhajans to a four-month residency, every programme follows the rhythm of the land and its community.",
"image_5": "/images/events-hero.jpg",
"imageAlt_6": "A large mural of clasped hands on a mud-plastered wall at Vinyasa Earth",
"text_7": "The 2026-27 calendar",
"text_8": "Every gathering, closest first — add the ones you want straight to your Google Calendar, or open the full programme.",
"text_9": "Add to calendar",
"text_10": "Details",
"organizerEyebrow": "Host with us",
"organizerTitle": "Want to organize your program or event?",
"organizerText": "Vinyasa Earth is open to organizers, artists, event planners and businesses who wish to host a mindful program, event or workshop. Let's brew something interesting together.",
"organizerNameLabel": "Name",
"organizerProgramTypeLabel": "Program Type",
"organizerProgramTypePlaceholder": "Select program type",
"organizerProgramTypes": ["Workshop", "Event", "Offsite", "Retreat"],
"organizerEmailLabel": "Email",
"organizerPhoneLabel": "Phone",
"organizerSubmitLabel": "Get the Deck",
"organizerSendingLabel": "Sending...",
"organizerSuccessTitle": "Thank you, we have your enquiry.",
"organizerSuccessMessage": "The Vinyasa team will get in touch with you shortly. For anything urgent, write to vinyasa.ashram@gmail.com.",
"organizerDeckUrl": "https://drive.google.com/file/d/1GAJc_SYZG-jIfRq1RQ1nm_ACqO2x4pBr/view",
"organizerDeckLabel": "Download the Organizer's Deck",
"organizerCloseLabel": "Close",
"hostCtaLabel": "Host Your Own"
};
