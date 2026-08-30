import BlogForm from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic">New post</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
