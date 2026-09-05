import { HomeHero } from "@/components/sections/hero";
import MarqueeBar from "@/components/sections/marquee-bar";
import CottagesPreview from "@/components/sections/cottages-preview";
import GallerySection from "@/components/sections/gallery-section";
import CommunitySection from "@/components/sections/community-section";
import WorkFromFarmSection from "@/components/sections/work-from-farm-section";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
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
      <ConnectSection />
      <WorkFromFarmSection />
      <CommunitySection />
      <CottagesPreview />
      <UpcomingEventsSection />
      <PhotoMasonry />
      <GallerySection />
    </div>
  );
}
