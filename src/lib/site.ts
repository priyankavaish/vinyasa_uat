export const SITE_ORIGIN = process.env.SITE_ORIGIN || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://vinyasa-seven.vercel.app");
export const SITE_NAME = "Vinyasa Earth";
export const WHATSAPP_NUMBER = "917737607227"; // +91 77376 07227, published contact number
export const CONTACT_EMAIL = "vinyasa.ashram@gmail.com";
export const CONTACT_PHONE_DISPLAY = "+91 77376 07227";
// Sourced directly from Vinyasa Earth's Google Business Profile (linked by client).
export const ADDRESS = "Maheshwas Khurd, Jaipur, Rajasthan 302012";
export const GOOGLE_MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=Vinyasa+Earth+Maheshwas+Khurd+Jaipur&output=embed";
export const GOOGLE_MAPS_LINK = "https://maps.google.com/maps/place/Vinyasa+Earth/data=!4m2!3m1!1s0x396c51fe1f6a735d:0x838c7020261ff59d";
export const GOOGLE_RATING = {
  score: 4.6,
  count: 127,
  category: "Art center in Rajasthan",
  hours: "Open 24 hours",
  summary:
    "Visitors say this art residency offers a peaceful and creative environment, with delicious, home-cooked food and unique earthen architecture. They also highlight the warm hospitality and the strong sense of community, making it feel like a home away from home. Guests mention the opportunity to connect with nature and engage in sustainable living.",
  topics: ["Peaceful atmosphere", "Sustainability", "Dance studio", "Outside amphitheatre"],
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
