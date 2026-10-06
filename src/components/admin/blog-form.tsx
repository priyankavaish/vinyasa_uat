"use client";
import { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { previewBlogPost, saveBlogPost } from "@/lib/blog-post-actions";
import { blogSlug, emptyBlogSettings, type BlogSettings } from "@/lib/blog-fields";
import ImageField from "./image-field";
import type { BlogRow } from "@/lib/db/schema";
const RichEditor = dynamic(() => import("./rich-editor"), { ssr: false, loading: () => <p className="border border-line bg-white p-6 text-sm">Loading visual editor...</p> });
type Preview = { title: string; excerpt: string; coverUrl: string; html: string };
const field = "mt-2 w-full border border-line bg-white px-3 py-3 text-sm focus:outline-accent";
export default function BlogForm({ blog, settings = emptyBlogSettings }: { blog?: BlogRow; settings?: BlogSettings }) {
  const router = useRouter();
  const inputId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const [id, setId] = useState(blog?.id ?? "");
  const [title, setTitle] = useState(blog?.title ?? "");
  const [savedSlug, setSavedSlug] = useState(blog?.slug ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [status, setStatus] = useState(blog?.status ?? "draft");
  const [body, setBody] = useState(blog?.bodyHtml ?? "");
  const [cover, setCover] = useState(blog?.coverUrl ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [extras, setExtras] = useState(settings);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [bodyUploading, setBodyUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const effectiveSlug = blogSlug(slug || title);
  const wordCount = body.replace(/<[^>]*>/g, " ").replace(/&[a-z0-9#]+;/gi, " ").trim().split(/\s+/).filter(Boolean).length;
  const busy = saving || previewing || bodyUploading || coverUploading;
  function changed() { setDirty(true); setMessage(""); setError(""); }
  function setExtra(key: "category" | "tags" | "seoTitle" | "seoDescription" | "seoKeywords", value: string) { setExtras(old => ({ ...old, [key]: value })); changed(); }
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  async function submit(nextStatus: "draft" | "published") {
    if (!formRef.current || busy) return;
    if (status === "published" && nextStatus === "draft" && !window.confirm("Move this published post to draft? It will be hidden from the public website.")) return;
    setSaving(true); setError(""); setMessage("");
    try {
      const form = new FormData(formRef.current); form.set("status", nextStatus);
      const result = await saveBlogPost(form);
      if (!result.ok) { setError(result.error); return; }
      setId(result.id); setSavedSlug(result.slug); setSlug(result.slug); setStatus(result.status); setDirty(false);
      setMessage(result.status === "published" ? "Published. Your post is live." : "Draft saved. It is visible only to admins.");
      if (!id) router.replace("/admin/blog/" + result.id); else router.refresh();
    } catch { setError("Could not save. Your edits are still here; please retry."); }
    finally { setSaving(false); }
  }
  async function showPreview() {
    if (!formRef.current || busy) return;
    setPreviewing(true); setError("");
    try {
      const result = await previewBlogPost(new FormData(formRef.current));
      if (!result.ok) { setError(result.error); return; }
      setPreview(result);
      requestAnimationFrame(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch { setError("Could not load preview. Please retry."); }
    finally { setPreviewing(false); }
  }
  return <form ref={formRef} className="pb-16" onSubmit={e => { e.preventDefault(); const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; void submit(submitter?.value === "draft" ? "draft" : "published"); }}>
    <input type="hidden" name="id" value={id} /><input type="hidden" name="bodyHtml" value={body} /><input type="hidden" name="status" value={status} />
    <div className="sticky top-0 z-10 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#f4efe6] py-4">
      <Link href="/admin/blog" onClick={e => { if (dirty && !window.confirm("Leave this editor and discard unsaved changes?")) e.preventDefault(); }} className="text-sm text-accent underline">All posts</Link>
      <div className="flex flex-wrap gap-2"><button type="button" disabled={busy} className="btn btn-outline disabled:opacity-50" onClick={() => void showPreview()}>{previewing ? "Loading preview..." : "Preview"}</button><button type="submit" value="draft" disabled={busy} className="btn btn-outline disabled:opacity-50">{status === "published" ? "Switch to draft" : "Save draft"}</button><button type="submit" value="published" disabled={busy} className="btn btn-accent disabled:opacity-50">{saving ? "Saving..." : status === "published" ? "Update post" : "Publish"}</button></div>
    </div>
    <div className="mb-4" aria-live="polite">{error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}{message && <p role="status" className="border border-line bg-white p-3 text-sm">{message}</p>}{dirty && !error && !message && <p className="text-xs text-foreground-soft">Unsaved changes</p>}{(bodyUploading || coverUploading) && <p className="text-sm">Uploading image. Please wait before saving.</p>}</div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-5">
        <section className="border border-line bg-white p-4 sm:p-6"><label htmlFor={inputId + "-title"} className="text-sm font-semibold">Post title</label><input id={inputId + "-title"} name="title" required maxLength={200} placeholder="Add title" value={title} onChange={e => { setTitle(e.target.value); changed(); }} className="mt-2 w-full border-b border-line py-3 text-2xl font-semibold outline-none focus:border-accent" /><label htmlFor={inputId + "-slug"} className="mt-5 block text-sm font-semibold">Permalink / URL slug<input id={inputId + "-slug"} name="slug" maxLength={80} value={slug} onChange={e => { setSlug(e.target.value); changed(); }} placeholder="Automatically generated from the title" className={field} /></label><p className="mt-2 break-all text-xs text-foreground-soft">/blogs/{effectiveSlug || "your-post-url"}</p></section>
        <section className="border border-line bg-white p-4 sm:p-6"><h2 className="mb-3 font-semibold">Post content</h2><RichEditor value={body} onChange={html => { setBody(html); changed(); }} blockTools onUploadStateChange={setBodyUploading} /><p className="mt-3 text-xs text-foreground-soft">{wordCount} words · Use + Add block for paragraphs, headings, photos, lists and quotes.</p></section>
        <details className="border border-line bg-white p-4" open><summary className="cursor-pointer font-semibold">Search engine settings (SEO)</summary><div className="mt-4 space-y-4">
          <label className="block text-sm">SEO title<input name="seoTitle" maxLength={200} className={field} value={extras.seoTitle} onChange={e => setExtra("seoTitle", e.target.value)} placeholder={title || "Uses the post title when blank"} /></label>
          <label className="block text-sm">Meta description<textarea name="seoDescription" maxLength={500} rows={3} className={field} value={extras.seoDescription} onChange={e => setExtra("seoDescription", e.target.value)} placeholder="Uses the excerpt when blank" /></label>
          <label className="block text-sm">Meta keywords<input name="seoKeywords" maxLength={1000} className={field} value={extras.seoKeywords} onChange={e => setExtra("seoKeywords", e.target.value)} placeholder="Jaipur, art residency, eco stays" /><span className="mt-1 block text-xs text-foreground-soft">Separate keywords with commas. Canonical URL follows the post permalink automatically.</span></label>
          <div className="border border-line bg-background p-4"><p className="text-xs text-foreground-soft">Search result preview · /blogs/{effectiveSlug || "your-post-url"}</p><p className="mt-2 break-words text-lg text-[#1a0dab]">{extras.seoTitle || title || "Post title"}</p><p className="mt-1 break-words text-sm text-foreground-soft">{extras.seoDescription || excerpt || "Add an excerpt or meta description."}</p><p className="mt-3 text-xs text-foreground-soft">Illustrative preview; search engines may show different text.</p></div>
        </div></details>
      </div>
      <aside className="min-w-0 space-y-4">
        <section className="border border-line bg-white p-4"><h2 className="font-semibold">Post settings</h2><p className="mt-3 text-sm">Status: <strong className="capitalize">{status}</strong></p><p className="mt-2 text-xs text-foreground-soft">{status === "draft" ? "Drafts are hidden from the public website." : "Published posts are visible on the website."}</p>{id && <div className="mt-4 flex flex-wrap gap-3 text-sm"><Link href={"/admin/blog/" + id + "/preview"} target="_blank" className="text-accent underline">Saved preview</Link>{status === "published" && <Link href={"/blogs/" + savedSlug} target="_blank" className="text-accent underline">View post</Link>}</div>}</section>
        <section className="border border-line bg-white p-4"><ImageField name="coverUrl" label="Featured image" value={cover} onChange={url => { setCover(url); changed(); }} onBusyChange={setCoverUploading} /></section>
        <section className="border border-line bg-white p-4"><label className="text-sm font-semibold">Excerpt<textarea name="excerpt" rows={4} maxLength={500} value={excerpt} onChange={e => { setExcerpt(e.target.value); changed(); }} placeholder="Short summary for the blog listing" className={field} /></label><p className="mt-2 text-xs text-foreground-soft">{excerpt.length}/500 characters</p></section>
        <section className="border border-line bg-white p-4"><label className="text-sm font-semibold">Category<input name="category" maxLength={80} list={inputId + "-categories"} value={extras.category} onChange={e => setExtra("category", e.target.value)} placeholder="Choose or type a category" className={field} /></label><datalist id={inputId + "-categories"}>{["Journal", "Art", "Community", "Stays", "Retreats"].map(category => <option key={category} value={category} />)}</datalist><label className="mt-4 block text-sm font-semibold">Tags<input name="tags" maxLength={600} value={extras.tags} onChange={e => setExtra("tags", e.target.value)} placeholder="Jaipur, community, nature" className={field} /></label><p className="mt-2 text-xs text-foreground-soft">Separate tags with commas. Categories and tags help organise posts in admin.</p></section>
      </aside>
    </div>
    {preview && <section ref={previewRef} className="mt-6 scroll-mt-24 border border-line bg-white p-5 sm:p-8"><div className="mb-5 flex items-center justify-between gap-3"><p className="text-sm text-foreground-soft">Content preview · snapshot of your unsaved edits</p><button type="button" className="text-sm underline" onClick={() => setPreview(null)}>Close preview</button></div><h2 className="font-display text-3xl">{preview.title}</h2>{preview.excerpt && <p className="mt-3 text-foreground-soft">{preview.excerpt}</p>}{preview.coverUrl && <img src={preview.coverUrl} alt={preview.title} className="mt-5 max-h-96 w-full object-cover" />}<div className="rich mt-6" dangerouslySetInnerHTML={{ __html: preview.html }} /></section>}
  </form>;
}
