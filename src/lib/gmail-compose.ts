// mailto: does nothing when the visitor's device has no desktop mail app configured
// (common on a Chrome desktop) — open Gmail's web compose instead, which always works.
export function gmailCompose(href: string): string {
  if (!href.startsWith("mailto:")) return href;
  const [to, query = ""] = href.slice(7).split("?");
  const params = new URLSearchParams(query);
  const subject = params.get("subject") ?? "";
  const body = params.get("body") ?? "";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
}
