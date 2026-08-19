// Placeholder marker: any specific (price, room count detail, program length)
// not confirmed from the public site/Instagram is flagged " (placeholder)" so
// nothing invented is presented to the client as fact.

export type Cottage = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  pricePerNight: number; // INR, placeholder
  maxGuests: number;
  amenities: string[];
  placeholder: boolean;
};

export const cottages: Cottage[] = [
  {
    slug: "terracotta",
    name: "Cottage Terracotta",
    tagline: "Most booked",
    description:
      "A hand-plastered mud cottage with a private courtyard, carved jaali screens, and an open-sky outdoor bath, the most requested of the six.",
    pricePerNight: 7500,
    maxGuests: 2,
    amenities: ["Private courtyard", "Outdoor bath", "Hand-carved jaali screens"],
    placeholder: true,
  },
  {
    slug: "indigo",
    name: "Cottage Indigo",
    tagline: "Quiet & north-facing",
    description:
      "Dressed in block-print textiles with a reading nook and soft north light, built for slow mornings.",
    pricePerNight: 6500,
    maxGuests: 2,
    amenities: ["Reading nook", "North-facing light", "Block-print interiors"],
    placeholder: true,
  },
  {
    slug: "marigold",
    name: "Cottage Marigold",
    tagline: "Sun terrace",
    description:
      "A sun-facing terrace looking over the communal firepit, with twin beds for friends or family.",
    pricePerNight: 5800,
    maxGuests: 3,
    amenities: ["Private terrace", "Firepit view", "Twin beds"],
    placeholder: true,
  },
  {
    slug: "clay",
    name: "Cottage Clay",
    tagline: "Artist studio attached",
    description:
      "Built alongside a small studio space, favoured by resident artists working through a longer stay.",
    pricePerNight: 6000,
    maxGuests: 2,
    amenities: ["Attached studio nook", "Work desk", "Storage for materials"],
    placeholder: true,
  },
  {
    slug: "sand",
    name: "Cottage Sand",
    tagline: "Family-friendly",
    description: "The largest of the six, with space for a family or a small group travelling together.",
    pricePerNight: 9000,
    maxGuests: 4,
    amenities: ["Extra floor space", "Family-friendly layout", "Nearest to the kitchen"],
    placeholder: true,
  },
  {
    slug: "saffron",
    name: "Cottage Saffron",
    tagline: "Garden-facing",
    description: "Tucked against the kitchen garden, with the shortest walk to the communal dining area.",
    pricePerNight: 6200,
    maxGuests: 2,
    amenities: ["Garden view", "Close to communal dining"],
    placeholder: true,
  },
];

export type EventProgram = {
  slug: string;
  name: string;
  kind: "workshop" | "retreat" | "residency";
  durationLabel: string; // placeholder
  priceFrom: number; // INR, placeholder
  description: string;
  placeholder: boolean;
};

export const events: EventProgram[] = [
  {
    slug: "artist-escape",
    name: "Artist Escape Program",
    kind: "residency",
    durationLabel: "7–30 days (placeholder)",
    priceFrom: 12000,
    description:
      "An affordable stay-with-meals program for creative practitioners: paint, write, or build alongside a resident community, for anywhere from a week to a month.",
    placeholder: true,
  },
  {
    slug: "self-discovery-retreat",
    name: "Self-Discovery Retreat",
    kind: "retreat",
    durationLabel: "3 days / 2 nights (placeholder)",
    priceFrom: 18000,
    description:
      "Movement, yoga, and reflective practice in a small group, grounded in the quiet of the desert.",
    placeholder: true,
  },
  {
    slug: "movement-yoga-workshop",
    name: "Movement & Yoga Workshop",
    kind: "workshop",
    durationLabel: "Single day (placeholder)",
    priceFrom: 3500,
    description: "A one-day intensive open to both residents and outside visitors.",
    placeholder: true,
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
