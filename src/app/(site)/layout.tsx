import type { ReactNode } from "react";
import SectionMotion from "@/components/layout/section-motion";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import WhatsappButton from "@/components/ui/whatsapp-button";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <SectionMotion>{children}</SectionMotion>
      <SiteFooter />
      <WhatsappButton />
    </>
  );
}
