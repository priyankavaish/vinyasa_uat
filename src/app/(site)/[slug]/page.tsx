import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBuilderPages, getPublishedPage } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/block-renderer";
import { LAYOUT_CLASS, type PageLayout } from "@/lib/blocks";

export const revalidate = 300;

export async function generateStaticParams() {
  const pages = await getBuilderPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  const layout = (["boxed", "full", "narrow"] as const).includes(page.layout as PageLayout)
    ? (page.layout as PageLayout)
    : "boxed";

  return (
    <main className="py-14 sm:py-20">
      <div className={`mx-auto w-full px-5 sm:px-8 ${LAYOUT_CLASS[layout]}`}>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{page.title}</h1>
      </div>
      <div className="mt-8">
        <BlockRenderer blocks={page.blocks} layout={layout} />
      </div>
    </main>
  );
}
