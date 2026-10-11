"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormattedText from "@/components/editorial/formatted-text";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_layout_payment_return_dialog";
import { useEditorial } from "@/components/editorial/provider";
import SuccessDialog from "@/components/forms/success-dialog";

const PARAMS = ["payment", "razorpay_payment_id", "razorpay_payment_link_id", "razorpay_payment_link_reference_id", "razorpay_payment_link_status", "razorpay_signature"];

function Inner() {
  const content = useEditorial("components/layout/payment-return-dialog", editorialDefaults);
  const params = useSearchParams();
  const paid = params.get("payment") === "success" || params.get("razorpay_payment_link_status") === "paid";
  const [open, setOpen] = useState(false);
  useEffect(() => { if (paid) setOpen(true); }, [paid]);
  function close() {
    setOpen(false);
    const url = new URL(window.location.href);
    PARAMS.forEach(name => url.searchParams.delete(name));
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  return <SuccessDialog open={open} onClose={close} closeLabel={content.closeLabel}>
    <h3 className="font-display text-3xl"><FormattedText value={content.title} /></h3>
    <p className="mt-4 leading-7 text-foreground-soft"><FormattedText value={content.message} /></p>
  </SuccessDialog>;
}
export default function PaymentReturnDialog() { return <Suspense fallback={null}><Inner /></Suspense>; }
