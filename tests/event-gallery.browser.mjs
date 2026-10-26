import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base=process.env.EVENT_TEST_BASE || "http://localhost:3000";
const folder=await mkdtemp(path.join(tmpdir(),"vinyasa-event-gallery-"));
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true});
 const page=await context.newPage();page.setDefaultTimeout(60000);await page.emulateMedia({reducedMotion:"reduce"});
 await context.request.post(base+"/api/track",{data:{},timeout:120000});
 await context.request.get(base+"/events/become-your-own-muse",{timeout:120000});
 const errors=[];page.on("pageerror",error=>errors.push(error.message));
 for(const slug of ["become-your-own-muse","artist-in-residence","drishti-new-years-retreat"]){
  await page.goto(base+"/events/"+slug,{waitUntil:"networkidle",timeout:120000});
  const gallery=page.locator("#event-gallery");
  await gallery.waitFor();
  const count=await gallery.getByRole("button",{name:/Open photo/}).count();
  assert(count>=1);
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});
   await page.getByRole("navigation",{name:"Event page sections"}).getByRole("link",{name:"Gallery",exact:true}).click();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"no overflow at "+width);
   if(count>1){
    const next=gallery.getByRole("button",{name:"Next gallery photo",exact:true});
    const prev=gallery.getByRole("button",{name:"Previous gallery photo",exact:true});
    while(await prev.isEnabled()){await prev.click();await page.waitForTimeout(60);}
    assert(await prev.isDisabled());
    await next.click();
    await page.waitForFunction(()=>Number(document.querySelector("#event-gallery").dataset.galleryIndex)>0);
    await prev.click();
    await page.waitForFunction(()=>document.querySelector("#event-gallery").dataset.galleryIndex==="0");
    await gallery.locator("#event-gallery-photos").focus();await page.keyboard.press("ArrowRight");
    await page.waitForFunction(()=>Number(document.querySelector("#event-gallery").dataset.galleryIndex)>0);
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(()=>document.querySelector("#event-gallery").dataset.galleryIndex==="0");
   }
   await gallery.getByRole("button",{name:"Open photo 1 fullscreen",exact:true}).click();
   await page.getByRole("button",{name:"Close",exact:true}).waitFor();
   await page.keyboard.press("Escape");
   await page.getByRole("button",{name:"Close",exact:true}).waitFor({state:"hidden"});
   assert(await gallery.getByRole("button",{name:"Open photo 1 fullscreen",exact:true}).evaluate(element=>element===document.activeElement),"lightbox restores focus");
   await page.evaluate(()=>{const bounds=document.getElementById("event-gallery").getBoundingClientRect();scrollBy(0,bounds.top-150);});
   await page.screenshot({path:path.join(folder,slug+"-"+width+".png")});
  }
  console.log("PASS "+slug+": gallery, controls, keyboard, fullscreen and 320–1440px layouts");
 }
 await page.setViewportSize({width:390,height:844});
 const gallery=page.locator("#event-gallery");
 await page.getByRole("navigation",{name:"Event page sections"}).getByRole("link",{name:"Gallery",exact:true}).click();
 const viewport=gallery.locator("#event-gallery-photos");
 await viewport.scrollIntoViewIfNeeded();
 const bounds=await viewport.boundingBox();
 const cdp=await context.newCDPSession(page);
 const y=Math.round(bounds.y+bounds.height/2),startX=Math.round(bounds.x+bounds.width*.85);
 await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:startX,y}]});
 for(let i=1;i<=8;i++){await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:Math.round(startX-i*bounds.width*.075),y}]});await page.waitForTimeout(20);}
 await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
 await page.waitForFunction(()=>Number(document.querySelector("#event-gallery").dataset.galleryIndex)>0);
 console.log("PASS native phone touch swipe moves the carousel");
 assert.deepEqual(errors,[]);
 console.log("Screenshots: "+folder);
}finally{await browser.close();}
