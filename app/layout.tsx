import "./../styles/globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

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
        <header className="bg-darkPurple text-white">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Tres Raíces" className="h-12 w-12 rounded-full" />
              <div className="font-semibold leading-tight">
                <div className="text-lg">Boutique Tres Raíces</div>
                <div className="text-xs opacity-80">Carne Selecta</div>
              </div>
            </a>
            <nav className="flex gap-4">
              <a className="hover:underline" href="/menu/guadalajara">Menú Guadalajara</a>
              <a className="hover:underline" href="/menu/colima">Menú Colima</a>
              <a className="hover:underline opacity-75" href="/admin">Admin</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
