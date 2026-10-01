
const ACCESSORY_PARTNERS = [
  {
    name: "Texaura",
    logo: texauraLogo.src,
    blurb:
      "A modern bed, bath, and living brand from Jaipur, crafting refined collections in certified organic cotton for homes, boutique hotels, and wellness retreats worldwide — quiet, considered, and naturally lived-in.",
    about: [
      "Texaura is a modern bed, bath, and living brand creating thoughtfully crafted collections for homes and hospitality spaces around the world.",
      "Rooted in the belief that the spaces we live in shape the way we feel, rest, and experience everyday life, Texaura brings together refined comfort, timeless design, certified organic cotton, and conscious craftsmanship into one considered expression of modern living.",
      "Founded in Jaipur, India — a city long celebrated for its textile heritage, craftsmanship, and artistic culture — Texaura combines this rich foundation with a contemporary global design language defined by simplicity, balance, warmth, and understated elegance.",
      "Our collections include bedding, blankets, throws, towels, bathrobes, and hospitality linen designed for modern homes, boutique hotels, wellness retreats, luxury villas, and thoughtfully curated spaces. Every product is created with careful attention to softness, breathability, texture, durability, and lasting comfort — allowing each collection to feel elevated, welcoming, and naturally lived in.",
      "At the heart of Texaura is a deep appreciation for material integrity and thoughtful creation. We work with certified organic cotton sourced through responsible farming ecosystems and collaborate with ethically managed manufacturing partners who value skilled craftsmanship, fair wages, safe working environments, and responsible production practices.",
      "We believe exceptional quality is experienced through the complete character of a product — the quality of fibre, the refinement of yarn, the weave, finishing, texture, and the way fabric performs over time. This philosophy guides every Texaura collection.",
      "For hospitality spaces, Texaura partners with properties that value rest, wellbeing, and elevated guest experiences. Our hospitality collections bring together timeless aesthetics, operational durability, and refined comfort for hotels, resorts, retreats, and modern hospitality environments.",
      "Sustainability at Texaura is approached through responsibility, long-term thinking, and conscious decision-making across every stage of creation — from certified organic cotton and thoughtful production planning to recyclable packaging and products designed for lasting use.",
      "Guided by a philosophy of quiet refinement and thoughtful simplicity, Texaura is building a global lifestyle brand where comfort, craftsmanship, wellbeing, and conscious luxury come together seamlessly — a more thoughtful expression of modern luxury, designed around how people live, rest, and feel every day.",
    ],
  },
  {
    name: "Carpet Live",
    logo: carpetLiveLogo.src,
    blurb:
      "Rooted in Bhadohi's weaving legacy, Carpet Live brings export-quality flatweaves — kilims and dhurries — into contemporary homes. Lightweight, tactile, and built to last. Crafted. Curated. Enduring.",
    about: [
      "Rooted in Bhadohi's legacy of craftsmanship, Carpet Live brings export-quality rugs into contemporary homes. Built on generations of weaving expertise, the brand balances heritage techniques with modern design sensibilities to create pieces that feel timeless, functional, and quietly refined.",
      "At Carpet Live, rugs are not treated as decorative afterthoughts, but as foundational elements that shape the feeling of a space. Every piece is designed with an emphasis on texture, materiality, and longevity — crafted to feel lived-in, effortless, and enduring over time.",
      "Known for one of India's largest collections of kilims and dhurries, Carpet Live focuses on flatweaves that work naturally within contemporary homes: lightweight and versatile, easy to maintain, functional for everyday living, and designed for warmth without visual heaviness.",
      "The brand aesthetic leans minimal, tactile, and grounded — blending traditional craftsmanship with modern interiors in a way that feels elevated yet deeply personal. Crafted. Curated. Enduring.",
    ],
  },
  {
    name: "Dheer Exports",
    logo: dheerLogo.src,
    blurb:
      "A Jaipur family business since 2010, Dheer Exports grew from two weavers to three hundred — building one of India's largest collections of handcrafted rugs, dhurries, and carpets while creating dignified livelihoods for artisans.",
    about: [
      "In 2010, this organisation was formed with a resolve to work for artisans — handing them a way to earn a livelihood and lead a respectful life, and in turn contributing to the larger ambition of rebuilding and serving the nation. With this goal, Dheer Exports came into existence.",
      "It's a family business that combines the pursuit of positive wealth creation with spreading kindness in a way that benefits all stakeholders — consumers, artisans, employees, suppliers, and channel partners. Manufacturing rugs since 2010, it began with a single loom and two weavers in the family home, and the dreams of Mr Kunal and Mrs Sujata Shah. It has been a tough journey from two weavers to three hundred.",
      "Today Dheer Exports makes one of the largest collections of rugs and carpets, and designs and develops home-furnishing items of every kind. The range — dhurries, cotton stone-wash dhurries, chenille rugs, hemp and jute rugs, cotton-wool rugs, hand-tufted carpets, cushion covers, shaggy rugs, cotton throws, stools and poufs — comes in many attractive colour combinations.",
      "At Dheer Rugs, we serve a community of designers, decorators, and homebodies — people who care deeply about the objects they bring into their homes, from the materials we source to the textures we develop. Our carpets and rugs are known for their elegant designs and quality.",
    ],
  },
] as const;
import texauraLogo from "@/app/assets/stays/IMG_1554-600x112.png";
import carpetLiveLogo from "@/app/assets/stays/carpetlive-trimmed.png";
import dheerLogo from "@/app/assets/stays/DHEER-LOGO.png";
import galleryA from "@/app/assets/new/grounds-01.jpg";
import galleryC from "@/app/assets/new/room-prithvi-2.jpg";
import galleryD from "@/app/assets/new/grounds-04.jpg";
import expA from "@/app/assets/new/community-06.jpg";
import expD from "@/app/assets/new/grounds-08.jpg";
import expE from "@/app/assets/new/community-07.jpg";
import expF from "@/app/assets/new/grounds-09.jpg";
import residencyImg from "@/app/assets/new/community-05.jpg";

