import assert from "node:assert/strict";
import { mkdtemp, rm, cp, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import bcrypt from "bcryptjs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { chromium } from "playwright";

const folder = await mkdtemp(path.join(tmpdir(), "vinyasa-payment-test-"));
const port = 3198;
const base = `http://localhost:${port}`;
const secret = "isolated-payment-button-browser-test";
let server, browser;
try {
  const pg = new PGlite(path.join(folder, "db"));
  await migrate(drizzle(pg), { migrationsFolder: "./drizzle" });
  await pg.query("INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)", ["payment-test@example.com", await bcrypt.hash("test-only-password", 4)]);
  await pg.query("INSERT INTO cottages (slug, name, price_per_night) VALUES ('agni', 'Agni', 4500)");
  await pg.query("INSERT INTO events (slug, name, date_label) VALUES ('zariya', 'Zariya', '1 Jan 2099')");
  await pg.close();
  await cp(".next", path.join(folder, ".next"), { recursive: true, filter: (source) => !source.split(path.sep).includes("cache") });
  await cp("package.json", path.join(folder, "package.json"));
  await cp("next.config.mjs", path.join(folder, "next.config.mjs"));
  await symlink(path.resolve("node_modules"), path.join(folder, "node_modules"), "junction");
  await symlink(path.resolve("public"), path.join(folder, "public"), "junction");
  server = spawn(process.execPath, [path.resolve("node_modules/next/dist/bin/next"), "start", "-p", String(port)], {
    env: { ...process.env, DATABASE_URL: `pglite:${path.join(folder, "db")}`, SESSION_SECRET: secret },
    cwd: folder,
    stdio: "pipe",
  });
  let serverOutput = "";
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error("Test server exited: " + serverOutput.slice(-1500));
    try { const r = await fetch(base + "/admin/login"); if (r.ok) { ready = true; break; } } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert.ok(ready, "test server starts");
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base + "/admin/payment-buttons");
  assert.ok(page.url().includes("/admin/login"), "admin page requires authentication");
  const login = await context.request.post(base + "/api/admin/login", { data: { email: "payment-test@example.com", password: "test-only-password" } });
  assert.equal(login.status(), 200, "test admin signs in");
  await page.goto(base + "/admin/payment-buttons");
  assert.ok(!page.url().includes("/admin/login"), "authenticated admin route opens");
  await page.locator("#payment-target").selectOption("event:zariya");
  await page.locator("#payment-url").fill("https://example.com/pay");
  await page.getByRole("button", { name: "Save button" }).click();
  await page.getByRole("alert").filter({ hasText: "valid HTTPS Razorpay" }).waitFor();
  await page.locator("#payment-url").fill("https://rzp.io/l/test-event");
  await page.locator("#payment-label").fill("Pay for Zariya");
  await page.getByRole("button", { name: /^Background/ }).click();
  await page.getByRole("button", { name: "Sage green", exact: true }).click();
  await page.getByRole("button", { name: /^Text/ }).click();
  await page.getByRole("button", { name: "Light clay", exact: true }).click();
  await page.mouse.move(0, 0);
  const previewStyle = await page.getByRole("button", { name: "Pay for Zariya", exact: true }).evaluate((el) => ({ background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }));
  assert.equal(previewStyle.background, "rgb(107, 122, 94)");
  await page.getByRole("button", { name: "Save button" }).click();
  await page.getByRole("status").filter({ hasText: "live" }).waitFor();
  console.log("PASS: login, invalid URL, event save");
  await page.reload();
  await page.locator("#payment-target").selectOption("event:zariya");
  assert.equal(await page.locator("#payment-url").inputValue(), "https://rzp.io/l/test-event");
  const publicPage = await context.newPage();
  await publicPage.goto(base + "/events/zariya");
  const eventButtons = publicPage.locator('a[href="https://rzp.io/l/test-event"]');
  await eventButtons.first().waitFor();
  assert.ok(await eventButtons.count() >= 2, "all event booking buttons updated");
  assert.equal((await eventButtons.first().textContent()).trim(), "Pay for Zariya");
  assert.equal(await eventButtons.first().evaluate((el) => getComputedStyle(el).backgroundColor), "rgb(107, 122, 94)");
  assert.equal(await eventButtons.first().evaluate((el) => getComputedStyle(el).color), previewStyle.color);
  console.log("PASS: event persisted and public colors match preview");
  await page.locator("#payment-target").selectOption("stay:agni");
  await page.locator("#payment-url").fill("https://razorpay.me/@stay-test");
  await page.locator("#payment-label").fill("Pay for Agni");
  await page.getByRole("button", { name: "Save button" }).click();
  await page.getByRole("status").filter({ hasText: "live" }).waitFor();
  await publicPage.goto(base + "/stays/agni");
  await publicPage.getByRole("link", { name: "Pay for Agni" }).waitFor();
  assert.equal(await publicPage.getByRole("link", { name: "Pay for Agni" }).getAttribute("href"), "https://razorpay.me/@stay-test");
  await page.locator("#payment-target").selectOption("event:zariya");
  await page.locator("#payment-url").fill("");
  await page.getByRole("button", { name: "Save button" }).click();
  await page.getByRole("status").filter({ hasText: "original link" }).waitFor();
  await publicPage.goto(base + "/events/zariya");
  assert.ok(await publicPage.locator('a[href="/book?type=event&slug=zariya"]').count() >= 2);
  await page.locator("#payment-target").selectOption("general");
  await page.locator("#payment-url").fill("https://rzp.io/l/general-test");
  await page.locator("#payment-label").fill("Make a payment");
  await page.getByRole("button", { name: "Save button" }).click();
  await page.getByRole("status").filter({ hasText: "live" }).waitFor();
  await publicPage.goto(base + "/useful-links");
  assert.equal(await publicPage.getByRole("link", { name: "Make a payment", exact: true }).getAttribute("href"), "https://rzp.io/l/general-test");
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.getByRole("button", { name: /^Background/ }).click();
  await page.screenshot({ path: path.join(tmpdir(), "vinyasa-payment-review.png"), fullPage: true });
  await page.getByRole("button", { name: /^Background/ }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "mobile editor fits viewport");

  await page.goto(base + "/admin/stays");
  const stockForm = page.locator('[data-stay-stock="agni"]');
  await stockForm.locator('input[name="quantity"]').fill("0");
  await stockForm.getByRole("button", { name: "Save", exact: true }).click();
  await stockForm.getByRole("status").filter({ hasText: "sold out" }).waitFor();
  await page.reload();
  assert.equal(await stockForm.locator('input[name="quantity"]').inputValue(), "0");
  await publicPage.goto(base + "/stays/agni");
  const soldOutButton = publicPage.getByRole("button", { name: "Sold out", exact: true });
  await soldOutButton.waitFor();
  assert.equal(await soldOutButton.isDisabled(), true);
  assert.equal(await publicPage.locator('a[href="https://razorpay.me/@stay-test"]').count(), 0);
  await publicPage.goto(base + "/stays");
  await publicPage.locator("article").filter({ has: publicPage.getByRole("heading", { name: "Agni", exact: true }) }).getByText("Sold out", { exact: true }).waitFor();
  await publicPage.goto(base + "/book?type=stay&slug=agni");
  await publicPage.getByRole("button", { name: "Sold out", exact: true }).waitFor();
  assert.equal(await publicPage.getByRole("button", { name: "Sold out", exact: true }).isDisabled(), true);
  const blockedBooking = await context.request.post(base + "/api/bookings", { data: {
    type: "stay", itemSlug: "agni", checkIn: "2099-01-01", checkOut: "2099-01-02",
    guests: 1, guestName: "Test Guest", guestEmail: "guest@example.com", guestPhone: "9999999999",
  } });
  assert.equal(blockedBooking.status(), 409, "sold out booking rejected on server");
  await stockForm.locator('input[name="quantity"]').fill("2");
  await stockForm.getByRole("button", { name: "Save", exact: true }).click();
  await stockForm.getByRole("status").filter({ hasText: "Quantity saved" }).waitFor();
  await publicPage.goto(base + "/stays/agni");
  await publicPage.getByRole("link", { name: "Pay for Agni" }).waitFor();
  await stockForm.locator('input[name="quantity"]').fill("");
  await stockForm.getByRole("button", { name: "Save", exact: true }).click();
  await stockForm.getByRole("status").filter({ hasText: "Quantity saved" }).waitFor();
  await page.reload();
  assert.equal(await stockForm.locator('input[name="quantity"]').inputValue(), "");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "mobile inventory fits viewport");
  await page.locator("section").filter({ has: page.getByRole("heading", { name: "Available quantity" }) }).screenshot({ path: path.join(tmpdir(), "vinyasa-inventory-review.png") });
  console.log("PASS: authentication, palette/preview, event/stay links, mobile, quantity save/reload, sold out listing/detail/booking, server rejection, restock, clear quantity");
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill();
    await new Promise((resolve) => { server.once("exit", resolve); setTimeout(resolve, 5000); });
  }
  assert.ok(path.resolve(folder).startsWith(path.resolve(tmpdir()) + path.sep), "cleanup stays within temporary directory");
  await rm(folder, { recursive: true, force: true });
}
