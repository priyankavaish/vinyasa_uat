
const FAMILY = [
  {
    name: "Sankalp Sharma",
    role: "Founder",
    photo: "/seed/community-01.jpg",
    position: "50% 35%",
    blurb:
      "A dancer who traded the stage for the soil. Sankalp started Vinyasa as a home where artists could live, make, and belong without asking permission.",
    since: "2018",
  },
  {
    name: "Ankita Sharma",
    role: "Resident",
    photo: "/seed/community-05.jpg",
    position: "50% 40%",
    blurb:
      "Came for a week of quiet, stayed for the mornings. Now keeps the kitchen garden and the residency calendar running in step.",
    since: "2020",
  },
  {
    name: "Abhishek Gore",
    role: "Resident",
    photo: "/seed/community-06.jpg",
    position: "50% 40%",
    blurb:
      "Builder, tinkerer, night-owl. If a wall is drying or a light needs fixing, it is usually his hands on it.",
    since: "2021",
  },
  {
    name: "Coco",
    role: "Resident animal",
    photo: "/seed/community-04.jpg",
    position: "50% 45%",
    blurb:
      "Chief greeter. Escorts every new guest from the gate to the courtyard and expects a scratch as payment.",
    since: "2019",
  },
  {
    name: "Mojo",
    role: "Resident animal",
    photo: "/seed/grounds-03.jpg",
    position: "50% 50%",
    blurb:
      "Sun-spot specialist. Can be found wherever the light lands warmest, supervising from a respectful distance.",
    since: "2019",
  },
  {
    name: "Diwan",
    role: "Resident",
    photo: "/seed/community-07.jpg",
    position: "50% 40%",
    blurb:
      "Holds the long view — logistics, land, and the slow work of keeping a shared home actually shared.",
    since: "2020",
  },
];
import { Icon, type IconName } from "@/components/ui/icon";
import bandImg from "@/app/assets/new/about-band.jpg";
import storyImg from "@/app/assets/new/community-01.jpg";
const PRINCIPLES: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: "home-outline", title: "Safe space", body: "Where you can create." },
  { icon: "sparkles-outline", title: "Non-judgemental", body: "Where you can express." },
  { icon: "leaf-outline", title: "Eco-conscious", body: "Where you can co-live with nature." },
  { icon: "people-outline", title: "Community living", body: "Where you collaborate." },
];


type Copy = Record<string, string>;

export const defaults = {
"FAMILY": FAMILY,
seo: {
  title: "About",
  description:
    "The story behind Vinyasa Earth — an art-residential space in Jaipur, founded by dancer Sankalp Sharma as a safe, non-judgemental home for artists to live, create, and belong.",
  alternates: { canonical: "/about" },
},
"list_1": [
                  "Sankalp Sharma, a professional dancer, was abroad on a dance scholarship when the 2020 pandemic was announced and sent him back to India. Out of that pause came Vinyasa Earth: a village built around the practical realities artists face — long commutes, cramped rooms, nowhere to perform, and the basic question of the next meal.",
                  "The idea was simple. Give artists quality sleep, nutritious food, and real support, and the creative work takes care of itself.",
                ],
"list_2": [
                  "Mud plaster and jaali screens instead of concrete. Kitchen-garden meals instead of a restaurant menu. Block-print textiles and hand-painted mandalas on the cottage walls. It is a working example of the sustainable, earth-first living the community here practises every day.",
                  "Everything at Vinyasa carries the goodness of mother earth — a blend of humanity and nature, held with gratitude.",
                ],
"PRINCIPLES": PRINCIPLES,

"bandImg": bandImg,
"storyImg": storyImg,
"text_1": "Our story",
"text_2": "Start your journey inwards",
"text_3": "Vinyasa Earth is an art-residential space in Jaipur, Rajasthan — a safe and non-judgemental abode for everyone to free their inner defences and explore themselves.",
"image_4": "/images/IMG_1084.JPG",
"imageAlt_5": "Hand-painted mud cottage framed by a neem tree and marigolds at Vinyasa Earth",
"alt_6": "Community gathering at Vinyasa Earth",
"text_7": "How it began",
"text_8": "An artist village, imagined in lockdown",


"text_11": "What we stand on",
"text_12": "Four principles",
"text_13": "\"Everything at Vinyasa carries the goodness of mother earth — a blend of humanity and nature, held with gratitude.\"",
"text_14": "The Vinyasa Earth community",
"text_15": "Built from the ground",
"text_16": "Rajasthan's own way of building",


"src_19": "/images/2N0A9797.JPG",
"alt_20": "A grinding stone by a bamboo window inside a hand-built mud room at Vinyasa Earth"
};
