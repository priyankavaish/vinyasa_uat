"use client";
import { useEffect } from "react";

/** Keep the cloned page design while sending payment links to a local test screen. */
export default function UatPaymentLinks() {
  useEffect(() => {
    function rewrite(root: ParentNode) {
      const anchors = [...root.querySelectorAll<HTMLAnchorElement>("a[href]")];
      if (root instanceof HTMLAnchorElement) anchors.push(root);
      for (const anchor of anchors) {
        try {
          const url = new URL(anchor.href);
          if (["rzp.io", "rzp.to", "razorpay.me", "pages.razorpay.com", "payments.razorpay.com"].includes(url.hostname)) anchor.href = "/uat-payment";
        } catch { /* Ignore invalid editorial links. */ }
      }
    }
    rewrite(document);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "attributes" && record.target instanceof Element) rewrite(record.target);
        for (const node of record.addedNodes) if (node instanceof Element) rewrite(node);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    return () => observer.disconnect();
  }, []);
  return null;
}
