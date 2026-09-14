import { EditorialProvider } from "@/components/editorial/provider";
import { getEditorialOverrides } from "@/lib/editorial/overrides";
import type { ReactNode } from "react";
import SectionMotion from "@/components/layout/section-motion";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import WhatsappButton from "@/components/ui/whatsapp-button";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const values = await getEditorialOverrides();
  return (
    <EditorialProvider values={values}>
      <SiteHeader />
      <SectionMotion>{children}</SectionMotion>
      <SiteFooter />
      <WhatsappButton />
    </EditorialProvider>
  );
}
