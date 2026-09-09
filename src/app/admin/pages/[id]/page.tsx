import { notFound } from "next/navigation";
import { getBuilderPages } from "@/lib/cms";
import PageBuilder from "@/components/admin/page-builder";

export const dynamic = "force-dynamic";

export default async function EditBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pages = await getBuilderPages();
  const page = pages.find((p) => p.id === id);
  if (!page) notFound();
  return <PageBuilder page={page} />;
}
