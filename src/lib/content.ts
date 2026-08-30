// Placeholder marker: any specific (price, room count detail, program length)
// not confirmed from the public site/Instagram is flagged " (placeholder)" so
// nothing invented is presented to the client as fact.

export type Cottage = {
  slug: string;
  name: string;
  element: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  pricePerNight: number; // INR
  maxGuests: number;
  amenities: string[];
  image: string;
  gallery: string[];
  bodyHtml?: string;
  placeholder: boolean;
};

// Seven hand-plastered rooms, each named for an element. Also the fallback
// content the public site renders when the database is empty or unreachable.
export const cottages: Cottage[] = [
  {
    slug: "agni",
    name: "Agni",
    element: "Fire",
    tagline: "Premium cottage",
    description:
      "A sunset-red room with its own open-air wash pit, carved straight into the earthen wall.",
    icon: "flame-outline",
    accent: "#8f3b31",
    pricePerNight: 7500,
    maxGuests: 2,
    amenities: ["Open-air wash pit", "Hand-plastered walls", "Twin-sharing"],
    image: "/seed/room-agni-1.jpg",
    gallery: ["/seed/room-agni-1.jpg", "/seed/room-agni-2.jpg"],
    placeholder: false,
  },
  {
    slug: "jal",
    name: "Jal",
    element: "Water",
    tagline: "Premium cottage",
    description:
      "A cobalt skylight over the bed pulls the colour of the sky straight into the room.",
    icon: "water-outline",
    accent: "#6b7a9e",
    pricePerNight: 7500,
    maxGuests: 2,
    amenities: ["Cobalt skylight", "Ensuite bath", "Twin-sharing"],
    image: "/seed/room-jal-1.jpg",
    gallery: ["/seed/room-jal-1.jpg", "/seed/room-jal-2.jpg"],
    placeholder: false,
  },
  {
    slug: "chandrama",
    name: "Chandrama",
    element: "Moon",
    tagline: "Standard cottage",
    description: "A trail of moon phases circles the wall of this round, quiet mud room.",
    icon: "moon-outline",
    accent: "#3f3f5c",
    pricePerNight: 6000,
    maxGuests: 2,
    amenities: ["Round mud room", "Painted moon phases", "Twin-sharing"],
    image: "/seed/room-chandrama-1.jpg",
    gallery: ["/seed/room-chandrama-1.jpg", "/seed/room-chandrama-2.jpg"],
    placeholder: false,
  },
  {
    slug: "prithvi",
    name: "Prithvi",
    element: "Earth",
    tagline: "Premium cottage",
    description:
      "A cave-like nook pressed by hand from raw earth, with a built-in chulha seat by the window.",
    icon: "leaf-outline",
    accent: "#66783f",
    pricePerNight: 7000,
    maxGuests: 2,
    amenities: ["Built-in chulha seat", "Cave-like nook", "Twin-sharing"],
    image: "/seed/room-prithvi-1.jpg",
    gallery: ["/seed/room-prithvi-1.jpg", "/seed/room-prithvi-2.jpg", "/seed/room-prithvi-3.jpg"],
    placeholder: false,
  },
  {
    slug: "vayu",
    name: "Vayu",
    element: "Air",
    tagline: "Standard cottage",
    description: "Wide shutters and high thatch keep this room catching every breeze that passes.",
    icon: "wind-outline",
    accent: "#7c8f5a",
    pricePerNight: 6000,
    maxGuests: 2,
    amenities: ["Cross-ventilation", "High thatch roof", "Twin-sharing"],
    image: "/seed/room-vayu-1.jpg",
    gallery: ["/seed/room-vayu-1.jpg", "/seed/room-vayu-2.jpg"],
    placeholder: false,
  },
  {
    slug: "shunya",
    name: "Shunya",
    element: "Stillness",
    tagline: "Standard cottage",
    description: "Nothing but a bed, a net, and a window — built for doing absolutely nothing.",
    icon: "circle-outline",
    accent: "#a49a86",
    pricePerNight: 5800,
    maxGuests: 2,
    amenities: ["Minimal by design", "Mosquito net", "Twin-sharing"],
    image: "/seed/room-shunya-1.jpg",
    gallery: ["/seed/room-shunya-1.jpg", "/seed/room-shunya-2.jpg"],
    placeholder: false,
  },
  {
    slug: "dorm",
    name: "Dorm",
    element: "Shared",
    tagline: "Shared stay",
    description:
      "Bunk beds under one shared thatched roof, for travelling light and meeting everyone.",
    icon: "people-outline",
    accent: "#6b7a5e",
    pricePerNight: 1800,
    maxGuests: 8,
    amenities: ["Bunk beds", "Shared bath", "Common lockers"],
    image: "/seed/room-dorm-1.jpg",
    gallery: ["/seed/room-dorm-1.jpg", "/seed/room-dorm-2.jpg", "/seed/room-dorm-3.jpg"],
    placeholder: false,
  },
];

