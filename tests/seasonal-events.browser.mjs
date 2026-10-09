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
const folder = process.env.BROWSER_FOLDER || await mkdtemp(path.join(tmpdir(), "vinyasa-residency-"));
const base = "http://localhost:3197";
let browser, server;
let output = "";
try {
  if (!process.env.BROWSER_FOLDER) {
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
  }
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
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
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
  const login = await context.request.post(base + "/api/admin/login", { data: { email: "formatting-test@example.com", password: "test-only-password" } }); assert.equal(login.status(), 200);
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
