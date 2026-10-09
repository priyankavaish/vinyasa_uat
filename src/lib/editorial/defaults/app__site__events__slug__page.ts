import { seasonalEvents } from "./seasonal-events";
import { artistUnite } from "./artist-unite";
import { artistInResidence } from "./artist-in-residence";

const EVENT_IMAGES: Record<string, string> = {
  "artist-in-residence": "/seed/community-05.jpg",
  "anhad-ka-baaja": "/seed/community-02.jpg",
  "the-pause-within": "/seed/grounds-08.jpg",
  "artist-unite": "/seed/community-06.jpg",
  zariya: "/seed/community-01.jpg",
  "drishti-new-years-retreat": "/seed/grounds-05.jpg",
  "performing-lab-retreat": "/seed/community-03.jpg",
};
const EVENT_DETAILS: Record<string, { heading: string; paragraphs: string[]; highlights: string[] }> = {
  "artist-in-residence": {
    heading: "An immersive, research-led residency",
    paragraphs: ["A four-month living and research opportunity for artists and practitioners who want to deepen their practice in a nature-led, community-oriented environment.", "Residents develop a clear inquiry, document their process and share accessible engagements with the community. The work becomes part of the Vinyasa Archive while the artist retains authorship."],
    highlights: ["Dormitory stay and daily vegetarian meals", "Access to natural, architectural and community spaces", "Independent research and artistic inquiry", "Only two residency places"],
  },
  "anhad-ka-baaja": {
    heading: "An evening of Kabir bhajans",
    paragraphs: ["Listen and sing along to the words of Sant Kabir with Priyal. The evening invites you to experience the poetry not only as performance, but as something felt, shared and reflected upon.", "Priyal has been a musician for 16 years and deepened his relationship with Kabir's music while travelling and learning with Prahlad Tipaniya Ji."],
    highlights: ["Welcome drink included", "Food available from the Vinyasa kitchen", "Come to listen, reflect or sing along"],
  },
  "the-pause-within": {
    heading: "A quiet return to yourself",
    paragraphs: ["A two-night residential retreat created to notice how stress lives differently in each of us and what those experiences may be trying to tell us.", "Gentle group sessions, time in nature and unhurried pauses offer room to step away from daily demands and listen more closely."],
    highlights: ["Guided reflection", "Restorative practices", "Vegetarian meals", "Stay in Vinyasa's earth-built mudhouses"],
  },
  "artist-unite": {
    heading: "A residency of self creation",
    paragraphs: ["Ten days of making, exchanging and observing with practitioners across disciplines. Encounter how other artists work beyond the usual performance context and let those encounters reshape your own process.", "The residency values curiosity, generosity and work in progress."],
    highlights: ["Independent studio time", "Peer-led exchanges", "Collaborative experiments", "Community living and meals"],
  },
  zariya: {
    heading: "Connecting creators",
    paragraphs: ["Vinyasa Earth's annual gathering for artists, makers and creative professionals begins around sunset and unfolds through art, conversation, performances and music.", "Move through the grounds, meet the people behind the work and discover ideas in an open, informal setting."],
    highlights: ["Live performances", "Creative conversations", "Music and food", "An evening under the open sky"],
  },
  "drishti-new-years-retreat": {
    heading: "See the year with fresh eyes",
    paragraphs: ["Step away from the noise, look back at the year that has been and make grounded space for the one about to begin.", "Days follow the slower rhythm of the farm through shared practice, nourishing meals, reflection, movement and conversations around the fire."],
    highlights: ["Guided year-end reflection", "Movement and grounding", "Community meals", "A gentle New Year's celebration"],
  },
  "performing-lab-retreat": {
    heading: "A five-day performing lab",
    paragraphs: ["A physical intensive for performers, dancers, actors and creative explorers led by theatre practitioner Sukh AhlstrÃ¶m.", "Train, experiment and reconnect with the body as an expressive instrument through physical theatre, Kalaripayattu and movement."],
    highlights: ["Daily physical training", "Improvisation and ensemble work", "Movement research", "Reflection and sharing"],
  },
};



export const defaults = {
"SEASONAL_EVENTS": seasonalEvents,
"ARTIST_IN_RESIDENCE": artistInResidence,
"ARTIST_UNITE": artistUnite,
"EVENT_IMAGES": EVENT_IMAGES,
"EVENT_DETAILS": EVENT_DETAILS,
"href_1": "/events",
"text_2": "Ã¢â€ Â All programmes",
"text_3": "Details",
"text_4": "Facilitated by ",
"text_5": "Vinyasa Earth, Jaipur",
"text_6": "What to expect",
"text_7": "Contribution",
"text_8": "Reserve a spot"
};
