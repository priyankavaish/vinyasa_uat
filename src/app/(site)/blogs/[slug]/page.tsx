import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/hero";
import RichContent from "@/components/ui/rich-content";
import { getBlog, getPublishedBlogs } from "@/lib/cms";

export const revalidate = 300;

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return {};
  return {
    title: blog.title,
    description: blog.excerpt || undefined,
    alternates: { canonical: `/blogs/${blog.slug}` },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  return (
    <>
      <PageHero eyebrow="Journal" title={blog.title} description={blog.excerpt || undefined} image={blog.coverUrl || undefined} imageAlt={blog.title} />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <Link href="/blogs" className="text-xs uppercase tracking-[0.08em] text-accent underline">
          ← Back to journal
        </Link>
        {blog.publishedAt ? (
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted">
            {new Date(blog.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        ) : null}
        <RichContent html={blog.bodyHtml} className="mt-6" />
      </section>
    </>
  );
}
