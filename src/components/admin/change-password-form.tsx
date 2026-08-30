"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) {
      setStatus("error");
      setMsg("New passwords do not match.");
      return;
    }
    setStatus("saving");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? "Could not update password.");
      setStatus("done");
      setMsg("Password updated.");
      setCurrent("");
      setNew("");
      setConfirm("");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Could not update password.");
    }
  }

  const input =
    "mt-1.5 w-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent";
  const label = "block text-xs font-semibold uppercase tracking-[0.1em] text-foreground-soft";

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
      <div>
        <label className={label} htmlFor="cur">Current password</label>
        <input id="cur" type="password" className={input} value={currentPassword} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
      </div>
      <div>
        <label className={label} htmlFor="new">New password</label>
        <input id="new" type="password" className={input} value={newPassword} onChange={(e) => setNew(e.target.value)} autoComplete="new-password" />
      </div>
      <div>
        <label className={label} htmlFor="cf">Confirm new password</label>
        <input id="cf" type="password" className={input} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
      </div>
      {msg && (
        <p className={`text-sm ${status === "error" ? "text-red-700" : "text-secondary"}`}>{msg}</p>
      )}
      <button type="submit" disabled={status === "saving"} className="btn btn-accent disabled:opacity-60">
        {status === "saving" ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