export type EventProgram = {
  slug: string;
  name: string;
  kind: "workshop" | "retreat" | "residency";
  durationLabel: string; // placeholder
  priceFrom: number; // INR; 0 = free / by donation
  description: string;
  placeholder: boolean;
  dateLabel?: string;
  facilitator?: string;
  image?: string;
  bodyHtml?: string;
};

// Programme calendar sourced from vinyasa.earth/events (Aug 2026 – Jan 2027).
export const events: EventProgram[] = [
  {
    slug: "artist-in-residence",
    name: "Artist-in-Residence Program",
    kind: "residency",
    durationLabel: "4 months · Jun–Sep",
    dateLabel: "1 Jun – 30 Sep 2026",
    priceFrom: 0,
    description:
      "A four-month immersive residency. Two selected artists live, explore, and create between June and September, engaging with the community-oriented, nature-led environment of the farm.",
    placeholder: false,
  },
  {
    slug: "anhad-ka-baaja",
    name: "Anhad ka Baaja",
    kind: "workshop",
    durationLabel: "One evening · 6:00 pm",
    dateLabel: "12 Sep 2026",
    facilitator: "Priyal",
    priceFrom: 450,
    description:
      "An intimate evening of Kabir Bhajans led by Priyal — experiencing Kabir's poetry through music, not only as something to be performed but as something to sit inside.",
    placeholder: false,
  },
  {
    slug: "the-pause-within",
    name: "The Pause Within",
    kind: "retreat",
    durationLabel: "3 days / 2 nights",
    dateLabel: "18–20 Sep 2026",
    facilitator: "Nikita Chawda",
    priceFrom: 49999,
    description:
      "A two-night residential retreat exploring how stress lives differently in each of us, and what those experiences are trying to tell us.",
    placeholder: false,
  },
  {
    slug: "artist-unite",
    name: "Artist Unite — A Residency of Self Creation",
    kind: "residency",
    durationLabel: "10 days",
    dateLabel: "15–24 Oct 2026",
    priceFrom: 18500,
    description:
      "An intensive residency on collaborative artistic practice — a chance to see how other artists work, beyond the usual performance context.",
    placeholder: false,
  },
  {
    slug: "zariya",
    name: "Zariya — Connecting Creators",
    kind: "workshop",
    durationLabel: "One day · 4:00–11:00 pm",
    dateLabel: "24 Oct 2026",
    priceFrom: 0,
    description:
      "Vinyasa Earth's annual gathering, unfolding around sunset — art, conversations, performances, music, and time among artists and creative professionals.",
    placeholder: false,
  },
  {
    slug: "drishti-new-years-retreat",
    name: "Drishti — New Year's Retreat",
    kind: "retreat",
    durationLabel: "3 days",
    dateLabel: "29 Dec 2026 – 1 Jan 2027",
    priceFrom: 0,
    description:
      "Step away from the noise, look back at the year that has been, and make space for the one about to begin.",
    placeholder: false,
  },
  {
    slug: "performing-lab-retreat",
    name: "Performing Lab Retreat",
    kind: "retreat",
    durationLabel: "5 days",
    dateLabel: "17–22 Jan 2027",
    facilitator: "Sukh Ahlström",
    priceFrom: 24475,
    description:
      "A five-day intensive for performers, dancers, actors, and creative explorers — physical theatre, Kalaripayattu, and movement led by theatre practitioner Sukh Ahlström.",
    placeholder: false,
  },
];

export type GalleryPost = {
  image: string;
  caption: string;
  permalink: string;
};

export type PropertyPhoto = {
  image: string;
  alt: string;
};

// Every property + location shot, all in one moving carousel (see
// PhotoMasonry) so nothing sits split across two separate galleries.
export const placePhotos: PropertyPhoto[] = [
  { image: "/images/property-cottages-day.jpg", alt: "The hand-built mud cottages by day" },
  { image: "/images/property-lawn-gazebo.jpg", alt: "The lawn and gazebo" },
  { image: "/images/amer-fort-lake.jpg", alt: "Amer Fort by the lake" },
  { image: "/images/property-kitchen-garden.jpg", alt: "The kitchen garden" },
  { image: "/images/hero-desert-dusk.jpg", alt: "Desert dusk near Vinyasa Earth" },
  { image: "/images/hawa-mahal.jpg", alt: "Hawa Mahal, Jaipur" },
  { image: "/images/amer-fort-portrait.jpg", alt: "Amer Fort" },
];

