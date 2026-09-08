import { HomeHero } from "@/components/sections/hero";
import MarqueeBar from "@/components/sections/marquee-bar";
import NextEventRibbon from "@/components/sections/next-event-ribbon";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import CottagesSection from "@/components/sections/cottages-section";
import GallerySection from "@/components/sections/gallery-section";
import CommunitySection from "@/components/sections/community-section";
import WorkFromFarmSection from "@/components/sections/work-from-farm-section";
import PhotoMasonry from "@/components/sections/photo-masonry";
import ConnectSection from "@/components/sections/connect-section";

export const metadata = { alternates: { canonical: "/" } };
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
      <MarqueeBar />
      <NextEventRibbon />
      <ConnectSection />
      <WorkFromFarmSection />
      <CommunitySection />
      <UpcomingEventsSection />
      <TestimonialsSection />
      <CottagesSection />
      <PhotoMasonry />
      <GallerySection />
    </div>
  );
}
