"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  action,
  label = "Delete this item?",
  children = "Delete",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
  children?: React.ReactNode;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(label)) return;
        start(async () => {
          await action(id);
          router.refresh();
        });
      }}
      className="text-xs font-semibold uppercase tracking-[0.1em] text-red-700 underline disabled:opacity-50"
    >
      {pending ? "…" : children}
    </button>
  );
}
