import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Mrs_Saint_Delafield, Bellefair } from "next/font/google";
import { SITE_ORIGIN } from "@/lib/site";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import WhatsappButton from "@/components/whatsapp-button";

const displaySerif = localFont({
  src: "../../public/fonts/tt-ramillas.woff2",
  variable: "--font-fraunces",
  weight: "400",
  style: "normal",
  display: "swap",
});

const bellefair = Bellefair({
  subsets: ["latin"],
  variable: "--font-bellefair",
  weight: "400",
});

const script = Mrs_Saint_Delafield({
  subsets: ["latin"],
  variable: "--font-mrs-saint",
  weight: "400",
});

const archivo = localFont({
  src: "../../public/fonts/karla-300.woff2",
  variable: "--font-archivo",
  weight: "300",
  style: "normal",
  display: "swap",
});

const samarkan = localFont({
  src: "../../public/fonts/samarkan.ttf",
  variable: "--font-samarkan",
  weight: "400",
  style: "normal",
  display: "swap",
});

const description =
  "Stay in hand-built mud cottages, join artist residencies and retreats, or host a thoughtful team offsite in Amer, Jaipur.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Vinyasa Earth | Mud Cottage Stays & Artist Residencies in Jaipur",
    template: "%s | Vinyasa Earth",
  },
  description,
  applicationName: "Vinyasa Earth",
  authors: [{ name: "Vinyasa Earth", url: SITE_ORIGIN }],
  creator: "Vinyasa Earth",
  publisher: "Vinyasa Earth",
  category: "Travel and hospitality",
  keywords: [
    "Vinyasa Earth", "mud house stay Jaipur", "artist residency India",
    "eco retreat Jaipur", "Amer Jaipur stay", "creative retreat Rajasthan",
    "corporate offsite Jaipur", "wellness retreat Rajasthan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Vinyasa Earth",
    title: "Vinyasa Earth | Stay · Create · Connect",
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vinyasa Earth in Amer, Jaipur" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinyasa Earth | Stay · Create · Connect",
    description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f1ea",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${archivo.variable} ${script.variable} ${samarkan.variable} ${bellefair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: "Vinyasa Earth",
              url: SITE_ORIGIN,
              image: `${SITE_ORIGIN}/images/hero-video-poster.jpg`,
              description,
              telephone: "+91 77376 07227",
              email: "vinyasa.ashram@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Maheshwas Khurd",
                addressLocality: "Amer",
                addressRegion: "Rajasthan",
                postalCode: "302012",
                addressCountry: "IN",
              },
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.6", reviewCount: "127" },
              sameAs: ["https://www.instagram.com/vinyasa.earth/"],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsappButton />
      </body>
    </html>
  );
}
