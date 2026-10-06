import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-server";
import { managedPages, sectionLabel, sectionHint } from "@/lib/editorial/pages";
import { editorialCatalog } from "@/lib/editorial/catalog";
import { getEditorial } from "@/lib/editorial/server";
import SitePageEditor from "@/components/admin/site-page-editor";
import { getPageSettings } from "@/lib/page-routing-store";
import { routablePages, settingsFor } from "@/lib/page-routing";
export const dynamic = "force-dynamic";
export default async function PageEditor({ params }: { params: Promise<{ page: string }> }) {
  if (!await getSessionUser()) redirect("/admin/login");
  const { page: id } = await params;
  const page = managedPages.find(p => p.id === id);
  if (!page) notFound();
  const map = await getPageSettings();
  const settings = routablePages.some(p => p.id === id) ? settingsFor(id, map) : undefined;
  const sections = await Promise.all(page.sections.map(async key => ({
    key, label: sectionLabel(key), hint: sectionHint(key),
    shared: managedPages.filter(p => p.id !== id && p.sections.includes(key)).map(p => p.title).join(", "),
    defaults: editorialCatalog[key], value: await getEditorial(key, editorialCatalog[key]),
  })));
  return <SitePageEditor id={id} title={settings?.title ?? page.title} path={settings?.path ?? page.path} sections={sections} settings={settings} />;
}
