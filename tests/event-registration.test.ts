import assert from "node:assert/strict";
import test from "node:test";
import { eventRegistrationSettings, eventRegistrationFromForm, hasBookingContent } from "../src/lib/event-registration";

test("existing events retain their booking behavior without custom editor content", () => {
  assert.deepEqual(eventRegistrationSettings(null), { showBooking: true, showRegistration: false, bookingHtml: "" });
  assert.deepEqual(eventRegistrationSettings({ showBooking: false, showRegistration: true }), { showBooking: false, showRegistration: true, bookingHtml: "" });
});
test("three independently authored payment buttons survive form parsing", () => {
  const html = ["Dorm", "Cottage", "Day pass"].map((name, i) => `<p><a href="https://razorpay.com/payment-link/plink_${i}" data-btn="true">${name}</a></p>`).join("");
  const form = new FormData();
  form.set("eventRegistrationSettings", "1"); form.set("eventShowBooking", "on"); form.set("eventBookingHtml", html);
  const settings = eventRegistrationSettings(eventRegistrationFromForm(form));
  assert.equal(settings.bookingHtml, html);
  assert.equal(settings.showBooking, true);
  assert.equal(settings.showRegistration, false);
});
test("older forms preserve editor content while the editor can explicitly clear it", () => {
  const form = new FormData(); form.set("eventRegistrationSettings", "1");
  assert.equal(Object.hasOwn(eventRegistrationFromForm(form)!, "bookingHtml"), false);
  form.set("eventBookingHtml", "");
  assert.equal(eventRegistrationFromForm(form)?.bookingHtml, "");
  assert.equal(eventRegistrationFromForm(new FormData()), null);
});
test("empty rich editor documents use the fallback while real text, links and images count as content", () => {
  for (const html of ["", "<p></p>", "<p><br></p>", "<p>&nbsp; </p>"]) assert.equal(hasBookingContent(html), false);
  for (const html of ['<h2>Register</h2>', '<a href="https://rzp.io/example">Pay</a>', '<img src="/photo.jpg" alt="" />']) assert.equal(hasBookingContent(html), true);
});
