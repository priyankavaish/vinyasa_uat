import assert from "node:assert/strict";
import { mkdtemp, cp, symlink, writeFile, unlink, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import bcrypt from "bcryptjs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const folder = process.env.EVENT_TEST_FOLDER || await mkdtemp(path.join(tmpdir(), "vinyasa-new-event-"));
assert(path.resolve(folder).startsWith(path.resolve(tmpdir()) + path.sep) && path.basename(folder).startsWith("vinyasa-new-event-"), "test database must stay in its isolated temporary directory");
const base = "http://localhost:3198";
let server, browser, page, output = "";
try {
  if (process.env.EVENT_TEST_EXTERNAL !== "1") {
  const database = new PGlite(path.join(folder, "db"));
  await migrate(drizzle(database), { migrationsFolder: "./drizzle" });
  if (process.env.EVENT_TEST_FOLDER) {
    await database.query("DELETE FROM events WHERE slug = 'dynamic-creative-workshop'");
    await database.query("DELETE FROM site_content WHERE key IN ('event-hosts:dynamic-creative-workshop', 'event-hosts:become-your-own-muse', 'event-gallery:dynamic-creative-workshop')");
  }
  await database.query("INSERT INTO admin_users (email,password_hash) VALUES ($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash", ["event-test@example.com", await bcrypt.hash("test-only-event-password", 4)]);
  await database.close();
  for (const file of ["src", "package.json", "next.config.mjs", "postcss.config.mjs", "tsconfig.json", "next-env.d.ts"]) await cp(file, path.join(folder, file), { recursive: true });
  if (!existsSync(path.join(folder, "node_modules"))) await symlink(path.resolve("node_modules"), path.join(folder, "node_modules"), "junction");
  if (!existsSync(path.join(folder, "public"))) await symlink(path.resolve("public"), path.join(folder, "public"), "junction");
  await unlink(path.join(folder, "src/app/api/test-event-state/route.ts")).catch(error => { if (error.code !== "ENOENT") throw error; });
  server = spawn(process.execPath, [path.resolve("node_modules/next/dist/bin/next"), "dev", "-p", "3198"], { cwd: folder, env: { ...process.env, DATABASE_URL: "pglite:" + path.join(folder, "db"), SESSION_SECRET: "isolated-event-template-test-secret", BLOB_READ_WRITE_TOKEN: "", SMTP_PASSWORD: "", RESEND_API_KEY: "" }, stdio: "pipe", windowsHide: true });
  server.stdout.on("data", chunk => output += chunk);
  server.stderr.on("data", chunk => output += chunk);
  console.log("Isolated event test: " + folder);
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (server.exitCode !== null) throw Error(output.slice(-3000));
    try { if ((await fetch(base + "/admin/login", { signal: AbortSignal.timeout(5000) })).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert(ready, "isolated server starts");
  }
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const login = await context.request.post(base + "/api/admin/login", { data: { email: "event-test@example.com", password: "test-only-event-password" } });
  assert.equal(login.status(), 200);
  // Compile the upload/media routes before opening the editor: dev Fast Refresh
  // can replace an active form while a new route is first compiled.
  const upload = await context.request.post(base + "/api/admin/upload", { multipart: { file: { name: "event-test.jpg", mimeType: "image/jpeg", buffer: await readFile("public/seed/community-05.jpg") } } });
  assert.equal(upload.status(), 200);
  const uploadedImage = (await upload.json()).url;
  assert((await context.request.get(base + uploadedImage)).ok());
  page = await context.newPage();
  page.on("pageerror", error => console.error("Browser error:", error.message));
  page.on("request", request => { if (request.method() === "POST") console.log("POST " + new URL(request.url()).pathname); });
  page.setDefaultTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + "/admin/events/new", { waitUntil: "networkidle", timeout: 120000 });
  await page.locator('input[name="name"]').fill("Dynamic Creative Workshop");
  await page.locator('select[name="kind"]').selectOption("workshop");
  await page.locator('input[name="dateLabel"]').fill("31 Dec 2099");
  await page.locator('input[name="durationLabel"]').fill("One day");
  await page.locator('input[name="facilitator"]').fill("Vinyasa workshop host");
  await page.locator('input[name="priceFrom"]').fill("1800");
  await page.locator('textarea[name="description"]').fill("A newly created workshop using the same event page design.");
  await page.locator('input[name="paymentLabel"]').fill("Reserve workshop");
  await page.locator('input[name="paymentUrl"]').fill("https://rzp.io/rzp/dynamic-event-test");
  await page.getByPlaceholder(/paste an image URL/).first().fill(uploadedImage);
  await page.getByPlaceholder(/paste an image URL/).first().blur();
  await page.waitForFunction(() => document.querySelector('input[name="imageUrl"]').value.startsWith("/media/"));
  const galleryEditor = page.locator("[data-event-gallery-editor]");
  await galleryEditor.locator('input[type="file"]').setInputFiles([
    {name:"portrait.jpg",mimeType:"image/jpeg",buffer:await readFile("public/seed/community-05.jpg")},
    {name:"landscape.jpg",mimeType:"image/jpeg",buffer:await readFile("public/seed/grounds-04.jpg")},
  ]);
  await page.waitForFunction(() => document.querySelector('input[name="eventGallery"]').value.split("\n").filter(Boolean).length === 2);
  await page.getByRole("combobox", { name: "Section heading", exact: true }).selectOption("Artist");
  await page.getByRole("button", { name: "Add host / artist", exact: true }).click();
  const firstHost = page.locator("[data-host-editor]").nth(0);
  await firstHost.getByRole("textbox", { name: "Name", exact: true }).fill("Workshop Artist");
  await firstHost.getByRole("textbox", { name: "Role (optional)", exact: true }).fill("Visual artist");
  await firstHost.getByRole("textbox", { name: "About this person (optional)", exact: true }).fill("An artist who brings people together through creative practice.");
  await firstHost.getByPlaceholder(/paste an image URL/).fill("/images/events/hosts/shreya-dalela.png");
  await firstHost.getByRole("button", { name: "Add social profile", exact: true }).click();
  await firstHost.getByRole("textbox", { name: "Profile URL", exact: true }).fill("https://www.instagram.com/workshop.artist/");
  await firstHost.getByRole("button", { name: "Add social profile", exact: true }).click();
  await firstHost.getByRole("textbox", { name: "Profile name", exact: true }).nth(1).fill("Website");
  await firstHost.getByRole("textbox", { name: "Profile URL", exact: true }).nth(1).fill("https://example.com/artist");
  await page.getByRole("button", { name: "Add host / artist", exact: true }).click();
  const secondHost = page.locator("[data-host-editor]").nth(1);
  await secondHost.getByRole("textbox", { name: "Name", exact: true }).fill("Guest Facilitator");
  await secondHost.getByRole("button", { name: "Move up", exact: true }).click();
  assert.equal(await page.locator("[data-host-editor]").first().getByRole("textbox", { name: "Name", exact: true }).inputValue(), "Guest Facilitator");
  const editor = page.locator(".ProseMirror").first();
  await editor.fill("Create, explore and learn together at Vinyasa Earth.");
  await editor.press("End"); await editor.press("Enter");
  await page.getByTitle("Heading 2", { exact: true }).click();
  await page.keyboard.insertText("What you will do"); await page.keyboard.press("Enter");
  await page.keyboard.insertText("A guided creative session with all materials included."); await page.keyboard.press("Enter");
  await page.getByTitle("Heading 2", { exact: true }).click();
  await page.keyboard.insertText("Before you arrive"); await page.keyboard.press("Enter");
  await page.keyboard.insertText("Bring a notebook and arrive fifteen minutes early.");
  await page.waitForFunction(() => document.querySelector('input[name="bodyHtml"]').value.includes("<h2>"));
  assert.equal(await page.locator('input[name="slug"]').inputValue(), "", "slug is generated from the name");
  const invalidFields = await page.locator("input:invalid,select:invalid,textarea:invalid").evaluateAll(elements => elements.map(element => ({ name: element.name, value: element.value, message: element.validationMessage })));
  assert.deepEqual(invalidFields, [], "new event form is valid before saving");
  console.log("Submitting event", await page.getByRole("button", { name: "Save event", exact: true }).evaluate(button => ({valid:button.form.checkValidity(),action:button.form.getAttribute("action"),method:button.form.method})));
  await page.getByRole("button", { name: "Save event", exact: true }).click();
  await page.waitForURL(base + "/admin/events", { timeout: 120000 });
  const eventPath = "/events/dynamic-creative-workshop";
  console.log("PASS admin creates a published event, uploads its image and generates its slug");
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const response = await page.goto(base + eventPath, { waitUntil: "networkidle", timeout: 120000 });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").innerText(), "Dynamic Creative Workshop");
    assert.equal(await page.getByRole("heading", { name: "About the event", exact: true }).count(), 1);
    assert.equal(await page.locator("#event-overview details").count(), 2);
    const gallery = page.locator("#event-gallery");
    assert.equal(await gallery.getByRole("button", {name:/Open photo/}).count(),2,"custom event gallery persists");
    assert(await gallery.getByRole("heading", {name:"Inside the experience",exact:true}).isVisible());
    assert.equal(await gallery.locator("img:not([aria-hidden])").first().evaluate(image=>getComputedStyle(image).objectFit),"contain","portrait and landscape uploads are shown without cropping");
    const hosts = page.locator("#event-hosts");
    assert.equal(await hosts.getByRole("heading", { name: "Artist", exact: true }).count(), 1);
    assert.equal(await hosts.locator("[data-host-name]").count(), 2);
    assert.equal(await hosts.locator("[data-host-name]").first().getAttribute("data-host-name"), "Guest Facilitator");
    assert.equal(await hosts.getByRole("link", { name: "View Profile: Workshop Artist (Instagram)" }).getAttribute("href"), "https://www.instagram.com/workshop.artist/");
    assert.equal(await hosts.getByRole("link", { name: "View Profile: Workshop Artist (Website)" }).getAttribute("href"), "https://example.com/artist");
    assert(await hosts.getByText("An artist who brings people together through creative practice.", { exact: true }).isVisible());
    await hosts.locator("img").evaluate(element => element.decode());
    assert.equal(await hosts.locator("article").first().evaluate(element => getComputedStyle(element).borderRadius), "0px");
    assert.equal(await hosts.locator("img").evaluate(element => Math.abs(element.getBoundingClientRect().width / element.getBoundingClientRect().height - element.naturalWidth / element.naturalHeight) < .01), true);
    await hosts.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(folder, "hosts-" + width + ".png") });
    const programme = page.locator("#event-programme");
    await page.waitForFunction(expected => document.getElementById("event-programme").open === expected, width >= 768);
    assert.equal(await programme.evaluate(element => element.open), width >= 768);
    if (width < 768) await programme.locator("summary").click();
    assert(await programme.getByText("A guided creative session with all materials included.", { exact: true }).isVisible());
    assert(await programme.locator(".rich").evaluate(element => parseFloat(getComputedStyle(element).fontSize) >= 16));
    const rail = page.getByRole("complementary", { name: "Event booking details" });
    const bar = page.getByRole("region", { name: "Quick event booking" });
    const booking = width >= 1024 ? rail : bar;
    assert.equal(await booking.getByRole("link", { name: /Reserve workshop/ }).getAttribute("href"), "https://rzp.io/rzp/dynamic-event-test");
    assert.equal(await programme.evaluate(element => getComputedStyle(element).borderRadius), "0px");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    if (width < 768) {
      await page.getByRole("navigation", { name: "Event page sections" }).getByRole("link", { name: "Programme", exact: true }).click();
      assert(await programme.evaluate(element => element.open));
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(folder, "new-event-" + width + ".png"), fullPage: false });
    console.log("PASS new event " + width + "px: shared layout, dynamic content, larger text and booking settings");
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/admin/events", { waitUntil: "networkidle" });
  const row = page.locator("tr").filter({ hasText: "Dynamic Creative Workshop" });
  await row.getByRole("link", { name: "Dynamic Creative Workshop", exact: true }).click();
  await page.locator("[data-host-editor]").first().waitFor();
  assert.equal(await page.locator("[data-host-editor]").count(), 2, "saved people reload into admin");
  assert.equal(await page.getByRole("combobox", { name: "Section heading", exact: true }).inputValue(), "Artist", "heading selection persists");
  assert.equal((await page.locator('input[name="eventGallery"]').inputValue()).split("\n").filter(Boolean).length,2,"saved gallery reloads in admin");
  await page.locator('input[name="eventGalleryEnabled"]').uncheck();
  await page.getByRole("button", { name: "Remove host 1", exact: true }).click();
  await page.getByRole("button", { name: "Remove host 1", exact: true }).click();
  await page.locator('input[name="name"]').fill("Updated Creative Workshop");
  await page.locator('input[name="priceFrom"]').fill("2400");
  await page.locator('input[name="dateLabel"]').fill("1 Jan 2100");
  await page.locator('textarea[name="description"]').fill("Updated from admin without a new event template.");
  await page.getByRole("button", { name: "Save event", exact: true }).evaluate(button => { if (!button.form.reportValidity()) throw new Error("Event form has invalid fields"); button.form.requestSubmit(button); });
  await page.waitForURL(base + "/admin/events");
  await page.goto(base + eventPath, { waitUntil: "networkidle" });
  assert.equal(await page.locator("h1").innerText(), "Updated Creative Workshop");
  assert.match(await page.getByRole("complementary", { name: "Event booking details" }).innerText(), /2,400/);
  assert(await page.getByText("Updated from admin without a new event template.", { exact: true }).isVisible());
  assert.match(await page.getByRole("complementary", { name: "Event booking details" }).innerText(), /1 Jan 2100/);
  assert.equal(await page.locator("#event-hosts").count(), 0, "removing all people hides the section");
  assert.equal(await page.locator('a[href="#event-hosts"]').count(), 0, "empty section has no navigation link");
  assert.equal(await page.locator("#event-gallery").count(),0,"gallery can be hidden for this event");
  assert.equal(await page.locator('a[href="#event-gallery"]').count(),0,"hidden gallery has no navigation link");
  console.log("PASS event gallery uploads, persists, reloads and can be hidden from admin");
  console.log("PASS hosts and links save, reorder, reload and can all be removed");
  console.log("PASS edits in admin update the same event page, including its date and price");
  await page.goto(base + "/events", { waitUntil: "networkidle" });
  assert(await page.locator('a[href="' + eventPath + '"]').count());
  console.log("PASS new event appears in the events listing");
  await page.goto(base + "/events/become-your-own-muse", { waitUntil: "networkidle" });
  assert.equal(await page.locator("#event-hosts [data-host-name]").count(), 2, "legacy hosts use the common section");
  assert.equal(await page.getByRole("heading", { name: "Your Hosts :", exact: true }).count(), 1, "legacy hosts are not duplicated");
  await page.goto(base + "/admin/events", { waitUntil: "networkidle" });
  const muse = page.locator("tr").filter({ hasText: "Become Your Own Muse" });
  await muse.getByRole("link").first().click();
  await page.locator("[data-host-editor]").first().waitFor();
  assert.equal(await page.locator("[data-host-editor]").count(), 2, "legacy portraits and bios are editable");
  assert.match(await page.locator("[data-host-editor]").first().getByRole("textbox", { name: "About this person (optional)", exact: true }).inputValue(), /writer and dancer/);
  await page.getByRole("button", { name: "Remove host 1", exact: true }).click();
  await page.getByRole("button", { name: "Remove host 1", exact: true }).click();
  await page.getByRole("button", { name: "Save event", exact: true }).evaluate(button => { if (!button.form.reportValidity()) throw new Error("Event form has invalid fields"); button.form.requestSubmit(button); });
  await page.waitForURL(base + "/admin/events");
  await page.goto(base + "/events/become-your-own-muse", { waitUntil: "networkidle" });
  assert.equal(await page.locator("#event-hosts").count(), 0, "explicit empty list suppresses original host defaults");
  console.log("PASS existing event hosts stay editable and optional without duplicate sections");
  console.log("Browser artifacts: " + folder);
} catch (error) {
  await page?.screenshot({ path: path.join(folder, "failure.png"), fullPage: true }).catch(() => {});
  if (page) console.error("Failure URL:", page.url());
  await writeFile(path.join(folder, "server.log"), output);
  console.error("Browser artifacts: " + folder);
  throw error;
} finally {
  await browser?.close();
  if (server?.pid && server.exitCode === null) {
    if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
    else server.kill();
  }
}
