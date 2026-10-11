"use client";
import { useEffect, useRef, type ReactNode } from "react";

export default function SuccessDialog({ open, onClose, children, closeLabel = "Close" }: { open: boolean; onClose: () => void; children: ReactNode; closeLabel?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);
  return <dialog
    ref={ref}
    onClose={onClose}
    onClick={(e) => { if (e.target === ref.current) onClose(); }}
    className="m-auto w-[min(92vw,30rem)] border border-line bg-surface p-0 text-foreground shadow-[0_40px_100px_-30px_rgba(35,25,15,0.5)] backdrop:bg-black/55 backdrop:backdrop-blur-sm"
  >
    <div role="status" className="p-7 text-center sm:p-9">
      {children}
      <button type="button" onClick={onClose} className="btn btn-accent mt-6">{closeLabel}</button>
    </div>
  </dialog>;
}
