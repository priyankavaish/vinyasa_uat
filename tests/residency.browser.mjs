import assert from "node:assert/strict";
import { mkdtemp, cp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import bcrypt from "bcryptjs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const folder = await mkdtemp(path.join(tmpdir(), "vinyasa-residency-"));
const base = "http://localhost:3197";
let browser, server;
let output = "";
try {
  const pg = new PGlite(path.join(folder, "db"));
  await migrate(drizzle(pg), { migrationsFolder: "./drizzle" });
  await pg.query("INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)", ["formatting-test@example.com", await bcrypt.hash("test-only-password", 4)]);
  await pg.query("INSERT INTO events (slug,name,kind,duration_label,date_label,description,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7)", ["artist-in-residence", "Artist-in-Residence Program", "residency", "4 months", "1 Jun - 30 Sep 2026", "A four-month immersive residency for artists at Vinyasa Earth.", "/seed/community-05.jpg"]);
  await pg.query("INSERT INTO events (slug,name,kind,date_label,description,image_url,sort) VALUES ($1,$2,$3,$4,$5,$6,$7)", ["artist-unite", "Artist Unite - A Residency of Self Creation", "residency", "15-24 Oct 2026", "A separate ten-day interdisciplinary residency.", "/seed/community-06.jpg", 3]);
  for (const [slug,name,dates] of [["zariya","Zariya - Connecting Creators","24 Oct 2026"],["drishti-new-years-retreat","Drishti - New Years retreat","29 Dec 2026 - 1 Jan 2027"]]) await pg.query("INSERT INTO events (slug,name,kind,date_label,description,image_url,sort) VALUES ($1,$2,'retreat',$3,'A gathering at Vinyasa Earth.','/seed/grounds-05.jpg',5)",[slug,name,dates]);
  await pg.close();
  await cp(".next", path.join(folder, ".next"), { recursive: true, filter: source => !source.split(path.sep).includes("cache") });
  await cp("package.json", path.join(folder, "package.json"));
  await cp("next.config.mjs", path.join(folder, "next.config.mjs"));
  await symlink(path.resolve("node_modules"), path.join(folder, "node_modules"), "junction");
  await symlink(path.resolve("public"), path.join(folder, "public"), "junction");
  server = spawn(process.execPath, [path.resolve("node_modules/next/dist/bin/next"), "start", "-p", "3197"], { cwd: folder, env: { ...process.env, DATABASE_URL: `pglite:${path.join(folder, "db")}`, SESSION_SECRET: "isolated-formatting-test-secret", SMTP_PASSWORD: "", RESEND_API_KEY: "" }, stdio: "pipe" });
  server.stdout.on("data", chunk => output += chunk);
  server.stderr.on("data", chunk => output += chunk);
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw Error(output.slice(-2000));
    try { if ((await fetch(base + "/admin/login")).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, "isolated server starts");
  browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const { artistInResidence } = await import("../src/lib/editorial/defaults/artist-in-residence.ts");
  const { parseDocument } = require("htmlparser2");
  const { textContent } = require("domutils");
  const normalise = text => text.replace(/\s+/g, " ").trim();
  const response = await page.goto(base + "/events/artist-in-residence", { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, "residency is published with its updated active period");
  assert.match(await page.locator("h1").textContent(), /Artist-in-Residence Program.*October/);
  const rendered = normalise(await page.locator("main").last().textContent());
  for (const paragraph of artistInResidence.introduction) assert.ok(rendered.includes(normalise(paragraph)), paragraph);
  for (const section of artistInResidence.sections) {
    await page.getByRole("heading", { name: section.title, exact: true }).waitFor();
    assert.ok(rendered.includes(normalise(textContent(parseDocument(section.bodyHtml)))), section.title + " full content");
  }
  assert.ok(rendered.includes("1 October 2026 - 31 January 2027"));
  assert.equal(await page.locator('section[data-hero] h1, [data-hero] h1').count(), 1);
  await page.screenshot({ path: path.join(folder, "residency-desktop.png") });
  for (const image of await page.locator("main img").all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(image => image.decode()); }
  assert.equal(await page.locator('main img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true, "placeholder images load");
  await page.getByRole("link", { name: "Apply for the residency", exact: false }).first().click();
  await page.locator("#residency-application").screenshot({ path: path.join(folder, "residency-application.png") });
  const form = page.locator("#residency-application form");
  let requests = 0;
  page.on("request", request => { if (request.url().endsWith("/api/leads") && request.method() === "POST") requests++; });
  await form.getByRole("button", { name: "Submit application" }).click();
  assert.equal(await form.getByRole("alert").count(), 7);
  assert.equal(requests, 0, "empty applications are not submitted");
  await form.getByLabel("First Name").fill("Test Artist");
  await form.getByLabel("Phone", { exact: false }).fill("+919876543210");
  await form.getByLabel("Email", { exact: false }).fill("residency-test@example.com");
  await form.getByLabel("Art Practice").selectOption("Photography");
  await form.getByLabel("Portfolio").fill("https://example.com/portfolio");
  await form.getByLabel("Country").selectOption("India");
  await form.getByLabel("Area of Research/Enquiry").fill("A photographic enquiry into community and land.");
  const submitted = page.waitForResponse(response => response.url().endsWith("/api/leads") && response.request().method() === "POST");
  await form.getByRole("button", { name: "Submit application" }).click();
  const saved = await submitted; assert.equal(saved.status(), 200);
  const { lead } = await saved.json();
  assert.equal(lead.source, "artist-residence");
  for (const value of ["Photography", "https://example.com/portfolio", "India", "A photographic enquiry into community and land."]) assert.ok(lead.message.includes(value), value);
  await page.getByRole("heading", { name: "Thank you for applying." }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/events/artist-in-residence", { waitUntil: "networkidle" });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no mobile horizontal overflow");
  await page.screenshot({ path: path.join(folder, "residency-mobile.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#residency-application").screenshot({ path: path.join(folder, "residency-application-mobile.png"), animations: "disabled" });
  console.log("PASS: complete residency content, mobile layout and application submission");
  const login = await context.request.post(base + "/api/admin/login", { data: { email: "formatting-test@example.com", password: "test-only-password" } }); assert.equal(login.status(), 200);
  const entries = await context.request.get(base + "/api/leads"); const body = await entries.json(); assert.ok(body.leads.some(entry => entry.id === lead.id), "application appears in admin enquiries");
  await page.goto(base + "/events");
  await page.locator('a[href="/events/artist-in-residence"]').first().waitFor({state:"attached"});
  await page.locator('a[href="/events/artist-unite"]').first().waitFor({state:"attached"});
  await page.goto(base + "/events/artist-unite");
  assert.match(await page.locator("h1").textContent(), /Artist Unite/);
  assert.equal(await page.locator("#residency-application").count(), 0, "Artist Unite keeps its separate content");
  const { artistUnite } = await import("../src/lib/editorial/defaults/artist-unite.ts");
  const uniteText = normalise(await page.locator("main").last().textContent());
  assert.ok(uniteText.includes(normalise(textContent(parseDocument(artistUnite.introductionHtml)))));
  for (const section of artistUnite.sections) assert.ok(uniteText.includes(normalise(textContent(parseDocument(section.bodyHtml)))), section.title);
  const uniteForm = page.locator("#artist-unite-application form");
  await uniteForm.getByRole("button", {name:"Initiate application"}).click();
  assert.equal(await uniteForm.getByRole("alert").count(), 6);
  await uniteForm.getByLabel("First Name").fill("Unite");
  await uniteForm.getByLabel("Last Name").fill("Artist");
  await uniteForm.getByLabel("Email", {exact:false}).fill("unite-test@example.com");
  await uniteForm.getByLabel("Phone", {exact:false}).fill("+919876543210");
  await uniteForm.getByLabel("Artform").fill("Theatre");
  await uniteForm.getByLabel("Portfolio / URL").fill("https://example.com/theatre");
  const uniteSubmitted = page.waitForResponse(response => response.url().endsWith("/api/leads") && response.request().method() === "POST");
  await uniteForm.getByRole("button", {name:"Initiate application"}).click();
  const uniteResponse = await uniteSubmitted; assert.equal(uniteResponse.status(), 200);
  const uniteLead = (await uniteResponse.json()).lead; assert.equal(uniteLead.source, "artist-unite"); assert.equal(uniteLead.name, "Unite Artist"); assert.ok(uniteLead.message.includes("Theatre"));
  await page.goto(base + "/events/artist-unite", {waitUntil:"networkidle"});
  await page.emulateMedia({reducedMotion:"reduce"});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({path:path.join(folder,"artist-unite-mobile.png")});
  await page.locator("#artist-unite-application").screenshot({path:path.join(folder,"artist-unite-application-mobile.png"),animations:"disabled"});
  console.log("PASS: full Artist Unite content, schedule, six required fields, separate application and mobile layout");

  const { seasonalEvents } = await import("../src/lib/editorial/defaults/seasonal-events.ts");
  for (const [slug, event] of Object.entries(seasonalEvents)) {

    const response = await page.goto(base + "/events/" + slug, {waitUntil:"networkidle"});
    assert.equal(response.status(),200);
    assert.ok(await page.locator("h1").isVisible());
    for (const section of event.sections) assert.ok((await page.locator("main").last().innerText()).includes(section.title));
    if (slug === "become-your-own-muse") { assert.equal(await page.locator('main a[href^="https://rzp.io/"]').count(),3); assert.ok((await page.locator("main").last().innerText()).includes("Anangsha Alammyan")); }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({path:path.join(folder,slug+"-mobile.png"),fullPage:true});
  }
  console.log("PASS: Muse automatically added, all sections, host biographies, reservation links and mobile layout");
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base + "/admin/events");
  assert.equal(await page.locator("tbody tr").count(), 5, "all five events including Muse are separate admin events");
  assert.match(await page.locator("tbody tr").first().textContent(), /Artist-in-Residence Program.*October/);
  await page.goto(base + "/admin/pages/site/event-template");
  const contentField = page.locator('input[name="Content.ARTIST_IN_RESIDENCE.sections / 1.bodyHtml"]'); await contentField.waitFor({state:"attached"});
  await contentField.locator("..").locator(".ProseMirror").waitFor();
  await page.getByRole("button", {name:"Save content",exact:true}).click(); await page.getByRole("status").filter({hasText:"Saved."}).waitFor();
  assert.deepEqual(errors, []);
  console.log("PASS: all residency content, existing hero, placeholder images, desktop/mobile layouts, form validation, submission, admin entry and content editing");
  console.log("Browser artifacts: " + folder);
} catch (error) { await writeFile(path.join(folder, "server.log"), output); console.error("Browser test artifacts: " + folder); throw error; }
finally { await browser?.close(); server?.kill(); }
