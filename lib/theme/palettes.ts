/**
 * Theme palettes and color definitions
 */

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    darkPurple: string;
    federalBlue: string;
    lightBlue: string;
    uclaBlue: string;
    mintGreen: string;
    cream: string;
  };
}

export const DEFAULT_PALETTES: ColorPalette[] = [
  {
    id: "default",
    name: "Original",
    colors: {
      darkPurple: "#0D0221",
      federalBlue: "#0F084B",
      lightBlue: "#A6CFD5",
      uclaBlue: "#467599",
      mintGreen: "#C2E7D9",
      cream: "#F2E9DF",
    },
  },
  {
    id: "high-contrast",
    name: "Alto Contraste",
    colors: {
      darkPurple: "#000000",
      federalBlue: "#1a1a2e",
      lightBlue: "#7dd3fc",
      uclaBlue: "#3b82f6",
      mintGreen: "#4ade80",
      cream: "#ffffff",
    },
  },
  {
    id: "warm",
    name: "Cálido",
    colors: {
      darkPurple: "#3c1518",
      federalBlue: "#69140e",
      lightBlue: "#f4a261",
      uclaBlue: "#e76f51",
      mintGreen: "#e9c46a",
      cream: "#faf3dd",
    },
  },
  {
    id: "cool",
    name: "Frío",
    colors: {
      darkPurple: "#1b263b",
      federalBlue: "#0d1b2a",
      lightBlue: "#778da9",
      uclaBlue: "#415a77",
      mintGreen: "#a8dadc",
      cream: "#f1faee",
    },
  },
];

/**
 * Get palette by ID
 */
export function getPalette(id: string): ColorPalette {
  return DEFAULT_PALETTES.find((p) => p.id === id) || DEFAULT_PALETTES[0];
}

/**
 * Generate CSS variables from a color palette
 */
export function generateCssVariables(palette: ColorPalette): string {
  return `
    --color-dark-purple: ${palette.colors.darkPurple};
    --color-federal-blue: ${palette.colors.federalBlue};
    --color-light-blue: ${palette.colors.lightBlue};
    --color-ucla-blue: ${palette.colors.uclaBlue};
    --color-mint-green: ${palette.colors.mintGreen};
    --color-cream: ${palette.colors.cream};
  `.trim();
}
