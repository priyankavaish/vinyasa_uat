"use client";

import FormLoader from "@/components/forms/form-loader";
import SuccessDialog from "@/components/forms/success-dialog";
import { useEffect, useState } from "react";
import type { ArtistApproval, ArtistRejection, ArtistReviewStatus } from "@/lib/artist-escape-booking";

type Review = {
  approval: (ArtistApproval & { link: string }) | null;
  rejection: ArtistRejection | null;
};

export default function ArtistEscapeReview({ leadId, onStatusChange }: { leadId: string; onStatusChange: (status: ArtistReviewStatus) => void }) {
  const endpoint = "/api/admin/leads/" + leadId + "/artist-escape-review";
  const [review, setReview] = useState<Review | null>(null);
  const [remark, setRemark] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(endpoint, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (!controller.signal.aborted) setReview(data);
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Could not load application review.");
      }
    }
    void load();
    return () => controller.abort();
  }, [endpoint]);

  async function submit(action: "approve" | "reject", rejectionRemark = remark) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, remark: rejectionRemark }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReview(data);
      onStatusChange(action === "approve" ? "Approved" : "Rejected");
      if (action === "approve" && data.approval?.emailState === "sent") setShowApprovalConfirmation(true);
      setShowReject(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save application review.");
    } finally {
      setBusy(false);
    }
  }

  const approval = review?.approval;
  const rejection = review?.rejection;
  const expired = !!approval && approval.expiresAt <= Date.now();

  return (
    <section className="mt-5 space-y-3 border-t border-line pt-5">
      <h3 className="font-display text-xl">Artist Escape application</h3>
      <FormLoader active={!review && !error} label="Loading application status..." />
      {review && !approval && !rejection && (
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-accent" disabled={busy} onClick={() => void submit("approve")}>
            Approve
          </button>
          <button type="button" className="btn border border-line" disabled={busy} aria-expanded={showReject} onClick={() => setShowReject(!showReject)}>
            Reject
          </button>
        </div>
      )}
      {showReject && (
        <form className="space-y-2" onSubmit={(event) => { event.preventDefault(); if (remark.trim()) void submit("reject"); }}>
          <label className="block" htmlFor={"rejection-" + leadId}>Rejection remark</label>
          <textarea id={"rejection-" + leadId} className="w-full border border-line bg-white p-3" rows={3} value={remark} onChange={(event) => setRemark(event.target.value)} required maxLength={2000} />
          <button type="submit" className="btn border border-line" disabled={busy || !remark.trim()}>Confirm rejection</button>
        </form>
      )}
      {rejection && (
        <>
          <p className="font-semibold">Rejected</p>
          <p className="whitespace-pre-wrap break-words">{rejection.remark}</p>
          <p>{rejection.emailState === "sent" ? "Rejection email sent." : rejection.emailState === "preview" ? "Rejection email in preview mode." : "Rejection email has not been sent."}</p>
          {rejection.emailError && <p role="alert" className="text-red-700">{rejection.emailError}</p>}
          {rejection.emailState !== "sent" && (
            <button type="button" className="btn border border-line" disabled={busy} onClick={() => void submit("reject", rejection.remark)}>
              Retry rejection email
            </button>
          )}
        </>
      )}
      {approval && (
        <>
          <p className="font-semibold">Approved</p>
          <p>{approval.emailState === "sent" ? "Booking link email sent." : approval.emailState === "preview" ? "Email in preview mode." : "Booking link email has not been sent."}</p>
          {approval.error && <p role="alert" className="text-red-700">{approval.error}</p>}
          {!expired && <a className="text-accent underline" href={approval.link} target="_blank" rel="noopener noreferrer">Open dorm booking link</a>}
          {(expired || approval.emailState !== "sent") && (
            <button type="button" className="btn border border-line" disabled={busy} onClick={() => void submit("approve")}>
              {expired ? "Send new booking link" : "Retry email"}
            </button>
          )}
        </>
      )}
      <SuccessDialog open={showApprovalConfirmation} onClose={() => setShowApprovalConfirmation(false)}>
        <p className="font-display italic text-2xl">Booking link has been sent</p>
        <p className="mt-2 text-sm text-foreground-soft">The applicant can use the link in their email to book an available dorm bed.</p>
      </SuccessDialog>
      <FormLoader active={busy} label="Saving application review..." />
      {error && <p role="alert" className="text-red-700">{error}</p>}
    </section>
  );
}