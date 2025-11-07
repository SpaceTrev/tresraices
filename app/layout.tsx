import "./../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Boutique Tres Raíces - Carne Selecta",
  description: "Menú y precios actualizados para Guadalajara y Colima",
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
        <main className="container py-8">{children}</main>
        <footer className="mt-16 bg-federalBlue text-white">
          <div className="container py-6 text-sm flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center justify-between">
            <div>&copy; {new Date().getFullYear()} Boutique Tres Raíces</div>
            <div>Pedidos por WhatsApp: <a className="font-semibold underline" href="https://wa.me/523315126548" target="_blank">33 1512 6548</a></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
