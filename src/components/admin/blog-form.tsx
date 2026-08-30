import { saveBlog } from "@/lib/admin/actions";
import ImageField from "@/components/admin/image-field";
import RichEditorField from "@/components/admin/rich-editor-field";
import type { BlogRow } from "@/lib/db/schema";

const field = "mt-1.5 w-full border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft";

export default function BlogForm({ blog }: { blog?: BlogRow }) {
  return (
    <form action={saveBlog} className="max-w-3xl space-y-5">
      {blog && <input type="hidden" name="id" value={blog.id} />}

      <div>
        <label className={label}>Title</label>
        <input name="title" required defaultValue={blog?.title} className={field} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Slug</label>
          <input name="slug" defaultValue={blog?.slug} placeholder="auto from title" className={field} />
        </div>
        <div>
          <label className={label}>Status</label>
          <select name="status" defaultValue={blog?.status ?? "draft"} className={field}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Excerpt / description</label>
        <textarea name="excerpt" rows={2} defaultValue={blog?.excerpt} className={field} />
      </div>

      <ImageField name="coverUrl" label="Cover image" defaultValue={blog?.coverUrl ?? ""} />

      <RichEditorField name="bodyHtml" label="Post content" defaultValue={blog?.bodyHtml ?? ""} />

      <div className="flex gap-3">
        <button type="submit" className="btn btn-accent">Save post</button>
        <a href="/admin/blog" className="btn btn-outline">Cancel</a>
      </div>
    </form>
  );
}
