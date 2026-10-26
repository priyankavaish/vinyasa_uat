import assert from "node:assert/strict";
import { mkdtemp, cp, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import bcrypt from "bcryptjs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const folder = await mkdtemp(path.join(tmpdir(), "vinyasa-farm-enquiry-"));
const base = "http://localhost:3196";
let server, browser, page, output = "";
try {
  const database = new PGlite(path.join(folder, "db"));
  await migrate(drizzle(database), { migrationsFolder: "./drizzle" });
  await database.query("INSERT INTO admin_users (email,password_hash) VALUES ($1,$2)", ["farm-test@example.com", await bcrypt.hash("isolated-farm-password", 4)]);
  // Edited prices prove the page and server use CMS rates, not fixed numbers or stays rates.
  await database.query("INSERT INTO site_content (key,value) VALUES ($1,$2)", ["editorial:app/(site)/work-from-farm/page", JSON.stringify({ href_22: "/book", stays: [{ rows: [{ price: "₹875 / person / night" }, { price: "₹525 / person / night" }] }, { rows: [{ price: "₹3,500 / cottage / night" }, { price: "₹2,900 / cottage / night" }, { price: "₹2,100 / cottage / night" }] }] })]);
  await database.query("INSERT INTO site_content (key,value) VALUES ($1,$2)", ["editorial:components/sections/work-from-farm-section", JSON.stringify({ href_6: "/book" })]);
  await database.close();
  for (const file of ["src", "package.json", "next.config.mjs", "postcss.config.mjs", "tsconfig.json", "next-env.d.ts"]) await cp(file, path.join(folder, file), { recursive: true });
  await symlink(path.resolve("node_modules"), path.join(folder, "node_modules"), "junction");
  await symlink(path.resolve("public"), path.join(folder, "public"), "junction");
  server = spawn(process.execPath, [path.resolve("node_modules/next/dist/bin/next"), "dev", "-p", "3196"], { cwd: folder, env: { ...process.env, DATABASE_URL: "pglite:" + path.join(folder, "db"), SESSION_SECRET: "isolated-farm-enquiry-secret", SMTP_PASSWORD: "", RESEND_API_KEY: "", BLOB_READ_WRITE_TOKEN: "" }, stdio: "pipe", windowsHide: true });
  server.stdout.on("data", data => output += data);
  server.stderr.on("data", data => output += data);
  console.log("Isolated Work from Farm test: " + folder);
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (server.exitCode !== null) throw Error(output.slice(-3000));
    try { if ((await fetch(base + "/api/leads", { signal: AbortSignal.timeout(5000) })).status === 401) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert(ready, "isolated server starts");
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  // Warm routes before interaction so Next dev Fast Refresh does not interrupt navigation.
  await context.request.post(base + "/api/track", { data: {} });
  for (const route of ["/work-from-farm/book", "/work-from-farm", "/"]) assert((await context.request.get(base + route, { timeout: 120000 })).ok());
  page = await context.newPage();
  page.setDefaultTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(base + "/work-from-farm", { waitUntil: "networkidle", timeout: 120000 });
  const links = page.getByRole("link", { name: "Check Availability & Book", exact: true });
  assert(await links.count() >= 4);
  for (const link of await links.all()) assert((await link.getAttribute("href")).startsWith("/work-from-farm/book"));
  await page.locator('a[href*="stay=earthen-cottage"]').click();
  await page.getByRole("radio", { name: "Earthen Cottage", exact: true }).waitFor();
  assert(await page.getByRole("radio", { name: "Earthen Cottage", exact: true }).isChecked());
  console.log("PASS Work from Farm page buttons migrate from /book and preselect accommodation");

  let earlySubmissions = 0;
  page.on("request", request => { if (request.url() === base + "/api/leads" && request.method() === "POST") earlySubmissions++; });
  await page.getByRole("button", { name: "Continue to your details", exact: true }).click();
  assert.equal(await page.getByLabel("Name", { exact: true }).count(), 0);
  assert.equal(earlySubmissions, 0);

  const checkIn = page.getByLabel("Check-in", { exact: true });
  const checkOut = page.getByLabel("Check-out", { exact: true });
  const guests = page.getByLabel("Number of guests", { exact: true });
  const quote = page.locator("[data-farm-quote]");
  await checkIn.fill("2099-12-01"); await checkOut.fill("2099-12-08"); await guests.fill("2");
  assert.match(await quote.innerText(), /₹2,900/);
  assert.match(await quote.innerText(), /₹23,954/);
  await checkOut.fill("2099-12-16");
  assert.match(await quote.innerText(), /₹2,100/);
  await guests.fill("3");
  assert.equal(await page.getByLabel("Number of cottages", { exact: false }).inputValue(), "2");
  assert.match(await quote.innerText(), /₹74,340/);
  await page.getByRole("radio", { name: "Community Dormitory", exact: true }).check();
  await checkOut.fill("2099-12-08"); await guests.fill("2");
  assert.match(await quote.innerText(), /₹875/);
  assert.match(await quote.innerText(), /₹14,455/);
  await checkOut.fill("2099-12-17");
  assert.match(await quote.innerText(), /₹525/);
  assert.match(await quote.innerText(), /₹19,824/);
  console.log("PASS duration tiers, per-person/per-cottage units, guest count and CMS-edited prices");

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.match(await quote.innerText(), /₹19,824/);
    await quote.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(folder, "farm-" + width + ".png") });
  }
  console.log("PASS desktop, tablet and phone layouts show the same Work from Farm estimate");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await checkOut.press("Enter");
  await page.getByLabel("Name", { exact: true }).waitFor();
  assert.equal(earlySubmissions, 0, "Continue never submits an enquiry");
  await page.getByLabel("Name", { exact: true }).fill("Farm enquiry test");
  await page.getByRole("button", { name: "Edit stay", exact: true }).click();
  assert.equal(await checkOut.inputValue(), "2099-12-17");
  assert.equal(await guests.inputValue(), "2");
  await page.getByRole("button", { name: "Continue to your details", exact: true }).click();
  assert.equal(await page.getByLabel("Name", { exact: true }).inputValue(), "Farm enquiry test");
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.getByLabel("Name", { exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(folder, "farm-details-" + width + ".png") });
  }
  console.log("PASS two-step validation, keyboard Continue and editing preserves stay/contact details");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByLabel("Email", { exact: true }).fill("farm-guest@example.com");
  await page.getByLabel("WhatsApp / phone number", { exact: true }).fill("+919876543210");
  await page.getByText("Add a note (optional)", { exact: true }).click();
  await page.getByLabel("Anything you'd like us to know?", { exact: false }).fill("Need a quiet workspace.");
  const responsePromise = page.waitForResponse(response => response.url() === base + "/api/leads" && response.request().method() === "POST", { timeout: 120000 });
  await page.getByRole("button", { name: "Enquire about availability", exact: true }).click();
  const response = await responsePromise;
  assert.equal(response.status(), 200);
  const { lead } = await response.json();
  assert.equal(lead.source, "work-from-farm");
  assert.match(lead.message, /₹525/);
  assert.match(lead.message, /₹16,800/);
  assert.match(lead.message, /₹19,824/);
  assert.match(lead.message, /Need a quiet workspace/);
  await page.getByRole("dialog").getByRole("heading", { name: "Thank you for your Work from Farm enquiry.", exact: true }).waitFor();
  console.log("PASS real enquiry saves Work from Farm rates, dates, guests and notes");

  const payload = { source: "work-from-farm", name: "API pricing test", email: "api-guest@example.com", phone: "+919876543210", farmStayId: "earthen-cottage", guests: "2", rooms: "1", checkInDate: "2099-12-01", checkOutDate: "2099-12-08", amount: 1, rate: 1 };
  const authoritative = await context.request.post(base + "/api/leads", { data: payload });
  assert.equal(authoritative.status(), 200);
  assert.match((await authoritative.json()).lead.message, /₹23,954/);
  const invalid = await context.request.post(base + "/api/leads", { data: { ...payload, checkOutDate: "2099-11-30" } });
  assert.equal(invalid.status(), 400);
  const wrongCatalogue = await context.request.post(base + "/api/leads", { data: { ...payload, farmStayId: "dorm" } });
  assert.equal(wrongCatalogue.status(), 400);
  const regular = await context.request.post(base + "/api/leads", { data: { source: "stay-enquiry", name: "Regular stay test", email: "regular@example.com", phone: "+919876543210", guests: "2", stayType: "Regular dorm", checkInDate: "2099-12-01", reservePreference: "Full payment" } });
  assert.equal(regular.status(), 200);
  assert.match((await regular.json()).lead.message, /^Stay enquiry/);
  console.log("PASS server calculates authoritative farm prices, rejects invalid dates/options and preserves regular enquiries");

  const login = await context.request.post(base + "/api/admin/login", { data: { email: "farm-test@example.com", password: "isolated-farm-password" } });
  assert.equal(login.status(), 200);
  const saved = await context.request.get(base + "/api/leads");
  assert((await saved.json()).leads.some(item => item.id === lead.id && item.source === "work-from-farm" && item.message.includes("₹19,824")));
  await page.goto(base + "/admin/contact", { waitUntil: "networkidle", timeout: 120000 });
  await page.getByRole("button", { name: "Work from Farm", exact: true }).click();
  assert(await page.getByText("Farm enquiry test", { exact: true }).isVisible());
  assert.equal(await page.getByText("Regular stay test", { exact: true }).count(), 0);
  console.log("PASS admin stores and filters Work from Farm enquiries separately");

  await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 120000 });
  const homeLink = page.getByRole("link", { name: "Plan your work stay", exact: true });
  assert.equal(await homeLink.getAttribute("href"), "/work-from-farm/book");
  await homeLink.click();
  await page.getByRole("heading", { name: "Plan your Work from Farm stay", exact: true }).waitFor();
  assert.match(await page.locator("body").innerText(), /₹875/);
  assert.deepEqual(errors, []);
  console.log("PASS home Work from Farm section opens its own rate and enquiry page");
  console.log("Artifacts: " + folder);
} catch (error) {
  await writeFile(path.join(folder, "server.log"), output);
  await page?.screenshot({ path: path.join(folder, "failure.png"), fullPage: true }).catch(() => {});
  console.error("Artifacts: " + folder);
  throw error;
} finally {
  await browser?.close();
  if (server?.pid && server.exitCode === null) {
    if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
    else server.kill();
  }
}
