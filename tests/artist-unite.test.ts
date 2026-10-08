import assert from "node:assert/strict";
import test from "node:test";
import { leadSchema } from "../src/lib/schemas";
import { artistUnite } from "../src/lib/editorial/defaults/artist-unite";
const application = { source: "artist-unite", name: "Test", lastName: "Artist", email: "artist@example.com", phone: "+919876543210", artPractice: "Theatre", portfolio: "https://example.com/portfolio" };
test("Artist Unite accepts its six fields without residency research/country fields", () => assert.equal(leadSchema.safeParse(application).success, true));
test("all six Artist Unite fields are mandatory with friendly errors", () => {
  for (const field of ["name", "lastName", "email", "phone", "artPractice", "portfolio"]) {
    const result = leadSchema.safeParse({ ...application, [field]: "" });
    assert.equal(result.success, false, field);
    if (!result.success) assert.ok(result.error.issues.some(issue => issue.path[0] === field && /^Please /.test(issue.message)), field);
  }
});
test("the full schedule, inclusions, Zariya and checkout details are retained", () => {
  assert.equal(artistUnite.sections.length, 7);
  const content = artistUnite.introductionHtml + artistUnite.sections.map(section => section.title + section.bodyHtml).join(" ");
  for (const value of ["There are no masterclasses here", "Life Between the Sessions", "7:00 AM", "7:30 AM", "9:30 AM", "10:30 AM", "1:00 PM", "5:00 PM", "6:30 PM", "8:30 PM", "Post Dinner", "Lunch is not included", "10 nights of dormitory accommodation", "Participation and presentation opportunity at Zariya", "25 October 2026, morning"]) assert.ok(content.includes(value), value);
  assert.equal(artistUnite.priceLabel, "\u20b918,500 + GST");
});
