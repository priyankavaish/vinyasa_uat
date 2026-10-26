import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base=process.env.EVENT_TEST_BASE || "http://localhost:3000";
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true,reducedMotion:"no-preference"});
 await context.request.post(base+"/api/track",{data:{},timeout:120000});
 await context.request.get(base+"/events/become-your-own-muse",{timeout:120000});
 const page=await context.newPage();page.setDefaultTimeout(60000);
 const errors=[];page.on("pageerror",error=>errors.push(error.message));
 await page.goto(base+"/events/become-your-own-muse",{waitUntil:"networkidle",timeout:120000});
 const gallery=page.locator("#event-gallery");
 const index=()=>gallery.getAttribute("data-gallery-index");
 const leave=async()=>{await page.mouse.move(2,150);await page.evaluate(()=>document.activeElement?.blur());};
 const changed=async previous=>page.waitForFunction(previous=>document.querySelector("#event-gallery").dataset.galleryIndex!==previous,previous,{timeout:7000});
 await page.getByRole("navigation",{name:"Event page sections"}).getByRole("link",{name:"Gallery",exact:true}).click();await leave();
 let before=await index();await changed(before);
 console.log("PASS desktop advances automatically without interaction");

 const next=gallery.getByRole("button",{name:"Next gallery photo",exact:true});
 while(await next.isEnabled()){await next.click();await page.waitForTimeout(100);}
 assert.equal(await index(),String(await gallery.getByRole("button",{name:/Open photo/}).count()-1));
 await leave();
 await page.waitForFunction(()=>document.querySelector("#event-gallery").dataset.galleryIndex==="0",null,{timeout:7000});
 console.log("PASS autoplay returns from the last photo to the first");

 await gallery.getByRole("button",{name:"Pause gallery slideshow",exact:true}).click();await leave();
 before=await index();await page.waitForTimeout(4500);assert.equal(await index(),before);
 await gallery.getByRole("button",{name:"Play gallery slideshow",exact:true}).click();await leave();
 before=await index();await changed(before);
 console.log("PASS Pause stays paused and Play resumes");

 await gallery.getByRole("heading").hover();
 before=await index();await page.waitForTimeout(4500);assert.equal(await index(),before);
 await leave();await changed(before);
 console.log("PASS hover pauses movement and leaving resumes");

 await gallery.getByRole("button",{name:"Open photo 1 fullscreen",exact:true}).click();
 await page.getByRole("button",{name:"Close",exact:true}).waitFor();
 before=await index();await page.waitForTimeout(4500);assert.equal(await index(),before);
 await page.keyboard.press("Escape");await page.getByRole("button",{name:"Close",exact:true}).waitFor({state:"hidden"});
 await page.waitForFunction(()=>document.activeElement===document.querySelector('button[aria-label="Open photo 1 fullscreen"]'));
 await leave();before=await index();await changed(before);
 console.log("PASS fullscreen pauses the background gallery and closing allows playback");

 await page.setViewportSize({width:390,height:844});
 await gallery.scrollIntoViewIfNeeded();await leave();
 before=await index();await changed(before);
 await page.setViewportSize({width:320,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 console.log("PASS phone autoplay and compact playback controls");

 await page.emulateMedia({reducedMotion:"reduce"});await leave();
 await gallery.getByRole("button",{name:"Play gallery slideshow",exact:true}).waitFor();
 before=await index();await page.waitForTimeout(4500);assert.equal(await index(),before);
 await gallery.getByRole("button",{name:"Play gallery slideshow",exact:true}).click();await leave();
 before=await index();await changed(before);
 console.log("PASS reduced-motion pauses autoplay until the user explicitly chooses Play");
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
