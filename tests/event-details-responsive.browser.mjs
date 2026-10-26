
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BROWSER_BASE_URL || "http://localhost:3000";
const artifacts = await mkdtemp(path.join(tmpdir(), "vinyasa-event-responsive-"));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
  await page.addInitScript(() => Object.defineProperty(navigator, "share", { value: undefined, configurable: true }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const slug of ["become-your-own-muse", "artist-in-residence", "drishti-new-years-retreat"]) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(base + "/events/" + slug, { waitUntil: "networkidle", timeout: 120000 });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("h1").count(), 1);
      for (const id of ["event-overview", "event-programme", "event-registration"]) {
        assert.equal(await page.locator("#" + id).count(), 1, slug + " has unique " + id);
      }
      const hero = page.locator("header").filter({ has: page.locator("h1") });
      const image = hero.locator("img");
      await image.evaluate(element => element.decode());
      const titleBox = await page.locator("h1").boundingBox();
      const imageBox = await image.boundingBox();
      assert(imageBox.y + imageBox.height < titleBox.y, "event banner comes before title");
      const bookingBar = page.getByRole("region", { name: "Quick event booking" });
      const bookingRail = page.getByRole("complementary", { name: "Event booking details" });
      assert.equal(await bookingBar.isVisible(), width < 1024, "mobile booking bar switches by breakpoint");
      const bookingCard = bookingRail.locator(":scope > div").first();
      assert.equal(await bookingCard.isVisible(), width >= 1024, "desktop booking card switches by breakpoint");
      if (width >= 1024) { const card = await bookingRail.boundingBox(); assert(card.x > imageBox.x + imageBox.width, "booking rail is next to banner"); }
      if (slug === "become-your-own-muse") assert.equal(await page.locator('#event-overview a[href^="https://rzp.io/"]').count(), 3);
      const programme = page.locator("#event-programme");
      await page.waitForFunction(expected => document.getElementById("event-programme").open === expected, width >= 768);
      assert.equal(await programme.evaluate(element => element.open), width >= 768, "mobile sections start compact; desktop sections stay expanded");
      assert.equal(await programme.evaluate(element => getComputedStyle(element).borderRadius), "0px", "event cards have square corners");
      const nav = page.getByRole("navigation", { name: "Event page sections" });
      await nav.getByRole("link", { name: "Programme", exact: true }).click();
      await page.waitForTimeout(150);
      assert(await programme.evaluate(element => element.open), "programme navigation opens its section");
      const target = await page.locator("#event-programme").boundingBox();
      const navBox = await nav.boundingBox();
      assert(target.y >= navBox.y + navBox.height - 2, "jump target clears sticky section navigation");
      if (width >= 1024) {
        const card = await bookingCard.boundingBox();
        const hosts = page.locator("#event-hosts");
        if (await hosts.count()) {
          const hostBox = await hosts.boundingBox();
          assert(Math.abs(hostBox.x - card.x) < 2 && hostBox.y >= card.y + card.height, "hosts sit below the booking card in the right column without overlap");
        } else assert(card.y >= 90 && card.y < 110, "desktop booking card sticks while content scrolls");
      }
      else { const bar = await bookingBar.boundingBox(); const chat = await page.locator("[data-whatsapp-button]").boundingBox(); assert(chat.y + chat.height < bar.y, "chat button clears mobile booking bar"); }
      await nav.getByRole("link", { name: /How to join/ }).click();
      await page.waitForTimeout(150);
      const registration = await page.locator("#event-registration").boundingBox();
      assert(registration.y >= 120 && registration.y < 1000, "registration jump is reachable");
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(artifacts, slug + "-" + width + ".png"), fullPage: false });
      console.log("PASS " + slug + " " + width + "px: heading, poster, navigation and registration");
    }
  }
  await page.goto(base + "/events/become-your-own-muse", { waitUntil: "networkidle" });
  const image = page.locator("header").filter({ has: page.locator("h1") }).locator("img");
  for (const [width, height] of [[320,740],[375,812],[390,844],[640,900],[768,1024],[900,800],[1024,768],[1280,800],[1440,1000],[1920,1080],[844,390]]) {
    await page.setViewportSize({ width, height });
    for (const [naturalWidth,naturalHeight] of [[1600,600],[600,1000],[800,800]]) {
      const metrics = await image.evaluate(async (element, dimensions) => {
        const [w,h] = dimensions;
        element.removeAttribute("srcset");
        element.src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><rect width="100%" height="100%" fill="#8f3b31"/></svg>');
        await element.decode();
        const bounds = element.getBoundingClientRect();
        return { ratio: bounds.width / bounds.height, overflow: document.documentElement.scrollWidth > innerWidth + 1, frameHeight: element.parentElement.getBoundingClientRect().height, height: bounds.height, background: getComputedStyle(element.parentElement).backgroundColor };
      }, [naturalWidth, naturalHeight]);
      assert(Math.abs(metrics.ratio - naturalWidth / naturalHeight) < .01, "natural image ratio");
      assert(Math.abs(metrics.frameHeight - metrics.height) < 2, "no forced-height media frame");
      assert.equal(metrics.background, "rgba(0, 0, 0, 0)");
      assert(!metrics.overflow, width + "px no horizontal overflow");
    }
    console.log("PASS " + width + "x" + height + ": portrait, landscape and square uploads");
  }
  await page.setViewportSize({ width: 320, height: 740 });
  await page.locator("h1").evaluate(element => { element.textContent = "A long event title with UnexpectedlyLongUnbrokenWordsForTestingResponsiveUploads"; });
  await page.locator("#event-overview").evaluate(element => { const paragraph = element.querySelector("p"); if (paragraph) paragraph.textContent = "A".repeat(160); });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "long CMS content wraps on small screens");
  await page.getByRole("button", { name: "Share this event" }).click();
  await page.getByRole("status").filter({ hasText: "Link copied" }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), base + "/events/become-your-own-muse");
  console.log("PASS share button copies the event URL");
  assert.deepEqual(errors, []);
  console.log("PASS long titles and content, no browser errors");
  console.log("Screenshots: " + artifacts);
} finally {
  await browser.close();
}
