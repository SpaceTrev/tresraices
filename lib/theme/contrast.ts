/**
 * WCAG contrast ratio checker
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return 0;
  }

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

export interface ContrastResult {
  ratio: number;
  wcagAA: boolean; // 4.5:1 for normal text, 3:1 for large text
  wcagAAA: boolean; // 7:1 for normal text, 4.5:1 for large text
  level: "fail" | "aa-large" | "aa" | "aaa";
}

/**
 * Check contrast ratio and return WCAG compliance
 */
export function checkContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background);

  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;

  const wcagAA = ratio >= aaThreshold;
  const wcagAAA = ratio >= aaaThreshold;

  let level: ContrastResult["level"] = "fail";
  if (wcagAAA) {
    level = "aaa";
  } else if (wcagAA) {
    level = "aa";
  } else if (isLargeText && ratio >= 3) {
    level = "aa-large";
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA,
    wcagAAA,
    level,
  };
}

/**
 * Check all common text/background combinations in a palette
 */
export function checkPaletteContrast(colors: Record<string, string>): Array<{
  pair: string;
  foreground: string;
  background: string;
  result: ContrastResult;
}> {
  const textColors = ["darkPurple", "federalBlue"];
  const bgColors = ["cream", "lightBlue", "mintGreen"];

  const results: Array<{
    pair: string;
    foreground: string;
    background: string;
    result: ContrastResult;
  }> = [];

  for (const textColor of textColors) {
    for (const bgColor of bgColors) {
      if (colors[textColor] && colors[bgColor]) {
        results.push({
          pair: `${textColor}/${bgColor}`,
          foreground: colors[textColor],
          background: colors[bgColor],
          result: checkContrast(colors[textColor], colors[bgColor]),
        });
      }
    }
  }

  return results;
}
