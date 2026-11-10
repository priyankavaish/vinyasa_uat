// One-time local helper: gets a Gmail API refresh token for one mailbox, to send mail
// as that address via the Gmail API. Not part of the deployed app.
//
// Usage: node scripts/gmail-oauth-local.cjs <email-hint> <out-file>
const http = require("node:http");
const fs = require("node:fs");
const { execSync } = require("node:child_process");

function loadEnv(path) {
  const out = {};
  for (const line of fs.readFileSync(path, "utf8").split("\n")) {
    const i = line.indexOf("=");
    if (i === -1) continue;
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

async function main() {
  const [, , emailHint, outFile] = process.argv;
  if (!emailHint || !outFile) {
    console.error("Usage: node scripts/gmail-oauth-local.cjs <email-hint> <out-file>");
    process.exit(1);
  }
  const env = loadEnv(".env.gmail-oauth");
  const clientId = env.GMAIL_OAUTH_CLIENT_ID;
  const clientSecret = env.GMAIL_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Fill in .env.gmail-oauth first.");

  const port = 53682;
  const redirectUri = `http://localhost:${port}`;
  const scope = "https://www.googleapis.com/auth/gmail.send";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    access_type: "offline",
    prompt: "consent",
    login_hint: emailHint,
  })}`;

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, redirectUri);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      res.setHeader("Content-Type", "text/html");
      if (error) {
        res.end(`<h2>Could not authorize (${error}). You can close this tab.</h2>`);
        server.close();
        reject(new Error(error));
        return;
      }
      res.end("<h2>Authorized. You can close this tab and go back to the terminal.</h2>");
      server.close();
      resolve(code);
    });
    server.listen(port, () => {
      console.log("Opening browser for:", emailHint);
      try {
        execSync(`powershell -NoProfile -Command "Start-Process '${authUrl.replace(/'/g, "''")}'"`);
      } catch {
        console.log("Open this URL manually:\n", authUrl);
      }
    });
  });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const token = await tokenRes.json();
  if (!tokenRes.ok || !token.refresh_token) {
    console.error("Token exchange failed:", token);
    process.exit(1);
  }
  fs.writeFileSync(outFile, `GMAIL_REFRESH_TOKEN=${token.refresh_token}\n`);
  console.log("Saved refresh token to", outFile);
}

main().catch(err => { console.error(err); process.exit(1); });
