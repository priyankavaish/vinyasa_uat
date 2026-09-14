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
