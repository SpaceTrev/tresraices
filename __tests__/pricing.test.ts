import { describe, it, expect } from "vitest";
import { computeRegionPrices, REGION_MULTIPLIER } from "@/lib/menu/pricing";

describe("computeRegionPrices", () => {
  it("applies +15% (GDL) and +20% (Colima)", () => {
    const base = 100;
    const { guadalajara, colima } = computeRegionPrices(base);
    expect(guadalajara).toBe(115.0);
    expect(colima).toBe(120.0);
  });

  it("rounds to 2 decimal places", () => {
    const base = 133.333;
    const { guadalajara, colima } = computeRegionPrices(base);
    expect(guadalajara).toBe(153.33);
    expect(colima).toBe(160.0);
  });

  it("handles small prices correctly", () => {
    const base = 10.5;
    const { guadalajara, colima } = computeRegionPrices(base);
    expect(guadalajara).toBe(12.08);
    expect(colima).toBe(12.6);
  });

  it("REGION_MULTIPLIER constants are correct", () => {
    expect(REGION_MULTIPLIER.guadalajara).toBe(1.15);
    expect(REGION_MULTIPLIER.colima).toBe(1.2);
  });
});
