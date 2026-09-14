import { Icon, type IconName } from "@/components/ui/icon";
const findHere: { icon: IconName; text: string }[] = [
  { icon: "wind-outline", text: "Wi-Fi and open shared spaces to work from — no fixed desks or coworking cubicles" },
  { icon: "home-outline", text: "A bed in the community dormitory or a private earthen cottage" },
  { icon: "leaf-outline", text: "Community vegetarian meals cooked on the farm" },
  { icon: "sunny-outline", text: "Quiet areas set aside for rest, walking and reading" },
];
const stays = [
  {
    name: "Community Dormitory",
    icon: "people-outline" as IconName,
    rows: [
      { label: "1–14 nights", price: "₹750 / person / night" },
      { label: "15+ nights", price: "₹500 / person / night" },
    ],
  },
  {
    name: "Earthen Cottage",
    icon: "home-outline" as IconName,
    rows: [
      { label: "1–6 nights", price: "₹3,500 / night" },
      { label: "7–14 nights", price: "₹2,900 / night" },
      { label: "15+ nights", price: "₹2,100 / night" },
    ],
  },
];
const meals = [
  { label: "Breakfast", price: "₹250" },
  { label: "Lunch", price: "₹500" },
  { label: "Dinner", price: "₹500" },
];



export const defaults = {
seo: {
  title: "Work From Farm",
  description:
    "Work From Farm at Vinyasa Earth — stay, work and slow down outside Jaipur. Wi-Fi and open shared spaces, community meals, and a bed in an earthen cottage or the dorm, by the night or the season.",
  alternates: { canonical: "/work-from-farm" },
},
"findHere": findHere,
"stays": stays,
"meals": meals,
"eyebrow_1": "Work From Farm",
"title_2": "Stay, work and slow down outside Jaipur",
"description_3": "Step away from the usual work-from-home routine without stepping away from work. There are no designated workstations — just open space where you can work while staying connected to the natural surroundings.",
"image_4": "/images/Vinyasa data (Space)/BM9A6310.jpg",
"imageAlt_5": "Quiet green fields beside the Vinyasa Earth farm",
"text_6": "A different way to work",
"text_7": "Bring your laptop and your current project. Find focus among mud cottages, open skies and a living creative community — close enough to Jaipur, yet far from its rush. Stay a few nights or settle in for a season.",
"text_8": "What you'll find here",
"text_9": "Room to work, and room to breathe",
"text_10": "Choose your stay",
"text_11": "By the night, or by the season",
"text_12": "Meals, added on",
"text_13": "All prices are exclusive of GST.",
"text_14": "The Vinyasa way",
"text_15": "A few shared agreements",
"text_16": "The farm runs on care taken by everyone who stays. Nothing complicated — just the habits that keep a shared home calm and light on the land.",
"text_17": "0",
"text_18": "Who it's for",
"text_19": "If you can bring your work with you, you can bring it here",
"text_20": "Book your Work From Farm stay",
"text_21": "Tell us your dates and how long you'd like to stay, and we'll hold a place.",
"href_22": "/book",
"text_23": "Request a booking",
"text_24": "Ask on WhatsApp"
};
