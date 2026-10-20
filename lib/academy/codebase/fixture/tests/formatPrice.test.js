import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPrice } from "../src/utils/formatPrice.js";

test("kobo are shown as naira with two decimals", () => {
  assert.equal(formatPrice(1250000), "₦12,500.00");
});

test("zero is ₦0.00", () => {
  assert.equal(formatPrice(0), "₦0.00");
});
