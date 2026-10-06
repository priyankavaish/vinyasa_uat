import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-server";
import { getDb, hasDb } from "@/lib/db";
import { cottages, events, blogs, pages } from "@/lib/db/schema";
import { managedPages } from "@/lib/editorial/pages";
import ManagePagesTable from "@/components/admin/manage-pages-table";
import { getPageSettings } from "@/lib/page-routing-store";
export const dynamic = "force-dynamic";
export default async function AdminPagesPage() {
  if (!await getSessionUser()) redirect("/admin/login");
  const results = hasDb() ? await Promise.allSettled([
    getDb().select().from(cottages), getDb().select().from(events), getDb().select().from(blogs), getDb().select().from(pages),
  ]) : [];
  const [stays, programs, articles, custom] = (results.length ? results : Array.from({ length: 4 }, () => ({ status: "fulfilled" as const, value: [] }))).map(result => result.status === "fulfilled" ? result.value : []) as [typeof cottages.$inferSelect[], typeof events.$inferSelect[], typeof blogs.$inferSelect[], typeof pages.$inferSelect[]];
  const unavailable = results.flatMap((result, i) => result.status === "rejected" ? [["stays", "events", "blog articles", "custom pages"][i]] : []);
  const pageSettings = await getPageSettings();
  const rows = [
    ...managedPages.map(p => ({ id: p.id, title: pageSettings[p.id]?.title ?? p.title, path: pageSettings[p.id]?.path ?? p.path, kind: p.id === "shared" ? "Shared" : p.id.endsWith("template") ? "Template" : "Website page", href: "/admin/pages/site/" + p.id, deleteId: "", status: p.id === "shared" || p.id.endsWith("template") ? "shared" : "published" })),
    ...stays.map(p => ({ id: "stay-" + p.id, title: p.name, path: "/stays/" + p.slug, kind: "Stay", href: "/admin/stays/" + p.id, deleteId: "", status: p.published ? "published" : "draft" })),
    ...programs.map(p => ({ id: "event-" + p.id, title: p.name, path: "/events/" + p.slug, kind: "Event", href: "/admin/events/" + p.id, deleteId: "", status: p.published ? "published" : "draft" })),
    ...articles.map(p => ({ id: "blog-" + p.id, title: p.title, path: "/blogs/" + p.slug, kind: "Blog article", href: "/admin/blog/" + p.id, deleteId: "", status: p.status })),
    ...custom.map(p => ({ id: "custom-" + p.id, title: p.title, path: p.slug === "home" ? "/" : "/" + p.slug, kind: "Custom page", href: "/admin/pages/" + p.id, deleteId: p.id, status: p.status })),
  ];
  return <div className="pt-8 lg:pt-0">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-semibold">Manage Pages</h1><p className="mt-2 text-sm text-foreground-soft">Select a page to edit its text, images and content.</p></div><Link href="/admin/pages/new" className="btn btn-accent">New page</Link></div>
    {unavailable.length > 0 && <p role="status" className="mt-4 border border-line p-3 text-sm">Could not load {unavailable.join(", ")}. Refresh to try again. Website page editors are available below.</p>}
    <ManagePagesTable rows={rows} />
  </div>;
}
