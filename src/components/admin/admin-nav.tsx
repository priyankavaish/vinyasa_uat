"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/contact", label: "Contact queries" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/stays", label: "Stays" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/pages", label: "Manage Pages" },
  { href: "/admin/payment-buttons", label: "Payment buttons" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] lg:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 border-r border-line bg-[#302d24] text-[#f8eedc] transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <p className="font-display text-2xl italic">Vinyasa Earth</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-[#d5bb87]">Admin</p>

          <nav className="mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md border-l-2 px-3 py-2 text-sm transition-colors ${
                  isActive(l.href)
                    ? "border-[#e0a97d] bg-[#8f3b31] font-semibold text-[#f3dba9]"
                    : "border-transparent text-[#f8eedc]/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-white/15 pt-4">
            <p className="truncate text-xs text-[#f8eedc]/60">{email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f3dba9] underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
