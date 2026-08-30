import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth-server";
import AdminNav from "@/components/admin/admin-nav";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  // /admin/login renders bare (middleware lets it through unauthenticated).
  if (!user) return <div className="min-h-screen bg-[#f7f1e7]">{children}</div>;

  return (
    <div className="flex min-h-screen bg-[#f4efe6] text-foreground">
      <AdminNav email={user.email} />
      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
