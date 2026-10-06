import { EditorialProvider } from "@/components/editorial/provider";
import { getEditorialOverrides } from "@/lib/editorial/overrides";
import type { ReactNode } from "react";
import { getPageSettings } from "@/lib/page-routing-store";
import SectionMotion from "@/components/layout/section-motion";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import WhatsappButton from "@/components/ui/whatsapp-button";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [values, pageSettings] = await Promise.all([getEditorialOverrides(), getPageSettings()]);
  return (
    <EditorialProvider values={values}>
      <SiteHeader pageSettings={pageSettings} />
      <SectionMotion>{children}</SectionMotion>
      <SiteFooter />
      <WhatsappButton />
    </EditorialProvider>
  );
}
