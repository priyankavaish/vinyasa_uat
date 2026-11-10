import "server-only";

// Sends mail as one of two real Gmail mailboxes via the Gmail API, so the "From" address
// is genuinely that mailbox (not a domain sender with no inbox) and replies land there
// directly. Each mailbox authorized this app once via OAuth (refresh token never expires
// for a verified app; see scripts/gmail-oauth-local.cjs for how the tokens were obtained).
export type GmailAccount = "bookings" | "ashram";

type CachedToken = { accessToken: string; expiresAt: number };
// Warm-isolate cache: access tokens are short-lived (~1h), refreshing on every single send
// would be a wasted round trip on a Worker that stays warm between requests.
const tokenCache = new Map<GmailAccount, CachedToken>();

function refreshTokenFor(account: GmailAccount): string {
  const value = account === "bookings" ? process.env.GMAIL_BOOKINGS_REFRESH_TOKEN : process.env.GMAIL_ASHRAM_REFRESH_TOKEN;
  if (!value) throw new Error(`Gmail API is not configured for the ${account} mailbox.`);
  return value;
}

const GMAIL_SENDER: Record<GmailAccount, string> = {
  bookings: "bookings.vinyasaearth@gmail.com",
  ashram: "vinyasa.ashram@gmail.com",
};

export function gmailApiConfigured(): boolean {
  return !!(process.env.GMAIL_OAUTH_CLIENT_ID && process.env.GMAIL_OAUTH_CLIENT_SECRET && process.env.GMAIL_BOOKINGS_REFRESH_TOKEN && process.env.GMAIL_ASHRAM_REFRESH_TOKEN);
}

async function accessTokenFor(account: GmailAccount): Promise<string> {
  const cached = tokenCache.get(account);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.accessToken;
  const clientId = process.env.GMAIL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Gmail API client is not configured.");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshTokenFor(account), grant_type: "refresh_token" }),
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json() as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) throw new Error("Gmail token refresh failed: " + (data.error_description || data.error || res.status));
  const token = { accessToken: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3000) * 1000 };
  tokenCache.set(account, token);
  return token.accessToken;
}

function encodeHeader(value: string): string {
  // RFC 2047 fallback for any non-ASCII in a header value (subject/display name).
  return /^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sendGmail(account: GmailAccount, options: { to: string[]; cc?: string[]; bcc?: string[]; subject: string; text: string; replyTo?: string }): Promise<void> {
  const sender = GMAIL_SENDER[account];
  const headers = [
    `From: "Vinyasa Earth" <${sender}>`,
    `To: ${options.to.join(", ")}`,
    ...(options.cc?.length ? [`Cc: ${options.cc.join(", ")}`] : []),
    ...(options.bcc?.length ? [`Bcc: ${options.bcc.join(", ")}`] : []),
    ...(options.replyTo && options.replyTo !== sender ? [`Reply-To: ${options.replyTo}`] : []),
    `Subject: ${encodeHeader(options.subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
  ];
  const raw = base64url(headers.join("\r\n") + "\r\n\r\n" + options.text);
  const accessToken = await accessTokenFor(account);
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: "Bearer " + accessToken, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error("Gmail send failed: " + res.status + " " + (await res.text().catch(() => "")).slice(0, 300));
}
