#!/usr/bin/env node
/**
 * Initialize site config from hardcoded values
 * Usage: node scripts/init-site-config.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultConfig = {
  content: {
    hero: {
      headline: "Carnes selectas, directo a tu mesa",
      tagline: "Calidad premium en Guadalajara y Colima",
      ctaText: "Ver Menú",
    },
    about: {
      headline: "De la granja a tu mesa",
      description:
        "Carnicería boutique especializada en cortes premium y carnes exóticas. Entrega a domicilio en Guadalajara y Colima.",
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
      markup: 1.2,
      displayName: "Guadalajara",
    },
    colima: {
      markup: 1.3,
      displayName: "Colima",
    },
  },
  theme: {
    activePaletteId: "default",
  },
  font: {
    family: "system",
  },
  defaultSupplierId: "el-barranqueno",
  features: {
    loyaltyProgram: false,
    autoReorder: false,
    multiLocation: false,
    autoCreateWhatsAppOrders: false,
  },
  updatedAt: new Date().toISOString(),
  updatedBy: "system",
};

const configPath = path.join(__dirname, "..", "data", "site-config.json");

try {
  if (fs.existsSync(configPath)) {
    console.log("⚠️  site-config.json already exists");
    console.log("   Backing up to site-config.backup.json...");
    fs.copyFileSync(configPath, path.join(__dirname, "..", "data", "site-config.backup.json"));
  }

  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log("✅ Created data/site-config.json");
  console.log("\n🎉 Site config initialized!");
} catch (error) {
  console.error("❌ Error initializing site config:", error);
  process.exit(1);
}
