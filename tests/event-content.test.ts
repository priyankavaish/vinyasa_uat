import assert from "node:assert/strict";
import test from "node:test";
import { splitEventContent } from "../src/lib/event-content";

test("new event content without headings remains an intact overview", () => {
  const html = '<p>A workshop for everyone.</p><p><img src="/photo.jpg" alt="The setting" /></p>';
  assert.deepEqual(splitEventContent(html), { introductionHtml: html, sections: [] });
});

test("admin headings become sections without losing their content", () => {
  const result = splitEventContent('<p>Welcome.</p><h2>The <strong>experience</strong></h2><p>Make something.</p><h3>Before you arrive</h3><h4>Bring a notebook</h4><p>Materials included.</p>');
  assert.equal(result.introductionHtml, "<p>Welcome.</p>");
  assert.deepEqual(result.sections, [
    { title: "The experience", bodyHtml: "<p>Make something.</p>" },
    { title: "Before you arrive", bodyHtml: "<h4>Bring a notebook</h4><p>Materials included.</p>" },
  ]);
});

test("formatted titles, entities, media and links remain usable", () => {
  const result = splitEventContent('<h2>Art &amp; Nature</h2><figure><img src="/workshop.jpg" alt="Workshop" /></figure><p><a href="https://rzp.io/rzp/example">Reserve</a></p>');
  assert.equal(result.sections[0].title, "Art & Nature");
  assert.match(result.sections[0].bodyHtml, /<img src="\/workshop.jpg"/);
  assert.match(result.sections[0].bodyHtml, /https:\/\/rzp.io/);
});

test("empty and heading-first content render without a fabricated introduction", () => {
  assert.deepEqual(splitEventContent(""), { introductionHtml: "", sections: [] });
  assert.equal(splitEventContent("<h2>Programme</h2><p>Welcome.</p>").introductionHtml, "");
});
