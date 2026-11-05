import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import RichContent from "@/components/ui/rich-content";
import { getBlog, getPublishedBlogs } from "@/lib/cms";

import { blogKeywords } from "@/lib/blog-fields";

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
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt || undefined,
    keywords: blogKeywords(blog),
    alternates: { canonical: `/blogs/${blog.slug}` },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();
  if (blog.slug !== slug) redirect(`/blogs/${blog.slug}`);

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-accent">
          <Icon name="arrow-forward-outline" size={14} className="rotate-180" />
          Back to journal
        </Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Journal</p>
        <h1 className="mt-3 font-display text-4xl italic leading-tight text-clay-ink sm:text-5xl">{blog.title}</h1>
        {blog.publishedAt ? (
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted">
            {new Date(blog.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        ) : null}
        <span aria-hidden="true" className="mt-6 block h-[3px] w-16 rounded-full bg-accent" />
        <RichContent html={blog.bodyHtml} className="mt-8" />
      </section>
    </>
  );
}
