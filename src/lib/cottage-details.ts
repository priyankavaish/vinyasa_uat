// Content and gallery references imported from each official stay page, 2026-09-11.
// CMS edits take precedence; these records also fill the original seed content.
type CottageDetails = {
  sourceUrl: string;
  description: string;
  bodyHtml: string;
  amenities: string[];
  gallery: string[];
  maxGuests?: number;
};
export const cottageDetails: Record<string, CottageDetails> = {
  "agni": {
    "sourceUrl": "https://www.vinyasa.earth/agni-fire-themed-cottage-stay-at-vinyasa-earth-in-jaipur-rajasthan/",
    "description": "A fire-inspired earthen mudhouse with pink-tinted sunlight, a generous living area and a bathtub.",
    "bodyHtml": "<h3>Light with a warm glow</h3><p>A pink-tinted roof panel washes the room in warm light, giving Agni its distinctive character.</p><h3>Room to gather</h3><p>The spacious earthen seating area makes room for conversations with fellow guests or a quiet afternoon stretched out on your own.</p><h3>A slower kind of luxury</h3><p>A bathtub and a green roof shaded by a tree make this mudhouse a place to settle in and linger.</p>",
    "amenities": [
      "Double bed",
      "Table fan",
      "Mosquito net",
      "Washroom",
      "Plug points",
      "Ambient lighting"
    ],
    "gallery": [
      "/images/stays/agni-1.jpg",
      "/images/stays/agni-2.jpg",
      "/images/stays/agni-3.jpg",
      "/images/stays/agni-4.jpg",
      "/images/stays/agni-5.jpg"
    ]
  },
  "jal": {
    "sourceUrl": "https://www.vinyasa.earth/jal-water-themed-cottage-stay-at-vinyasa-earth-in-jaipur-rajasthan/",
    "description": "A water-inspired mudhouse shaped by flowing curves, a wave-like ceiling and a cocooning droplet seat.",
    "bodyHtml": "<h3>Your own quiet corner</h3><p>The droplet-shaped seat curves around you beside the window, creating a sheltered spot to read, rest and enjoy the daylight.</p><h3>A ceiling in motion</h3><p>A continuous wave circles the centre of the ceiling, bringing the movement of water into the architecture.</p><h3>Earth and water</h3><p>A stone-cob wall adds texture and helps keep the mudhouse cool. The room invites you to slow down and settle into its gentle curves.</p>",
    "amenities": [
      "Double bed",
      "Table fan",
      "Mosquito net",
      "Washroom",
      "Plug points",
      "Ambient lighting"
    ],
    "gallery": [
      "/images/stays/jal-1.jpg",
      "/images/stays/jal-2.jpg",
      "/images/stays/jal-3.jpg",
      "/images/stays/jal-4.jpg"
    ]
  },
  "chandrama": {
    "sourceUrl": "https://www.vinyasa.earth/chandrama-moon-themed-cottage-stay-at-vinyasa-earth-in-jaipur-rajasthan/",
    "description": "A spacious moon-inspired mudhouse with a circular skylight and a window seat for two.",
    "bodyHtml": "<h3>A window to the moon</h3><p>The circular skylight brings daylight into the room and, on full-moon nights, lets moonlight become part of your stay.</p><h3>A living roof</h3><p>Chandrama's reciprocal roof supports itself and carries a living roof above, combining natural building with a light-filled interior.</p><h3>Chai by the window</h3><p>A seat for two opens towards the outdoors: a simple place to share a cup of tea and enjoy each other's company.</p>",
    "amenities": [
      "Double bed",
      "Table fan",
      "Mosquito net",
      "Washroom",
      "Plug points",
      "Ambient lighting"
    ],
    "gallery": [
      "/images/stays/chandrama-1.jpeg",
      "/images/stays/chandrama-2.jpeg",
      "/images/stays/chandrama-3.jpeg",
      "/images/stays/chandrama-4.jpg",
      "/images/stays/chandrama-5.jpg"
    ]
  },
  "prithvi": {
    "sourceUrl": "https://www.vinyasa.earth/prithvi-earth-themed-cottage-stay-at-vinyasa-earth-in-jaipur-rajasthan/",
    "description": "Vinyasa's most spacious mudhouse, grounded in stone masonry and the textures of earth.",
    "bodyHtml": "<h3>Naturally cool</h3><p>Stone-cob walls help keep Prithvi cool, making its natural construction especially welcome in summer.</p><h3>Built to support</h3><p>Prithvi sits beneath Vayu. Its rugged interiors reveal the structure and craft of a building made from natural materials.</p><h3>Connected to the community</h3><p>The window opens towards a shared seating area, keeping conversations and the social life of Vinyasa close by.</p>",
    "amenities": [
      "Double bed",
      "Table fan",
      "Mosquito net",
      "Washroom",
      "Plug points",
      "Ambient lighting"
    ],
    "gallery": [
      "/images/stays/prithvi-1.jpg",
      "/images/stays/prithvi-2.jpg",
      "/images/stays/prithvi-3.png",
      "/images/stays/prithvi-4.jpg",
      "/images/stays/prithvi-5.jpg"
    ]
  },
  "vayu": {
    "sourceUrl": "https://www.vinyasa.earth/vayu-wind-themed-cottage-stay-at-vinyasa-earth-in-jaipur-rajasthan/",
    "description": "A cosy first-floor earthen mudhouse with village views and morning sunlight falling across the bed.",
    "bodyHtml": "<h3>A different perspective</h3><p>Vayu is the only earthen mudhouse on the first floor, offering an elevated view of life around the property.</p><h3>Watch the village wake</h3><p>Its window faces Gujaro's Dhani, a place to watch the unhurried rhythm of village life.</p><h3>Small and intimate</h3><p>The smallest mudhouse at Vinyasa is a snug space to share, with early sunlight bringing warmth to the start of your day.</p>",
    "amenities": [
      "Double bed",
      "Table fan",
      "Mosquito net",
      "Washroom",
      "Plug points",
      "Ambient lighting"
    ],
    "gallery": [
      "/images/stays/vayu-1.jpg",
      "/images/stays/vayu-2.jpg",
      "/images/stays/vayu-3.jpg",
      "/images/stays/vayu-4.jpeg",
      "/images/stays/vayu-5.png"
    ]
  },
  "shunya": {
    "sourceUrl": "https://www.vinyasa.earth/shunya-nothingness-themed-cottage-stay-at-vinyasa-earth-in-jaipur-rajasthan/",
    "description": "An art-filled mudhouse inspired by nothingness, with space to disconnect and return to yourself.",
    "bodyHtml": "<h3>A canvas for quiet</h3><p>Painted with different forms of art, Shunya welcomes you as you are and offers space for reflection.</p><h3>Life outside the window</h3><p>The window faces the open-air theatre. The mudhouse has also been a home to two resident sparrows.</p><h3>Close to everything</h3><p>With the theatre, reception and other mudhouses nearby, it is easy to move between your own quiet space and the life of the community.</p>",
    "amenities": [
      "Double bed",
      "Table fan",
      "Mosquito net",
      "Washroom",
      "Plug points",
      "Ambient lighting"
    ],
    "gallery": [
      "/images/stays/shunya-1.jpg",
      "/images/stays/shunya-2.jpg",
      "/images/stays/shunya-3.jpg",
      "/images/stays/shunya-4.jpg",
      "/images/stays/shunya-5.png"
    ]
  },
  "dorm": {
    "sourceUrl": "https://www.vinyasa.earth/dormitory-cozy-community-stays-at-vinyasa-earth-in-jaipur-rajasthan/",
    "description": "A shared dorm for travellers who enjoy company, with bamboo bunks and views towards sunrise or sunset.",
    "bodyHtml": "<h3>Stay in good company</h3><p>The dorm has 26 beds, including 14 beds in seven bamboo bunks. Two loosely divided sections leave room to spend time together.</p><h3>Choose your view</h3><p>One side looks east towards the mountains and sunrise; the other faces west towards the evening sky.</p><h3>Make an evening of it</h3><p>A guitar, ukulele and egg shaker are part of the shared space, ready for guests to bring a little music to the evening.</p>",
    "amenities": [
      "Bunk bed",
      "Shared table fan",
      "Plug points"
    ],
    "gallery": [
      "/images/stays/dorm-1.jpg",
      "/images/stays/dorm-2.jpg",
      "/images/stays/dorm-3.jpg",
      "/images/stays/dorm-4.jpg"
    ],
    "maxGuests": 26
  }
};
