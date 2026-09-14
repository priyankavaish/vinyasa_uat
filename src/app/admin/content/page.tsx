import { redirect } from "next/navigation";
import { managedPages } from "@/lib/editorial/pages";
export default async function ContentPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section } = await searchParams;
  const page = managedPages.find(p => p.sections.some(key => key === section));
  redirect(page ? "/admin/pages/site/" + page.id : "/admin/pages");
}
