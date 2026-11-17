import assert from "node:assert/strict";
import test from "node:test";
import { eventDescriptionHtml, eventDescriptionText } from "../src/lib/event-description";

test("legacy plain descriptions preserve newlines and special characters", () => {
  assert.equal(eventDescriptionHtml("First & second\r\nNext line"), "First &amp; second<br />Next line");
});
test("editor paragraphs retain bold, colour and explicit line breaks without nested paragraphs", () => {
  const html = eventDescriptionHtml('<p><strong>Welcome</strong></p><p><span style="color: #8f3b31">Red line</span><br />Third line</p>');
  assert.equal(html, '<strong>Welcome</strong><br /><span style="color:#8f3b31">Red line</span><br />Third line');
});
test("intentional blank lines remain between paragraphs", () => {
  assert.equal(eventDescriptionHtml('<p>One</p><p></p><p>Two</p>'), 'One<br /><br />Two');
});
test("unsafe links, scripts and event attributes cannot reach the description", () => {
  const html = eventDescriptionHtml('<p onclick="alert(1)">Hello<script>alert(1)</script><a href="javascript:alert(1)">link</a><span style="color:#fff;position:fixed">text</span></p>');
  assert.ok(!/script|onclick|position:|javascript/i.test(html));
  assert.ok(html.includes('color:#fff'));
});
test("SEO and calendar output use spaced, decoded plain text", () => {
  assert.equal(eventDescriptionText('<p><strong>Sound &amp; nature</strong></p><p>Next line</p>'), 'Sound & nature Next line');
  assert.equal(eventDescriptionText('Sound & nature\nNext line'), 'Sound & nature Next line');
});
