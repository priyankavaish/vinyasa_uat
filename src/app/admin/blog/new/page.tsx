import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-server";
import { hasDb } from "@/lib/db";
import BlogForm from "@/components/admin/blog-form";
export const dynamic = "force-dynamic";
export default async function NewBlogPage() {
  if (!await getSessionUser()) redirect("/admin/login");
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  return <div className="pt-8 lg:pt-0"><h1 className="text-3xl font-semibold">Add new post</h1><BlogForm /></div>;
}
