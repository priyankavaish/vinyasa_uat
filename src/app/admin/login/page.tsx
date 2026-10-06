"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedNext = params.get("next") || "/admin";
  const next = requestedNext === "/admin" || requestedNext.startsWith("/admin/") ? requestedNext : "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Login failed.");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a84f32]">Vinyasa Earth</p>
      <h1 className="mt-2 font-display text-4xl italic">Admin sign in</h1>
      <p className="mt-2 text-sm text-foreground-soft">Manage content, bookings, and enquiries.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="mt-1.5 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1.5 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {status === "error" && error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn btn-accent w-full disabled:opacity-60"
        >
          {status === "submitting" ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Link href="/admin/forgot-password" className="mt-5 inline-block text-sm text-accent underline">Forgot password?</Link>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f7f1e7] px-5 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
