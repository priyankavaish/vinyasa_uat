import assert from "node:assert/strict";
import { mkdtemp, cp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createHmac } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright-core");
const folder = await mkdtemp(path.join(tmpdir(), "vinyasa-payment-feedback-"));
const base = "http://localhost:3196";
let server, browser, output = "";
try {
  const pg = new PGlite(path.join(folder, "db"));
  await migrate(drizzle(pg), { migrationsFolder: "./drizzle" });
  await pg.query("INSERT INTO events (slug, name, date_label, price_from, published) VALUES ('payment-browser-test', 'Payment browser test', '1 Jan 2099', 1000, true)");
  await pg.close();
  await cp(".next", path.join(folder, ".next"), { recursive: true, filter: source => !source.split(path.sep).includes("cache") });
  await cp("package.json", path.join(folder, "package.json"));
  await cp("next.config.mjs", path.join(folder, "next.config.mjs"));
  await symlink(path.resolve("node_modules"), path.join(folder, "node_modules"), "junction");
  await symlink(path.resolve("public"), path.join(folder, "public"), "junction");
  server = spawn(process.execPath, [path.resolve("node_modules/next/dist/bin/next"), "start", "-p", "3196"], { cwd: folder, env: { ...process.env, DATABASE_URL: `pglite:${path.join(folder, "db")}`, SESSION_SECRET: "test-only-session", RAZORPAY_KEY_ID: "rzp_test_browser", RAZORPAY_KEY_SECRET: "test-only-callback-secret" }, stdio: "pipe" });
  server.stdout.on("data", chunk => output += chunk); server.stderr.on("data", chunk => output += chunk);
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw Error(output);
    try { if ((await fetch(base + "/admin/login")).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, "isolated server starts");
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = []; page.on("pageerror", error => pageErrors.push(error.message));
  await page.route("https://checkout.razorpay.com/**", route => route.fulfill({ contentType: "application/javascript", body: "/* Checkout stub is supplied by test. */" }));
  await page.addInitScript(() => {
    window.Razorpay = class {
      constructor(options) { this.options = options; this.events = {}; }
      on(name, callback) { this.events[name] = callback; }
      close() { this.options.modal.ondismiss(); }
      open() {
        const mode = window.__paymentMode;
        if (mode === "failed") this.events["payment.failed"]();
        else if (mode === "cancelled") this.options.modal.ondismiss();
        else { this.options.handler({ razorpay_order_id: "order_browser", razorpay_payment_id: "pay_browser", razorpay_signature: "test-signature" }); this.options.modal.ondismiss(); }
      }
    };
  });
  await page.route("**/api/bookings", route => route.fulfill({ json: { booking: { id: "booking_browser" }, order: { id: "order_browser", amount: 118000, currency: "INR", mock: false } } }));
  let verifyMode = "success";
  await page.route("**/api/razorpay/verify", async route => {
    await new Promise(resolve => setTimeout(resolve, 150));
    await route.fulfill({ status: verifyMode === "success" ? 200 : 400, json: verifyMode === "success" ? { booking: { id: "booking_browser", status: "paid" } } : { error: "Payment could not be verified." } });
  });
  for (const mode of ["success", "failed", "cancelled", "unverified"]) {
    verifyMode = mode === "unverified" ? "unverified" : "success";
    await page.goto(base + "/events/payment-browser-test/book", { waitUntil: "networkidle" });
    await page.evaluate(mode => { window.__paymentMode = mode; }, mode);
    await page.locator('[name="eventDate"]').fill("2099-01-01");
    await page.locator('[name="guestName"]').fill("Test Guest");
    await page.locator('[name="guestEmail"]').fill("test@example.com");
    await page.locator('[name="guestPhone"]').fill("9999999999");
    await page.locator('button[type="submit"]').click();
    const dialog = page.locator("dialog[open]"); await dialog.waitFor();
    if (mode === "success") await dialog.getByText("Thank you, payment received.", { exact: true }).waitFor();
    else {
      await dialog.getByText("Payment not completed", { exact: true }).waitFor();
      const message = await dialog.textContent();
      assert.match(message, mode === "failed" ? /Payment failed/ : mode === "cancelled" ? /cancelled/ : /could not confirm/);
    }
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    assert.equal(await page.locator("dialog[open]").count(), 0);
    if (mode !== "success") assert.equal(await page.locator('button[type="submit"]').isEnabled(), true, "customer can retry");
    console.log("PASS: checkout " + mode + " feedback, dismissal and retry state");
  }
  const params = new URLSearchParams({ razorpay_payment_link_id: "plink_test", razorpay_payment_link_reference_id: "", razorpay_payment_link_status: "paid", razorpay_payment_id: "pay_test" });
  params.set("razorpay_signature", createHmac("sha256", "test-only-callback-secret").update("plink_test||paid|pay_test").digest("hex"));
  for (const [query, title] of [[params.toString(), "Thank you, payment received."], ["payment=success", "Payment confirmation pending"], ["payment=failed", "Payment not completed"], ["payment=cancelled", "Payment cancelled"]]) {
    await page.goto(base + "/contact?" + query);
    const dialog = page.locator("dialog[open]");
    await dialog.getByText(title, { exact: true }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "mobile dialog fits");
    await page.screenshot({ path: path.join(folder, title.replaceAll(" ", "-").replaceAll(",", "") + ".png") });
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.equal(new URL(page.url()).search, "", "callback parameters cleaned on close");
    console.log("PASS: hosted-link return " + title + ", mobile sizing and URL cleanup");
  }
  assert.deepEqual(pageErrors, []);
  console.log("Browser artifacts: " + folder);
} finally {
  await writeFile(path.join(folder, "server.log"), output);
  await browser?.close();
  if (server && server.exitCode === null) { server.kill(); await new Promise(resolve => { server.once("exit", resolve); setTimeout(resolve, 5000); }); }
}
