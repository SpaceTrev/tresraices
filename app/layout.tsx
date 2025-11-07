import "./../styles/globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import NavBar from "@/components/layout/NavBar";

export const metadata: Metadata = {
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
    type: "website",
    locale: "es_MX",
  },
};

export const viewport: Viewport = {
  themeColor: "#4A148C",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
