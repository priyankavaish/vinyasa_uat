import assert from "node:assert/strict";
import test from "node:test";
import { eventHostsSchema, eventHostsFromForm } from "../src/lib/event-hosts";
import { legacyEventHosts } from "../src/lib/event-hosts-legacy";

test("hosts are optional, while explicit removal stays distinguishable from an older form", () => {
  const form = new FormData();
  assert.equal(eventHostsFromForm(form), null);
  form.set("eventHosts", "[]");
  assert.deepEqual(eventHostsFromForm(form), []);
  assert.deepEqual(eventHostsSchema.parse([{ name: "  Guest artist  " }]), [{ name: "Guest artist", role: "", image: "", bio: "", socials: [] }]);
});

test("people accept optional photos and multiple social profiles, but reject unsafe links", () => {
  const person = { name: "Artist", image: "/media/portrait.jpg", socials: [{ label: "Instagram", url: "https://instagram.com/artist/" }, { label: "Website", url: "https://example.com/" }] };
  assert(eventHostsSchema.safeParse([person]).success);
  for (const url of ["javascript:alert(1)", "data:text/html,test", "//example.com", "/profile", "https://user:password@example.com"]) {
    assert.equal(eventHostsSchema.safeParse([{ ...person, socials: [{ label: "Profile", url }] }]).success, false, url);
  }
  for (const image of ["javascript:alert(1)", "//example.com/image.jpg", "/\\evil.jpg"]) {
    assert.equal(eventHostsSchema.safeParse([{ ...person, image }]).success, false, image);
  }
  assert.equal(eventHostsSchema.safeParse([{ name: " " }]).success, false);
});

test("existing hosts keep their images, profile links and edited biographies", () => {
  const hosts = legacyEventHosts({ sections: [{
    title: "Your Hosts :",
    portraits: [{ name: "First artist", image: "/first.jpg", href: "https://instagram.com/first/" }, { name: "Second artist", image: "/second.jpg", href: "" }],
    bodyHtml: "<p><strong>First artist</strong> &amp; an edited biography.</p><p>Second artist's own introduction.</p>",
  }] });
  assert.equal(hosts.length, 2);
  assert.equal(hosts[0].image, "/first.jpg");
  assert.equal(hosts[0].bio, "First artist & an edited biography.");
  assert.equal(hosts[0].socials[0].url, "https://instagram.com/first/");
  assert.equal(hosts[1].bio, "Second artist's own introduction.");
  assert.deepEqual(hosts[1].socials, []);
  assert.deepEqual(legacyEventHosts({ sections: [{ title: "Programme", bodyHtml: "<p>Welcome</p>" }] }), []);
});
