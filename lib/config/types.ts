/**
 * Site configuration type definitions
 */

export interface SiteContent {
  hero: {
    headline: string;
    tagline: string;
    ctaText: string;
  };
  about: {
    headline: string;
    description: string;
  };
  valueProps: Array<{
    title: string;
    description: string;
  }>;
  cta: {
    headline: string;
    description: string;
    buttonText: string;
  };
  footer: {
    brandDescription: string;
    regionsServed: string[];
  };
  contact: {
    whatsappNumber: string;
    phone: string;
    email?: string;
  };
}

export interface RegionConfig {
  guadalajara: {
    markup: number; // Multiplier (e.g., 1.20)
    displayName: string;
  };
  colima: {
    markup: number; // Multiplier (e.g., 1.30)
    displayName: string;
  };
}

export interface ThemeConfig {
  activePaletteId: string;
}

export interface FontConfig {
  family: string; // Google Font name or "system"
  customUrl?: string; // For custom Google Fonts URLs
}

export interface FeatureFlags {
  loyaltyProgram: boolean;
  autoReorder: boolean;
  multiLocation: boolean;
  autoCreateWhatsAppOrders: boolean;
}

export interface SiteConfig {
  content: SiteContent;
  regions: RegionConfig;
  theme: ThemeConfig;
  font: FontConfig;
  defaultSupplierId?: string;
  features: FeatureFlags;
  updatedAt?: string; // ISO timestamp
  updatedBy?: string;
}

// Default configuration (fallback values)
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  content: {
    hero: {
      headline: "Carnes selectas, directo a tu mesa",
      tagline: "Calidad premium en Guadalajara y Colima",
      ctaText: "Ver Menú",
    },
    about: {
      headline: "De la granja a tu mesa",
      description: "Carnicería boutique especializada en cortes premium y carnes exóticas. Entrega a domicilio en Guadalajara y Colima.",
    },
    valueProps: [
      {
        title: "Calidad Premium",
        description: "Selección cuidadosa de los mejores cortes",
      },
      {
        title: "100% Fresco",
        description: "Producto del día, nunca congelado",
      },
      {
        title: "Entrega 24h",
        description: "Pedidos rápidos por WhatsApp",
      },
    ],
    cta: {
      headline: "Descubre el sabor de la calidad Tres Raíces",
      description: "Haz tu pedido hoy mismo por WhatsApp",
      buttonText: "Pedir Ahora",
    },
    footer: {
      brandDescription: "Carnicería boutique con cortes selectos y entrega a domicilio.",
      regionsServed: ["Guadalajara", "Colima"],
    },
    contact: {
      whatsappNumber: "523315126548",
      phone: "+52 33 1512 6548",
    },
  },
  regions: {
    guadalajara: {
      markup: 1.20,
      displayName: "Guadalajara",
    },
    colima: {
      markup: 1.30,
      displayName: "Colima",
    },
  },
  theme: {
    activePaletteId: "default",
  },
  font: {
    family: "system",
  },
  features: {
    loyaltyProgram: false,
    autoReorder: false,
    multiLocation: false,
    autoCreateWhatsAppOrders: false,
  },
};
