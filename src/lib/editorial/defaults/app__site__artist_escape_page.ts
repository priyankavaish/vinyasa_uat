import type { IconName } from "@/components/ui/icon";

const HERO_IMAGE = "https://www.vinyasa.earth/wp-content/uploads/2025/02/DSC01245.jpg";

const VISION_PARAGRAPHS = [
  {
    label: "The vision",
    body:
      "Founders of Vinyasa envision a space for artists where stay, studio and stage are all in one place — so the artist need not worry about acceptance, roof, food or travel, and can focus all their energy and soul in their art.",
  },
  {
    label: "A home, not a residency",
    body:
      "This isn't a program with a start and end date stamped on it. It's a home away from home — earth walls, open studios, a stage under the stars — built so the only decision left each morning is what to make.",
  },
];

const ELIGIBILITY: { icon: IconName; title: string; body: string; image: string; imageAlt: string }[] = [
  {
    icon: "sparkles-outline",
    title: "Create art",
    body:
      "An artist for us is a person who acknowledges the artist in them and the energy of creating art. 'Art' can span from a painter, musician, dancer, writer to a cook, designer, gardener, yoga practitioner, speaker.",
    image: HERO_IMAGE,
    imageAlt: "Artists discussing clay art in the Shala",
  },
  {
    icon: "compass-outline",
    title: "Intent",
    body:
      "You need to have an intent which you achieve with respect to your art while your stay at Vinyasa. Our support to make logistics affordable is because you show a commitment to your art.",
    image: "https://vinyasa.earth/wp-content/uploads/2025/02/IMG_4172.jpg",
    imageAlt: "Artists at work in the studio",
  },
  {
    icon: "people-outline",
    title: "Community stay",
    body:
      "Mutual respect, tolerance & gratitude towards fellow members and surroundings is of utmost importance at Vinyasa Earth. This is NOT a vacation — it is an Ashram to connect with yourself and your art.",
    image: "https://vinyasa.earth/wp-content/uploads/2025/02/IMG_8485.jpg",
    imageAlt: "Community gathering at Vinyasa",
  },
];

const PROCESS_STEPS = [
  { title: "Express interest", body: "Reach out with your portfolio and a note about your practice." },
  { title: "1:1 call", body: "We get on a call to understand your intent and answer your questions." },
  { title: "Become eligible", body: "Once confirmed, we lock your dates and welcome you home." },
];

const PRICING_TIERS = [
  { label: "Less than 15 days", price: "₹900 / day" },
  { label: "Above 15 days", price: "₹750 / day" },
];

