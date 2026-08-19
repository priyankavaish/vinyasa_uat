import "./globals.css";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Mrs_Saint_Delafield } from "next/font/google";
import { SITE_ORIGIN } from "@/lib/site";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import WhatsappButton from "@/components/whatsapp-button";

// Display serif + sans, lifted as-is from the farmform reference clone
// (ditto.site build, cloned locally) — same font files, same weights.
const displaySerif = localFont({
  src: "../../public/fonts/tt-ramillas.woff2",
  variable: "--font-fraunces",
  weight: "400",
  style: "normal",
  display: "swap",
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

export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "Vinyasa Earth: Mud House Stays & Artist Residencies, Jaipur",
  description:
    "Six eco mud-house cottages, artist residencies, retreats, and corporate offsites in Amer, Jaipur. Live, create, belong.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f1ea",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${archivo.variable} ${script.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsappButton />
      </body>
    </html>
  );
}
