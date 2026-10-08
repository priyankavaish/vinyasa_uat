import assert from "node:assert/strict";
import test from "node:test";
import { leadSchema } from "../src/lib/schemas";
import { artistInResidence, residencyCountries } from "../src/lib/editorial/defaults/artist-in-residence";

const application = { source: "artist-residence", name: "Priya", lastName: "", email: "priya@example.com", phone: "+919876543210", artPractice: "Photography", portfolio: "https://example.com/portfolio", country: "India", researchInquiry: "Researching community-led photographic practice." };
test("residency accepts a complete application with optional last name", () => {
  assert.equal(leadSchema.safeParse(application).success, true);
});
test("residency requires every application detail and gives readable errors", () => {
  for (const field of ["name", "email", "phone", "artPractice", "portfolio", "country", "researchInquiry"]) {
    const result = leadSchema.safeParse({ ...application, [field]: "" });
    assert.equal(result.success, false, field);
    if (!result.success) assert.ok(result.error.issues.some(issue => issue.path[0] === field && /^Please /.test(issue.message)), field);
  }
});
test("residency rejects unsafe portfolio URLs and invalid phones", () => {
  for (const portfolio of ["javascript:alert(1)", "not a URL", "ftp://example.com"]) assert.equal(leadSchema.safeParse({ ...application, portfolio }).success, false);
  assert.equal(leadSchema.safeParse({ ...application, phone: "123" }).success, false);
});
test("the full reference structure and important terms are retained", () => {
  assert.deepEqual(artistInResidence.sections.map(section => section.title), ["Who This Is For", "What the Residency Offers", "Residency Focus: Research-Led Practice", "Contribution to the Space", "Research Documentation & Submission", "Archiving & Knowledge Building", "Application Process", "Selection & Availability", "Closing Note"]);
  const body = artistInResidence.sections.map(section => section.bodyHtml).join(" ");
  for (const phrase of ["1. Research Topic", "2. Scope &amp; Depth", "3. Methodology", "4. Process Documentation", "5. Proposed Outcomes", "6. Tentative Timeline", "60\u201340 split", "does not include a stipend", "white paper", "Artists will retain authorship", "Step 0", "Step 1", "Step 2", "Step 3", "Only 2 residency spots available"]) assert.ok(body.includes(phrase), phrase);
  assert.equal(artistInResidence.dateLabel, "1 October 2026 - 31 January 2027");
  assert.ok(residencyCountries.includes("India"));
});
