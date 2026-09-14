import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-server";
import { managedPages, sectionLabel, sectionHint } from "@/lib/editorial/pages";
import { editorialCatalog } from "@/lib/editorial/catalog";
import { getEditorial } from "@/lib/editorial/server";
import EditorialEditor from "@/components/admin/editorial-editor";
export const dynamic = "force-dynamic";
export default async function PageEditor({ params }: { params: Promise<{ page: string }> }) {
  if (!await getSessionUser()) redirect("/admin/login");
  const { page: id } = await params;
  const page = managedPages.find(p => p.id === id);
  if (!page) notFound();
  const sections = await Promise.all(page.sections.map(async key => ({ key, defaults: editorialCatalog[key], value: await getEditorial(key, editorialCatalog[key]) })));
  return <div className="pt-8 lg:pt-0"><Link href="/admin/pages" className="text-sm text-accent underline">Back to Manage Pages</Link><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">{page.title}</h1>{page.path.startsWith("/") && !page.path.includes("[") && <Link href={page.path} target="_blank" rel="noopener noreferrer" className="btn btn-outline">View page</Link>}</div><p className="mt-3 text-sm text-foreground-soft">Open a section, make your changes, then save that section.</p><div className="mt-6 space-y-4">{sections.map((section, index) => <details key={section.key} open={index === 0} className="border border-line bg-white p-4 sm:p-6"><summary className="cursor-pointer text-lg font-semibold">{sectionLabel(section.key)}</summary>{sectionHint(section.key) && <p className="mt-2 text-sm text-foreground-soft">{sectionHint(section.key)}</p>}{managedPages.filter(p => p.sections.includes(section.key)).length > 1 && <p className="mt-3 text-sm text-foreground-soft">Shared section: changes also apply to {managedPages.filter(p => p.id !== id && p.sections.includes(section.key)).map(p => p.title).join(", ")}.</p>}<EditorialEditor sections={[section]} /></details>)}</div></div>;
}
