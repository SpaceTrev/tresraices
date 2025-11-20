import { describe, it, expect } from "vitest";
import { computeRegionPrices, REGION_MULTIPLIER } from "@/lib/menu/pricing";

describe("computeRegionPrices", () => {
  it("applies +20% (GDL) and +30% (Colima)", () => {
    const base = 100;
    const { guadalajara, colima } = computeRegionPrices(base);
    expect(guadalajara).toBe(120.0);
    expect(colima).toBe(130.0);
  });

  it("rounds to 2 decimal places", () => {
    const base = 133.333;
    const { guadalajara, colima } = computeRegionPrices(base);
    expect(guadalajara).toBe(160.0);
    expect(colima).toBe(173.33);
  });

  it("handles small prices correctly", () => {
    const base = 10.5;
    const { guadalajara, colima } = computeRegionPrices(base);
    expect(guadalajara).toBe(12.6);
    expect(colima).toBe(13.65);
  });

  it("REGION_MULTIPLIER constants are correct", () => {
    expect(REGION_MULTIPLIER.guadalajara).toBe(1.20);
    expect(REGION_MULTIPLIER.colima).toBe(1.30);
  });
});
