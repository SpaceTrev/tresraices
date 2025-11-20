/**
 * Pricing utilities for regional markup calculations
 */

export const REGION_MULTIPLIER = {
  guadalajara: 1.20,
  colima: 1.30,
} as const;

/**
 * Apply regional markups to wholesale base price
 * @param base - Wholesale price from LISTA 2
 * @returns Regional prices (Guadalajara +20%, Colima +30%)
 */
export function computeRegionPrices(base: number) {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    guadalajara: round2(base * REGION_MULTIPLIER.guadalajara),
    colima: round2(base * REGION_MULTIPLIER.colima),
  };
}
