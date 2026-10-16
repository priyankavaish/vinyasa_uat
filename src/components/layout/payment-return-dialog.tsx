"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormattedText from "@/components/editorial/formatted-text";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_layout_payment_return_dialog";
import { useEditorial } from "@/components/editorial/provider";
import { hasPaymentReturn, PAYMENT_RETURN_PARAMS, type PaymentReturnStatus } from "@/lib/payment-return";
import { PAYMENT_MESSAGES } from "@/lib/payment-messages";
import SuccessDialog from "@/components/forms/success-dialog";


function Inner() {
  const content = useEditorial("components/layout/payment-return-dialog", editorialDefaults);
  const params = useSearchParams();
  const query = params.toString();
  const [status, setStatus] = useState<PaymentReturnStatus | "checking">("checking");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const values = new URLSearchParams(query);
    if (!hasPaymentReturn(values)) return;
    const controller = new AbortController();
    setStatus("checking"); setOpen(true);
    fetch("/api/razorpay/payment-return?" + query, { signal: controller.signal, cache: "no-store" })
      .then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(result => { if (!controller.signal.aborted) setStatus(["success", "failed", "cancelled", "unverified"].includes(result.status) ? result.status : "unverified"); })
      .catch(() => { if (!controller.signal.aborted) setStatus("unverified"); });
    return () => controller.abort();
  }, [query]);
  function close() {
    setOpen(false);
    const url = new URL(window.location.href);
    PAYMENT_RETURN_PARAMS.forEach(name => url.searchParams.delete(name));
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  return <SuccessDialog open={open} onClose={close} closeLabel={content.closeLabel}>
    <h3 className="font-display text-3xl"><FormattedText value={PAYMENT_MESSAGES[status].title} /></h3>
    <p className="mt-4 leading-7 text-foreground-soft"><FormattedText value={PAYMENT_MESSAGES[status].message} /></p>
  </SuccessDialog>;
}
export default function PaymentReturnDialog() { return <Suspense fallback={null}><Inner /></Suspense>; }