// Pulled directly from @vinyasa.earth's live Instagram feed. The last entry
// (ig-06) doesn't have a specific post URL on file, so it links to the
// profile instead of a fabricated post link.
export const galleryPosts: GalleryPost[] = [
  {
    image: "/images/instagram/ig-04-aug12.jpg",
    caption: "Eco-mud elemental cottage stays",
    permalink: "https://www.instagram.com/vinyasa.earth/p/Db7obD0ILza/",
  },
  {
    image: "/images/instagram/ig-05-aug10.jpg",
    caption: "Open Studio Exchange Week: explore, exchange, learn.",
    permalink: "https://www.instagram.com/vinyasa.earth/p/DbvMff9IP2j/",
  },
  {
    image: "/images/instagram/ig-01-community.jpg",
    caption: "Come to participate.",
    permalink: "https://www.instagram.com/vinyasa.earth/reel/DcLnf4YEU5_/",
  },
  {
    image: "/images/instagram/ig-03-aug14.jpg",
    caption: "What should freedom feel like?",
    permalink: "https://www.instagram.com/vinyasa.earth/p/DcJMysRj8aJ/",
  },
  {
    image: "/images/instagram/ig-09-getcloser.jpg",
    caption: "Get closer to nature.",
    permalink: "https://www.instagram.com/vinyasa.earth/reel/DbnAT5dgLjM/",
  },
  {
    image: "/images/instagram/ig-07-aug06.jpg",
    caption: "A space that embodies water.",
    permalink: "https://www.instagram.com/vinyasa.earth/p/Db21iA9oEk-/",
  },
  {
    image: "/images/instagram/ig-08-aug04.jpg",
    caption: "The body remembers.",
    permalink: "https://www.instagram.com/vinyasa.earth/p/DbsR9_IoN-q/",
  },
  {
    image: "/images/instagram/ig-06-aug07.jpg",
    caption: "Travellers from around the world, gathered together.",
    permalink: "https://www.instagram.com/vinyasa.earth/",
  },
];

export const corporateOffering = {
  headline: "Offsites that actually change how a team works",
  description:
    "Team-building and retreat spaces for organizations, set apart from the usual conference-hotel offsite, built around the same grounded, hands-on ethos as our artist residencies.",
  deckNote:
    "Ask for the Organizer's Deck for full pricing, capacity, and sample itineraries (placeholder, real deck to be attached).",
};

// Volunteering programme sourced from vinyasa.earth/volunteering.
export type VolunteerTrack = {
  slug: string;
  name: string;
  commitment: string;
  compensation: string;
  description: string;
  roles: string[];
};

export const volunteerTracks: VolunteerTrack[] = [
  {
    slug: "community",
    name: "Community Volunteering",
    commitment: "Minimum 1 week",
    compensation: "₹5,000 per week",
    description:
      "Live in the community and lend a hand across the farm — a short, hands-on way to know whether Vinyasa is home for you.",
    roles: [
      "Garden maintenance & permaculture",
      "Hospitality & guest services",
      "Property maintenance & repairs",
      "Social media & website support",
    ],
  },
  {
    slug: "skill-exchange",
    name: "Skill-Based Exchange",
    commitment: "Minimum 1 month",
    compensation: "Full barter for stays of 2+ months",
    description:
      "Bring a specific craft and trade it for room, board, and time on the land. Longer commitments move to a full barter arrangement.",
    roles: [
      "Content creator",
      "Social media management",
      "Permaculture / gardening",
      "Website design",
      "Property management",
    ],
  },
];

export const volunteerInfo = {
  benefits: [
    "Dormitory accommodation",
    "Three vegetarian meals a day",
    "Access to all community spaces",
    "Subsidised workshop participation",
  ],
  requirements: [
    "Minimum age 18",
    "Self-motivated and respectful",
    "Comfortable in a rural, quiet setting",
    "International volunteers welcome",
  ],
  note:
    "Volunteering is the pathway to full-time residency at Vinyasa Earth. Openness to community living and eco-conscious practice matters more than a polished CV.",
};

// ---------------------------------------------------------------------------
// CMS seed content — mirrors the database tables. Public pages fall back to
// these when the DB is empty or unreachable; `db:seed` writes them in.
// ---------------------------------------------------------------------------

