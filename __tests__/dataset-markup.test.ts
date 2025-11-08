import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs";
import { REGION_MULTIPLIER } from "@/lib/menu/pricing";
import type { MenuItem } from "@/lib/menu/types";

function toNum(n: unknown): number {
  return typeof n === "number" ? n : Number(n);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const gdl: MenuItem[] = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/menu_guadalajara_list2.json"),
    "utf8"
  )
);

const col: MenuItem[] = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/menu_colima_list2.json"),
    "utf8"
  )
);

describe("dataset markup verification", () => {
  it("every GDL price is base * 1.15 (±0.01)", () => {
    for (const item of gdl) {
      const base = toNum(item.basePrice);
      const expected = round2(base * REGION_MULTIPLIER.guadalajara);
      if (item.price.guadalajara !== undefined) {
        expect(Math.abs(item.price.guadalajara - expected)).toBeLessThanOrEqual(
          0.01
        );
      }
    }
  });

  it("every Colima price is base * 1.20 (±0.01)", () => {
    for (const item of col) {
      const base = toNum(item.basePrice);
      const expected = round2(base * REGION_MULTIPLIER.colima);
      if (item.price.colima !== undefined) {
        expect(Math.abs(item.price.colima - expected)).toBeLessThanOrEqual(
          0.01
        );
      }
    }
  });

  it("every item has exactly one unit", () => {
    const all = [...gdl, ...col];
    for (const item of all) {
      expect(item.unit === "kg" || item.unit === "pieza").toBe(true);
    }
  });

  it("dataset contains items", () => {
    expect(gdl.length).toBeGreaterThan(0);
    expect(col.length).toBeGreaterThan(0);
  });

  it("GDL and Colima datasets have same items", () => {
    expect(gdl.length).toBe(col.length);
    const gdlIds = new Set(gdl.map(i => i.id));
    const colIds = new Set(col.map(i => i.id));
    expect(gdlIds.size).toBe(colIds.size);
  });
});