const ARTIST_PHOTOS = [
  { image: "https://www.vinyasa.earth/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-08-at-11.44.52.jpeg", name: "Mangadevi", skill: "Dance & Culinary" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/IMG_4172.jpg", name: "Community", skill: "Gathering in the Shala" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/IMG_8485.jpg", name: "Grey", skill: "Nunchucku" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Subject-1.png", name: "Jean Pierre", skill: "Somatics" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Wonder-150x150.jpg", name: "Wonder", skill: "Contact Improvisation" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/DSC09259-1.jpeg", name: "Samidha", skill: "Dance" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Bhanu-1.jpeg", name: "Bhanu", skill: "Breathwork" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/IMG_0919-1.jpg", name: "Danique", skill: "Yoga" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Gladys-photo-1.jpg", name: "Gladys", skill: "Crochet" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Tatiana.jpeg", name: "Tatiana", skill: "Yoga" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Adam.jpeg", name: "Adam", skill: "Contact Improvization" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Aliche.jpg", name: "Aliche Lizzola", skill: "Clown" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Valentina-1.jpg", name: "Valentina Holch", skill: "Poi & Tattoo" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Romero.jpg", name: "Romero", skill: "Photography" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Cheryl.jpeg", name: "Cheryl Baretto", skill: "Dance" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Neha.png", name: "Neha", skill: "Expressive Arts" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Yogesh.jpeg", name: "Yogesh Potalia", skill: "Yoga" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Arthur.jpeg", name: "Arthur Wilbrod", skill: "Music" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Ana.jpeg", name: "Ana Marta", skill: "Yoga" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/DSC09147.jpeg", name: "Dev", skill: "Dance and Yoga" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Bhanu.jpg", name: "Bhanu", skill: "Painting" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Flavia-Capraro.jpg", name: "Flavia Capraro", skill: "Aerial Dance & Yoga" },
  { image: "https://vinyasa.earth/wp-content/uploads/2025/02/Kathi.jpg", name: "Kathi", skill: "Graphics" },
];

export const defaults = {
  seo: {
    keywords: "",
    alternates: { canonical: "/artist-escape" },
    title: "For the Artists",
    description:
      "Explore Artist Escape and Artist in Residence at Vinyasa Earth, Jaipur. Two offerings for creative practice, community and research.",
  },

  hero_eyebrow: "With the Artists By the Artists",
  hero_title: "For the Artists",
  hero_description:
    "Stay, studio and performance in one place — so the only thing left to do is create.",
  hero_image: HERO_IMAGE,
  hero_image_alt: "Artists discussing clay art in the Shala at Vinyasa",
  hero_youtube_id: "T_7NQqIba60",

  short_youtube_id: "pYMiGbMPTWU",
  short_eyebrow: "A moment at Artist Escape",
  short_title: "Life, in motion",
  short_body:
    "A glimpse of the everyday here — studios open to the sky, hands at work, and a community that shows up for each other's craft.",

  pullquote_text: "“An artist for us is a person who acknowledges the artist in them.”",
  pullquote_caption: "The philosophy behind Artist Escape",
  pullquote_image: "https://vinyasa.earth/wp-content/uploads/2025/02/DSC01245.jpg",

  cta_image: "https://vinyasa.earth/wp-content/uploads/2025/02/DSC09259-1.jpeg",

  vision_eyebrow: "The vision",
  vision_title: "Space to create, nothing else to worry about",
  vision_paragraphs: VISION_PARAGRAPHS,
  vision_image: HERO_IMAGE,
  vision_image_alt: "Artists at work in the studio",
  vision_accent_image: "https://vinyasa.earth/wp-content/uploads/2025/02/Wonder-150x150.jpg",

  eligibility_eyebrow: "Eligibility",
  eligibility_title: "Who Artist Escape is for",
  eligibility: ELIGIBILITY,

  process_eyebrow: "How it works",
  process_title: "Application process",
  process_steps: PROCESS_STEPS,

  pricing_title: "Stay & meals",
  pricing_tiers: PRICING_TIERS,
  pricing_note: "Includes three wholesome, buffet-style meals a day. No stated maximum length of stay.",

  artists_eyebrow: "Community",
  artists_title: "Artists at Artist Escape",
  artists_description: "30+ resident artists across dance, yoga, contact improvisation, visual arts, music, breathwork and somatics.",
  artist_photos: ARTIST_PHOTOS,

  cta_title: "Your application starts here",
  cta_paragraphs: [
    "Vinyasa's artist escape program offers community dorm stay to artists so that they can practice their art and live it to its fullest. We share 3 wholesome meals (buffet) while you immerse yourself in the process of creation/research/study.",
    "Over years we have realized that contributions towards food are necessary to keep this program running and for us to support artists. This brings us to super minimal contributions of INR 900/- per day for less than 15 days. INR 750/- per day for above 15 days.",
    "There is no stated maximum period for the residence. Vinyasa has open gates for ALL ARTISTS WITH ALL ARTFORMS.",
    "Since we have limited spots that we can host, we just want to make sure that the spot is justified and the artist gets to make the most out of this program.",
    "Not sure if you are a right fit? Let's talk more on email (vinyasa.ashram@gmail.com) or Instagram.",
    "Else, go ahead and take that step — Apply now!",
  ],
  cta_email: "vinyasa.ashram@gmail.com",
  cta_phone: "+91 77376 07227",
  cta_location: "Jaipur, Rajasthan",
};