const EXPERIENCE_PHOTOS = [expA, "/images/2N0A9839.JPG", "/images/DJI_20240924131352_0562_D.jpg", expD, expE, expF];



export const defaults = {
"ACCESSORY_PARTNERS": ACCESSORY_PARTNERS,
seo: {
  title: "Stays at Vinyasa Earth in Jaipur",
  description:
    "Hand-built rooms named for the elements — Agni, Jal, Chandrama, Prithvi, Vayu, Shunya, and a shared dorm — at Vinyasa Earth in Jaipur.",
  alternates: { canonical: "/stays" },
},

"EXPERIENCE_PHOTOS": EXPERIENCE_PHOTOS,
"galleryA": galleryA,
"galleryC": galleryC,
"galleryD": galleryD,
"residencyImg": residencyImg,
"text_1": "We give our guests a unique perspective on the beauty of nature — a chance to disconnect from the outside world and immerse in the wonders that surround us. Our mudhouses are a comfortable, relaxing place to unwind after a day exploring the surrounding countryside.",
"text_2": "Experiences",
"text_3": "Days built around making things",
"text_4": "Vinyasa is a space for self-engaging activities — nature walks, hikes, and one-on-one sessions with an artist in residence — woven into our daily life. Experiences are seasonal; write to",
"href_5": "mailto:vinyasa.ashram@gmail.com",
"text_6": "vinyasa.ashram@gmail.com",
"text_7": "to enquire.",

"alt_9": "Resident artists at Vinyasa Earth",
"text_10": "The Artist Escape",
"text_11": "An affordable home for artists at work",
"text_12": "Outside the dated calendar, the Artist Escape runs year-round: an affordable stay with meals included, in a supportive creative environment. Paint, write, choreograph or build alongside the resident community for a week or a season.",
"text_13": "Applications and residency queries go straight to the team.",
"text_14": "Enquire on WhatsApp",
"href_15": "/contact",
"text_16": "Write to us",
"aria_label_17": "Life around Vinyasa Earth",





"text_23": "More ways to visit",
"text_24": "You don't have to stay the night",
"text_25": "Accessory partners",
"text_26": "Brands that align with how we build",
"text_27": "The makers we turn to for the textiles and rugs that dress a Vinyasa room."
};
