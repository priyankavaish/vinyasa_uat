import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__page";
import { getEditorial } from "@/lib/editorial/server";
import { HomeHero } from "@/components/sections/hero";
// import MarqueeBar from "@/components/sections/marquee-bar";
import NextEventRibbon from "@/components/sections/next-event-ribbon";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import GallerySection from "@/components/sections/gallery-section";
import WorkFromFarmSection from "@/components/sections/work-from-farm-section";
import PhotoMasonry from "@/components/sections/photo-masonry";
import ConnectSection from "@/components/sections/connect-section";
import AnimateInView from "@/components/ui/animate-in-view";
import SectionWave from "@/components/ui/section-wave";

export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/page", editorialDefaults)).seo;
}
export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="home-page-theme">
      <style>{`
        .home-page-theme {
          background-color: #fff1e0;
        }
        :root {
          --wave-lead: #fff1e0;
        }
      `}</style>
      <HomeHero />
      {/* <MarqueeBar /> */}
      <NextEventRibbon />
      <SectionWave
        from="linear-gradient(to right, #7d3128, #9a3f31, #7d3128)"
        to="#fffaf2"
        variant="wave"
        className="next-event-wave h-6 sm:h-10"
      />
      <SectionWave from="#fffaf2" to="#fff1e0" variant="arch" />
      <AnimateInView delay={80}><ConnectSection afterFirst={<WorkFromFarmSection />} /></AnimateInView>
      <SectionWave from="#fff1e0" to="#f3e6d8" variant="slant" />
      <AnimateInView delay={100}><UpcomingEventsSection /></AnimateInView>
      <SectionWave from="#f3e6d8" to="#e8dbc6" variant="arch" />
      <AnimateInView delay={100}><TestimonialsSection /></AnimateInView>
      <SectionWave from="#e8dbc6" to="#e7ebdd" variant="hill" />
      <AnimateInView delay={80}><PhotoMasonry /></AnimateInView>
      <SectionWave from="#e7ebdd" to="#fff1e0" variant="slant" />
      <AnimateInView delay={80}><GallerySection /></AnimateInView>
    </div>
  );
}