export type VisitOption = { title: string; description: string; image: string };

export const visitOptions: VisitOption[] = [
  {
    title: "Brand Video & Photoshoot",
    description: "Want a shoot at Vinyasa for a few hours or a day? Let's talk through the idea.",
    image: "/seed/community-04.jpg",
  },
  {
    title: "Day Pass",
    description:
      "Get a tour, share meals with the team, and live our slow day without staying the night.",
    image: "/seed/grounds-01.jpg",
  },
  {
    title: "Studio Pass",
    description:
      "For artists after a studio close to nature — no walls, open to the horizon.",
    image: "/seed/room-vayu-2.jpg",
  },
  {
    title: "Gatherings & Residency",
    description: "Planning a mindful gathering or a residency? We'd love to host you.",
    image: "/seed/community-02.jpg",
  },
];

export type Partner = { name: string; logo: string; description: string; link: string };

export const partners: Partner[] = [
  { name: "Texaura", logo: "/images/logo-transparent.png", description: "Modern bed, bath, and living brand", link: "/contact" },
  { name: "CarpetLive", logo: "/images/logo-transparent.png", description: "Crafted. Curated. Enduring.", link: "/contact" },
  { name: "Dheer Rugs", logo: "/images/logo-transparent.png", description: "Rugs & carpets", link: "/contact" },
];

// Editable page copy. Keys map 1:1 to rows in `site_content`.
export const siteContentSeed: Record<string, unknown> = {
  "home.hero": {
    kicker: "A retreat for curious minds",
    location: "Jaipur, Rajasthan",
    values: "Stay · Create · Connect",
  },
  "home.cottages": {
    eyebrow: "The Cottages",
    heading: "Seven rooms. Each made by hand.",
  },
  "about.hero": {
    eyebrow: "Our story",
    title: "Start your journey inwards",
    description:
      "Vinyasa Earth is an art-residential space in Jaipur, Rajasthan — a safe and non-judgemental abode for everyone to free their inner defences and explore themselves.",
  },
  "about.story": {
    heading: "An artist village, imagined in lockdown",
    body: "Sankalp Sharma, a professional dancer, was abroad on a dance scholarship when the 2020 pandemic was announced and sent him back to India. Out of that pause came Vinyasa Earth: a village built around the practical realities artists face — long commutes, cramped rooms, nowhere to perform, and the basic question of the next meal.\n\nThe idea was simple. Give artists quality sleep, nutritious food, and real support, and the creative work takes care of itself.",
  },
  "about.craft": {
    heading: "Rajasthan's own way of building",
    body: "Mud plaster and jaali screens instead of concrete. Kitchen-garden meals instead of a restaurant menu. Block-print textiles and hand-painted mandalas on the cottage walls. It is a working example of the sustainable, earth-first living the community here practises every day.\n\nEverything at Vinyasa carries the goodness of mother earth — a blend of humanity and nature, held with gratitude.",
  },
  "contact.hero": {
    eyebrow: "Get in touch",
    title: "We'd love to hear from you",
    description:
      "Questions about a stay, a retreat, venue hire, or volunteering — send a note and the team will write back.",
  },
  "contact.services": [
    { title: "Retreats", body: "Wellness, art, and corporate retreats with eco-lodging in the mud cottages.", icon: "leaf-outline" },
    { title: "Venue hire", body: "Workshops, events, and creative shoots across the cottages and the amphitheatre.", icon: "camera-outline" },
    { title: "Brand partnerships", body: "Collaborations aligned with sustainability and wellness values.", icon: "ribbon-outline" },
    { title: "Day experiences", body: "Non-overnight visits with lunch and a guided tour of the land.", icon: "sunny-outline" },
  ],
  "contact.faq": [
    { q: "How do I get there?", a: "The farm is road-accessible from Jaipur. An Uber or cab straight to the gate is the easiest way in." },
    { q: "What are the stay options?", a: "Six themed mud cottages, a shared dorm, and tent stays, depending on the season." },
    { q: "Are meals included?", a: "Vegetarian meals are included with retreat and residency packages, and available to add for other stays." },
    { q: "Can I visit for the day?", a: "Yes — without an overnight booking, through an event or a day pass with lunch and a tour." },
    { q: "How can I pay?", a: "Credit and debit cards, UPI, and bank transfers are all accepted." },
    { q: "Can I bring my pet?", a: "Pets are generally welcome, with the owner responsible for them on the land." },
  ],
};
