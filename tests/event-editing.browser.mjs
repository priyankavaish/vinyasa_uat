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
  await pg.query("INSERT INTO site_content (key,value) VALUES ($1,$2)",["editorial:app/(site)/events/[slug]/page",JSON.stringify({SEASONAL_EVENTS:{zariya:{heading:"Saved Zariya heading"},"become-your-own-muse":{heading:"Saved Muse heading"}}})]);
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
  const login=await context.request.post(base+"/api/admin/login",{data:{email:"formatting-test@example.com",password:"test-only-password"}}); assert.equal(login.status(),200);
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto(base+"/admin/events");
  const residenceLink=page.locator('tbody tr').filter({hasText:"Artist-in-Residence Program"}).locator('a').first();
  const editUrl=await residenceLink.getAttribute('href'); await residenceLink.click();
  await page.getByRole('heading',{name:'Event page content',exact:true}).waitFor();
  const title=page.locator('input[name="Content.sections / 1.title"]').locator('..').locator('textarea');
  await title.fill('A practice with room to grow');
  const sectionImage=page.locator('section').filter({has:page.getByRole('heading',{name:'Event page content',exact:true})}).getByRole('slider',{name:'Image width'}).first();
  await sectionImage.press('Home'); for(let i=0;i<35;i++) await sectionImage.press('ArrowRight');
  const corner=page.getByRole('slider',{name:'Resize section image'}).first();
  await corner.scrollIntoViewIfNeeded();const box=await corner.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x-55,box.y+box.height/2,{steps:6});await page.mouse.up();
  const value=JSON.parse(await page.locator('input[name="eventDetails"]').inputValue());assert.ok(value.sections[0].imageWidth<55,'drag reduces image width');
  await page.route('**/api/admin/upload',route=>route.fulfill({json:{url:'/images/amer-fort-portrait.jpg'}}));
  const fields=page.locator('section').filter({has:page.getByRole('heading',{name:'Event page content',exact:true})});
  await fields.locator('input[type="file"]').first().setInputFiles(path.resolve('public/images/amer-fort-portrait.jpg'));
  await page.waitForFunction(()=>JSON.parse(document.querySelector('input[name="eventDetails"]').value).sections[0].image==='/images/amer-fort-portrait.jpg');
  const richParent=page.locator('input[name="Content.sections / 1.bodyHtml"]').locator('..');
  const rich=richParent.locator('.ProseMirror');await rich.waitFor();await rich.click();await page.keyboard.press('Control+End');
  let prompt=0;page.on('dialog',dialog=>dialog.accept(prompt++===0?'Apply now':'#residency-application'));
  await richParent.getByTitle('Insert theme button',{exact:true}).click();
  assert.ok(JSON.parse(await page.locator('input[name="eventDetails"]').inputValue()).sections[0].bodyHtml.includes('data-btn="true"'));
  const chooserPromise=page.waitForEvent('filechooser');await richParent.getByTitle('Insert image',{exact:true}).click();const chooser=await chooserPromise;await chooser.setFiles(path.resolve('public/images/amer-fort-portrait.jpg'));
  const handle=rich.locator('[data-resize-handle]').first();await handle.waitFor();await handle.scrollIntoViewIfNeeded();const hb=await handle.boundingBox();await page.mouse.move(hb.x+5,hb.y+5);await page.mouse.down();await page.mouse.move(hb.x-60,hb.y-60,{steps:6});await page.mouse.up();
  await page.getByRole('button',{name:'Save event',exact:true}).click();await page.waitForURL(base+'/admin/events');
  await page.goto(base+editUrl);assert.equal(await page.locator('input[name="Content.sections / 1.title"]').inputValue(),'A practice with room to grow');
  const saved=JSON.parse(await page.locator('input[name="eventDetails"]').inputValue());assert.equal(saved.sections[0].image,'/images/amer-fort-portrait.jpg');assert.match(saved.sections[0].bodyHtml,/width="[0-9]+"/);
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
    await page.setViewportSize(viewport);await page.goto(base+'/events/artist-in-residence',{waitUntil:'networkidle'});
    assert.ok(await page.getByRole('heading',{name:'A practice with room to grow',exact:true}).isVisible());
    const image=page.locator('article figure img').first();await image.waitFor();await image.evaluate(img=>img.decode());
    const ratio=await image.evaluate(img=>({natural:img.naturalWidth/img.naturalHeight,visible:img.getBoundingClientRect().width/img.getBoundingClientRect().height}));assert.ok(Math.abs(ratio.natural-ratio.visible)<0.02,'uploaded image preserves its ratio');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page fits viewport');
    const apply=page.locator('article .rich a[href="#residency-application"]').first();assert.equal(await apply.getAttribute('data-btn'),'true');assert.equal(await apply.evaluate(el=>getComputedStyle(el).textDecorationLine),'none');
    await page.screenshot({path:path.join(folder,'event-editor-'+viewport.width+'.png'),fullPage:true});
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/admin/events');
  for(const name of ['Zariya','Drishti','Become Your Own Muse']) {await page.locator('tbody tr').filter({hasText:name}).locator('a').first().click();await page.getByRole('heading',{name:'Event page content',exact:true}).waitFor();assert.ok(await page.locator('input[name="eventDetails"]').inputValue());await page.goto(base+'/admin/events');}
  await page.locator('tbody tr').filter({hasText:'Zariya'}).locator('a').first().click();
  assert.equal(await page.locator('input[name="Content.heading"]').inputValue(),'Saved Zariya heading','saving residency preserves other event overrides');
  await page.locator('input[name="Content.heading"]').locator('..').locator('textarea').fill('Zariya edited within Events');
  await page.getByRole('button',{name:'Save event',exact:true}).click();await page.waitForURL(base+'/admin/events');
  await page.locator('tbody tr').filter({hasText:'Become Your Own Muse'}).locator('a').first().click();assert.equal(await page.locator('input[name="Content.heading"]').inputValue(),'Saved Muse heading','saving one seasonal event preserves its siblings');
  await page.goto(base+'/events/zariya');assert.ok(await page.getByRole('heading',{name:'Zariya edited within Events',exact:true}).isVisible());
  assert.deepEqual(errors,[]);
  console.log('PASS: event details edited and saved within Events, section upload and drag resizing, rich image resizing and theme buttons persist, portrait ratio and desktop/mobile responsiveness preserved');
  console.log("Browser artifacts: " + folder);
} catch (error) { await writeFile(path.join(folder, "server.log"), output); console.error("Browser test artifacts: " + folder); throw error; }
finally { await browser?.close(); server?.kill(); }
