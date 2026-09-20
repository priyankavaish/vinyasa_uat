import eventsTileImage from "@/app/assets/events-tile-community.png";
import corporateTileImage from "@/app/assets/IMG_2429.jpeg";
import artistTileImage from "@/app/assets/2N0A9983.JPG";
const FEATURE = {
  title: "Artist Escapes",
  href: "/stays#artist-escape",
  image: artistTileImage,
  blurb:
    "Weeks to build, paint, or write alongside a resident community — an affordable stay-with-meals program for creative practitioners.",
};
const PAIR = [
  {
    title: "Events",
    href: "/events",
    image: eventsTileImage,
    blurb:
      "Residencies, retreats and workshops — a rotating calendar for makers who want a week or a month among people building their own thing.",
  },
  {
    title: "Corporate Offsites",
    href: "/volunteering",
    image: corporateTileImage,
    blurb:
      "Team retreats grounded in the desert, not a boardroom — slow mornings, shared meals, and the conversations that don't happen back at the office.",
  },
] as const;



export const defaults = {
"FEATURE": FEATURE,
"PAIR": PAIR,
"text_1": "Self-discovery",
"text_2": "A place to arrive. People to build with.",
"text_3": "Stay among artists, founders, and curious minds. Make something, exchange ideas, or meet the person who changes what you build next.",
"text_4": "Explore",
"text_5": "Come together",
"text_6": "A programme to join, or a team to bring",

"text_8": "Explore"
};
