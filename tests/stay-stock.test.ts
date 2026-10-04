import assert from "node:assert/strict";
import test from "node:test";
import { stayQuantitySchema, isStaySoldOut } from "../src/lib/stay-stock";

test("zero is sold out; positive and unset quantities remain available", () => {
  assert.equal(isStaySoldOut({ quantity: stayQuantitySchema.parse("0") }), true);
  assert.equal(isStaySoldOut({ quantity: stayQuantitySchema.parse("3") }), false);
  assert.equal(stayQuantitySchema.parse(""), null);
  assert.equal(isStaySoldOut({ quantity: null }), false);
  assert.equal(isStaySoldOut(undefined), false);
});
test("rejects negative, fractional and invalid quantities", () => {
  for (const quantity of ["-1", "1.5", "abc", "100001", "Infinity"]) {
    assert.equal(stayQuantitySchema.safeParse(quantity).success, false);
  }
});
