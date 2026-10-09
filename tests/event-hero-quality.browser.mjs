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
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
   await page.setViewportSize(viewport);await page.goto(base+'/events/artist-unite',{waitUntil:'networkidle'});
   const hero=page.locator('[data-hero]');const image=hero.locator('img');await image.evaluate(img=>img.decode());
   assert.ok((await image.getAttribute('src')).includes('q=95'),'hero uses high-quality encoding');
   const geometry=await hero.evaluate(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,fit:getComputedStyle(el.querySelector('img')).objectFit,imgW:el.querySelector('img').getBoundingClientRect().width}));
   assert.equal(Math.round(geometry.w),viewport.width===1440?1120:366);assert.equal(Math.round(geometry.h),viewport.height-(viewport.width===1440?176:148));assert.equal(geometry.fit,'cover');assert.equal(Math.round(geometry.imgW),Math.round(geometry.w),'image is not unnecessarily zoomed');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:path.join(folder,'hero-quality-'+viewport.width+'.png')});
  }
  const ts=require('typescript');const source=ts.transpileModule(await (await import('node:fs/promises')).readFile('src/lib/image-compress.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext}}).outputText.replace('export async function','async function');
  const compression=await page.evaluate(async source=>{
    const compress=new Function(source+';return compressImage;')();
    const small=new File([new Uint8Array(2*1024*1024)],'original.jpg',{type:'image/jpeg'});const untouched=await compress(small);
    const canvas=document.createElement('canvas');canvas.width=4000;canvas.height=2000;const ctx=canvas.getContext('2d');const pixels=ctx.createImageData(canvas.width,canvas.height);for(let i=0;i<pixels.data.length;i+=65536)crypto.getRandomValues(pixels.data.subarray(i,Math.min(pixels.data.length,i+65536)));for(let i=3;i<pixels.data.length;i+=4)pixels.data[i]=255;ctx.putImageData(pixels,0,0);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));const compressed=await compress(new File([blob],'large.png',{type:'image/png'}));const bitmap=await createImageBitmap(compressed);return {same:untouched===small,bytes:compressed.size,width:bitmap.width,height:bitmap.height};
  },source);
  assert.ok(compression.same,'normal-sized originals are preserved');assert.ok(compression.bytes<=3.5*1024*1024,'large uploads fit the request limit');assert.ok(compression.width<=3200);assert.ok(Math.abs(compression.width/compression.height-2)<0.01,'compression preserves image ratio');
  assert.deepEqual(errors,[]);console.log('PASS: hero dimensions and cover layout unchanged, quality 95, extra zoom removed, responsive desktop/mobile and upload compression preserve quality and ratio');
  console.log("Browser artifacts: " + folder);
} catch (error) { await writeFile(path.join(folder, "server.log"), output); console.error("Browser test artifacts: " + folder); throw error; }
finally { await browser?.close(); server?.kill(); }
