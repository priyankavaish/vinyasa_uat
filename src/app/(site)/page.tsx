import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__page";
import { getEditorial } from "@/lib/editorial/server";
import { HomeHero } from "@/components/sections/hero";
// import MarqueeBar from "@/components/sections/marquee-bar";
import NextEventRibbon from "@/components/sections/next-event-ribbon";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import CottagesSection from "@/components/sections/cottages-section";
import GallerySection from "@/components/sections/gallery-section";
import CommunitySection from "@/components/sections/community-section";
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
      `}</style>
      <HomeHero />
      {/* <MarqueeBar /> */}
      <NextEventRibbon />
      <SectionWave
        from="linear-gradient(to right, #7d3128, #9a3f31, #7d3128)"
        to="#fffaf2"
        variant="wave"
        className="h-6 sm:h-10"
      />
      <AnimateInView><CottagesSection /></AnimateInView>
      <SectionWave from="#fffaf2" to="#fff1e0" variant="arch" />
      <AnimateInView><ConnectSection afterFirst={<WorkFromFarmSection />} /></AnimateInView>
      <SectionWave from="#fff1e0" to="#eef0e4" variant="slant" />
      <AnimateInView><CommunitySection /></AnimateInView>
      <SectionWave from="#eef0e4" to="#f3e6d8" variant="wave" />
      <AnimateInView><UpcomingEventsSection /></AnimateInView>
      <SectionWave from="#f3e6d8" to="#e8dbc6" variant="arch" />
      <AnimateInView><TestimonialsSection /></AnimateInView>
      <SectionWave from="#e8dbc6" to="#e7ebdd" variant="hill" />
      <AnimateInView><PhotoMasonry /></AnimateInView>
      <SectionWave from="#e7ebdd" to="#fff1e0" variant="slant" />
      <AnimateInView><GallerySection /></AnimateInView>
    </div>
  );
}
