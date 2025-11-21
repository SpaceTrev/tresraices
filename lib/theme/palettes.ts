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
  {
    id: "nord",
    name: "Nord (Nórdico)",
    colors: {
      darkPurple: "#2e3440",
      federalBlue: "#3b4252",
      lightBlue: "#88c0d0",
      uclaBlue: "#5e81ac",
      mintGreen: "#a3be8c",
      cream: "#eceff4",
    },
  },
  {
    id: "dracula",
    name: "Dracula (Vampiro)",
    colors: {
      darkPurple: "#282a36",
      federalBlue: "#44475a",
      lightBlue: "#8be9fd",
      uclaBlue: "#6272a4",
      mintGreen: "#50fa7b",
      cream: "#f8f8f2",
    },
  },
  {
    id: "solarized",
    name: "Solarized (Solar)",
    colors: {
      darkPurple: "#002b36",
      federalBlue: "#073642",
      lightBlue: "#2aa198",
      uclaBlue: "#268bd2",
      mintGreen: "#859900",
      cream: "#fdf6e3",
    },
  },
  {
    id: "gruvbox",
    name: "Gruvbox (Retro)",
    colors: {
      darkPurple: "#282828",
      federalBlue: "#3c3836",
      lightBlue: "#83a598",
      uclaBlue: "#458588",
      mintGreen: "#b8bb26",
      cream: "#fbf1c7",
    },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night (Tokio)",
    colors: {
      darkPurple: "#1a1b26",
      federalBlue: "#24283b",
      lightBlue: "#7aa2f7",
      uclaBlue: "#3d59a1",
      mintGreen: "#9ece6a",
      cream: "#c0caf5",
    },
  },
  {
    id: "catppuccin",
    name: "Catppuccin (Café)",
    colors: {
      darkPurple: "#1e1e2e",
      federalBlue: "#313244",
      lightBlue: "#89dceb",
      uclaBlue: "#89b4fa",
      mintGreen: "#a6e3a1",
      cream: "#f5e0dc",
    },
  },
  {
    id: "one-dark",
    name: "One Dark (Oscuro)",
    colors: {
      darkPurple: "#282c34",
      federalBlue: "#21252b",
      lightBlue: "#61afef",
      uclaBlue: "#528bff",
      mintGreen: "#98c379",
      cream: "#abb2bf",
    },
  },
  {
    id: "material",
    name: "Material Design",
    colors: {
      darkPurple: "#263238",
      federalBlue: "#37474f",
      lightBlue: "#80deea",
      uclaBlue: "#42a5f5",
      mintGreen: "#66bb6a",
      cream: "#eceff1",
    },
  },
  {
    id: "everforest",
    name: "Everforest (Bosque)",
    colors: {
      darkPurple: "#2d353b",
      federalBlue: "#343f44",
      lightBlue: "#83c092",
      uclaBlue: "#7fbbb3",
      mintGreen: "#a7c080",
      cream: "#d3c6aa",
    },
  },
  {
    id: "rose-pine",
    name: "Rosé Pine (Rosa)",
    colors: {
      darkPurple: "#191724",
      federalBlue: "#1f1d2e",
      lightBlue: "#9ccfd8",
      uclaBlue: "#31748f",
      mintGreen: "#c4a7e7",
      cream: "#faf4ed",
    },
  },
  {
    id: "monokai",
    name: "Monokai Pro",
    colors: {
      darkPurple: "#2d2a2e",
      federalBlue: "#403e41",
      lightBlue: "#78dce8",
      uclaBlue: "#ab9df2",
      mintGreen: "#a9dc76",
      cream: "#fcfcfa",
    },
  },
  {
    id: "palenight",
    name: "Palenight (Noche)",
    colors: {
      darkPurple: "#292d3e",
      federalBlue: "#32374d",
      lightBlue: "#89ddff",
      uclaBlue: "#82aaff",
      mintGreen: "#c3e88d",
      cream: "#a6accd",
    },
  },
  {
    id: "github",
    name: "GitHub Dark",
    colors: {
      darkPurple: "#0d1117",
      federalBlue: "#161b22",
      lightBlue: "#58a6ff",
      uclaBlue: "#1f6feb",
      mintGreen: "#56d364",
      cream: "#f0f6fc",
    },
  },
  {
    id: "ayu",
    name: "Ayu Mirage",
    colors: {
      darkPurple: "#1f2430",
      federalBlue: "#242936",
      lightBlue: "#5ccfe6",
      uclaBlue: "#73d0ff",
      mintGreen: "#bae67e",
      cream: "#d9d7ce",
    },
  },
  {
    id: "horizon",
    name: "Horizon (Horizonte)",
    colors: {
      darkPurple: "#1c1e26",
      federalBlue: "#232530",
      lightBlue: "#6dcae8",
      uclaBlue: "#25b0bc",
      mintGreen: "#27d796",
      cream: "#fdf0ed",
    },
  },
  {
    id: "oceanic",
    name: "Oceanic Next",
    colors: {
      darkPurple: "#1b2b34",
      federalBlue: "#343d46",
      lightBlue: "#6699cc",
      uclaBlue: "#4f5b66",
      mintGreen: "#99c794",
      cream: "#d8dee9",
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
