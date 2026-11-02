"use client";
import { useEffect, useRef, type ReactNode } from "react";

export default function TermsDialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
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
    className="m-auto max-h-[88vh] w-[min(94vw,44rem)] border border-line bg-surface p-0 text-foreground shadow-[0_40px_100px_-30px_rgba(35,25,15,0.5)] backdrop:bg-black/55 backdrop:backdrop-blur-sm"
  >
    {open && <div className="flex max-h-[88vh] flex-col">
      <div className="space-y-8 overflow-y-auto p-5 sm:p-8">{children}</div>
      <div className="border-t border-line p-4 text-right"><button type="button" onClick={onClose} className="btn btn-accent">Close</button></div>
    </div>}
  </dialog>;
}
