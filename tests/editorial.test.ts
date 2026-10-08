import assert from "node:assert/strict";
import test from "node:test";
import { mergeEditorial } from "../src/lib/editorial/merge";

test("partial CMS edits preserve untouched fields", () => {
  const defaults = { heading: "Original", hero: { src: "/photo.jpg", alt: "Photo" }, items: ["one"] };
  assert.deepEqual(mergeEditorial(defaults, { hero: { alt: "Updated" } }), { ...defaults, hero: { src: "/photo.jpg", alt: "Updated" } });
});
test("intentional empty strings, lists and zero values do not resurrect defaults", () => {
  assert.deepEqual(mergeEditorial({ title: "Original", items: ["one"], count: 2, shown: true }, { title: "", items: [], count: 0, shown: false }), { title: "", items: [], count: 0, shown: false });
});
test("invalid persisted field types cannot break the public content shape", () => {
  assert.deepEqual(mergeEditorial({ title: "Original", items: ["one"], hero: { src: "/photo.jpg" } }, { title: 123, items: "invalid", hero: [] }), { title: "Original", items: ["one"], hero: { src: "/photo.jpg" } });
});
test("read-time merging neither mutates defaults nor exposes unknown fields", () => {
  const defaults = { heading: "Original" };
  assert.deepEqual(mergeEditorial(defaults, { heading: "Updated", hidden: "unrecognised" }), { heading: "Updated" });
  assert.deepEqual(defaults, { heading: "Original" });
});

import { isEditorialImageField } from "../src/lib/editorial/fields";
test("image controls never normalise alt text or captions as URLs", () => {
  assert.equal(isEditorialImageField("Content.imageAlt_5", "Green farmland"), false);
  assert.equal(isEditorialImageField("Content.photos / 1.caption", "Community life"), false);
  assert.equal(isEditorialImageField("Content.image_4", ""), true);
  assert.equal(isEditorialImageField("Content.hero.src", "/media/photo.jpg"), true);
  assert.equal(isEditorialImageField("Content.src_2", "/videos/hero.mp4"), false);
});

import { cleanInlineText, hasTextFormatting, plainText } from "../src/lib/editorial/text";
import { isEditorialTextField } from "../src/lib/editorial/fields";

test("visible text can be formatted while media, URLs and SEO stay plain", () => {
  for (const path of ["Content.text_2", "Content.introduction / 1", "Content.stays / 1.description", "Content.faqs / 1.answer", "Content.agreements / 2"]) assert.equal(isEditorialTextField(path), true, path);
  for (const path of ["Content.href_22", "Content.imageAlt_5", "Content.seo.title", "Content.icon", "Content.slug", "Content.src"]) assert.equal(isEditorialTextField(path), false, path);
});

test("bold, selected font, text colour and safe links survive rendering", () => {
  const html = '<strong><span style="font-family:Georgia;color:#8f3b31"><a href="https://example.com/stay">Work from farm</a></span></strong>';
  const clean = cleanInlineText(html);
  assert.match(clean, /<strong>/);
  assert.match(clean, /font-family:Georgia/);
  assert.match(clean, /color:#8f3b31/);
  assert.match(clean, /href="https:\/\/example.com\/stay"/);
  assert.equal(plainText(html), "Work from farm");
  assert.equal(hasTextFormatting("A little less rush."), false);
});

test("formatted text cannot inject scripts, unsafe links, or layout-changing styles", () => {
  const html = '<script>alert(1)</script><span onclick="bad()" style="position:fixed;color:#8f3b31;font-family:Georgia;background:url(https://bad.example)"><a href="javascript:bad()">Safe text</a></span>';
  const clean = cleanInlineText(html);
  assert.doesNotMatch(clean, /script|onclick|position|background|javascript|bad\.example/);
  assert.match(clean, /color:#8f3b31/);
  assert.doesNotMatch(cleanInlineText('<a href="/book"><strong>Book</strong></a>', false), /<a/);
});

test("new fields in saved list items inherit defaults without replacing edits", () => {
  assert.deepEqual(mergeEditorial({ stays: [{ name: "Dorm", description: "Full description" }] }, { stays: [{ name: "My dorm" }] }), { stays: [{ name: "My dorm", description: "Full description" }] });
});
