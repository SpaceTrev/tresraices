import "./../styles/globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import NavBar from "@/components/layout/NavBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://tresraices.netlify.app"),
  title: "Tres Raíces Carnicería — Cortes Premium en Guadalajara y Colima",
  description: "Carnicería boutique con cortes selectos y entrega a domicilio. Pedidos por WhatsApp.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Tres Raíces Carnicería — Cortes Premium en Guadalajara y Colima",
    description: "Carnicería boutique con cortes selectos y entrega a domicilio. Pedidos por WhatsApp.",
    url: "https://tresraices.netlify.app",
    siteName: "Tres Raíces Carnicería",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Tres Raíces Carnicería - Cortes Premium",
      },
    ],
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tres Raíces Carnicería — Cortes Premium en Guadalajara y Colima",
    description: "Carnicería boutique con cortes selectos y entrega a domicilio. Pedidos por WhatsApp.",
    images: ["/logo.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#4A148C",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // JSON-LD structured data for Facebook/Google business verification
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://tresraices.netlify.app",
    "name": "Boutique Tres Raíces",
    "alternateName": "Tres Raíces Carnicería",
    "description": "Carnicería boutique con cortes selectos y entrega a domicilio en Guadalajara y Colima",
    "url": "https://tresraices.netlify.app",
    "telephone": "+523315126548",
    "image": "https://tresraices.netlify.app/logo.jpg",
    "logo": "https://tresraices.netlify.app/logo.jpg",
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "City",
        "name": "Guadalajara",
        "containedInPlace": {
          "@type": "State",
          "name": "Jalisco"
        }
      },
      {
        "@type": "City",
        "name": "Colima",
        "containedInPlace": {
          "@type": "State",
          "name": "Colima"
        }
      }
    ],
    "sameAs": [
      "https://wa.me/523315126548"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+523315126548",
      "contactType": "customer service",
      "availableLanguage": ["es"]
    }
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
