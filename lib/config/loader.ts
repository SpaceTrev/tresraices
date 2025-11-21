/**
 * Site configuration loader
 * Reads from /data/site-config.json with fallback to defaults
 */

import fs from "node:fs";
import path from "node:path";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "./types";

let cachedConfig: SiteConfig | null = null;

/**
 * Load site configuration
 * Reads from /data/site-config.json, falls back to defaults
 */
export function loadSiteConfig(): SiteConfig {
  // Return cached if available
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const configPath = path.join(process.cwd(), "data", "site-config.json");
    
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(raw) as SiteConfig;
      
      // Merge with defaults to handle missing fields
      cachedConfig = {
        ...DEFAULT_SITE_CONFIG,
        ...config,
        content: {
          ...DEFAULT_SITE_CONFIG.content,
          ...config.content,
          hero: {
            ...DEFAULT_SITE_CONFIG.content.hero,
            ...config.content.hero,
          },
          about: {
            ...DEFAULT_SITE_CONFIG.content.about,
            ...config.content.about,
          },
          valueProps: config.content.valueProps || DEFAULT_SITE_CONFIG.content.valueProps,
          cta: {
            ...DEFAULT_SITE_CONFIG.content.cta,
            ...config.content.cta,
          },
          footer: {
            ...DEFAULT_SITE_CONFIG.content.footer,
            ...config.content.footer,
          },
          contact: {
            ...DEFAULT_SITE_CONFIG.content.contact,
            ...config.content.contact,
          },
        },
        regions: {
          ...DEFAULT_SITE_CONFIG.regions,
          ...config.regions,
        },
        theme: {
          ...DEFAULT_SITE_CONFIG.theme,
          ...config.theme,
        },
        font: {
          ...DEFAULT_SITE_CONFIG.font,
          ...config.font,
        },
        features: {
          ...DEFAULT_SITE_CONFIG.features,
          ...config.features,
        },
      };
      
      return cachedConfig;
    }
  } catch (error) {
    console.warn("[Config] Failed to load site config, using defaults:", error);
  }

  // Fallback to defaults
  cachedConfig = DEFAULT_SITE_CONFIG;
  return cachedConfig;
}

/**
 * Clear cached config (call after updating)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}

/**
 * Get WhatsApp URL for contact
 */
export function getWhatsAppUrl(message?: string): string {
  const config = loadSiteConfig();
  const phone = config.content.contact.whatsappNumber;
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${phone}${message ? `?text=${encoded}` : ""}`;
}
