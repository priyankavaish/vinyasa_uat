import assert from "node:assert/strict";
import test from "node:test";
import { farmOffers, farmQuote, farmNights, farmDateValid, farmEnquiryMessage, type FarmStay } from "../src/lib/work-from-farm";
import { leadSchema } from "../src/lib/schemas";

const dorm: FarmStay = { name: "Community Dormitory", description: "", icon: "people-outline", rows: [{ label: "1-14 nights", price: "₹750 / person / night" }, { label: "15 nights or longer", price: "₹500 / person / night" }] };
const cottage: FarmStay = { name: "Earthen Cottage", description: "", icon: "home-outline", rows: [{ label: "1-6 nights", price: "₹3,500 / cottage / night" }, { label: "7-14 nights", price: "₹2,900 / cottage / night" }, { label: "15 nights or longer", price: "₹2,100 / cottage / night" }] };
test("duration thresholds use the published Work from Farm rates for the whole stay", () => {
  for (const [nights, rate] of [[1, 3500], [6, 3500], [7, 2900], [14, 2900], [15, 2100], [16, 2100]]) {
    assert.equal(farmQuote(cottage, nights, 2, 1)?.rate, rate);
    assert.equal(farmQuote(cottage, nights, 2, 1)?.baseAmount, nights * rate);
  }
  assert.equal(farmQuote(dorm, 14, 2, 1)?.rate, 750);
  assert.equal(farmQuote(dorm, 15, 2, 1)?.rate, 500);
});
test("dorm pricing is per guest, cottages per unit, and GST excludes optional food", () => {
  assert.equal(farmQuote(dorm, 16, 2, 1)?.baseAmount, 16000);
  assert.equal(farmQuote(dorm, 16, 2, 1)?.totalAmount, 18880);
  assert.equal(farmQuote(cottage, 7, 2, 1)?.totalAmount, 23954);
  assert.equal(farmQuote(cottage, 7, 4, 2)?.baseAmount, 40600);
  assert.equal(farmQuote(cottage, 7, 3, 1), null);
});
test("edited CMS prices and formatted ranges are read without a stays-price fallback", () => {
  const edited = { ...dorm, rows: [{ label: "<strong>1–14 nights</strong>", price: "<span>₹875 / person / night</span>" }] };
  assert.equal(farmQuote(edited, 7, 2, 1)?.baseAmount, 12250);
  assert.equal(farmQuote({ ...cottage, rows: [{ label: "15+ nights", price: "\u20b92,100 / mudhouse/ night" }] }, 16, 2, 1)?.baseAmount, 33600);
  assert.equal(farmQuote({ ...dorm, rows: [{ label: "Ask us", price: "Contact for rates" }] }, 7, 1, 1), null);
  assert.equal(farmQuote({ ...dorm, rows: [{ label: "1-14 nights", price: "₹750 / stay" }] }, 7, 1, 1), null);
});
test("calendar dates reject impossible, missing and reversed stays", () => {
  assert.equal(farmNights("2030-01-01", "2030-01-16"), 15);
  assert.equal(farmNights("2030-01-16", "2030-01-01"), 0);
  assert.equal(farmNights("", "2030-01-16"), 0);
  assert.equal(farmDateValid("2030-02-30"), false);
  assert.equal(farmDateValid("2032-02-29"), true);
});
test("a Work from Farm enquiry requires dates and stores its own rate context", () => {
  const payload = { source: "work-from-farm", name: "Test Guest", email: "guest@example.com", phone: "+919876543210", farmStayId: "community-dormitory", guests: "2", rooms: "1", checkInDate: "2099-12-01", checkOutDate: "2099-12-17" };
  assert(leadSchema.safeParse(payload).success);
  assert.equal(leadSchema.safeParse({ ...payload, checkOutDate: "2099-12-01" }).success, false);
  assert.equal(leadSchema.safeParse({ ...payload, guests: "0" }).success, false);
  const message = farmEnquiryMessage(farmOffers([dorm])[0], { ...payload, message: "Quiet work space." });
  assert.match(message, /Work from Farm rate: ₹500/);
  assert.match(message, /Estimated total: ₹18,880/);
  assert.match(message, /Meals are optional/);
  assert.match(message, /Quiet work space/);
});
