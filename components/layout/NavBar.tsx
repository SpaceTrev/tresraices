"use client";

import { useState, useEffect } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Menú Guadalajara", href: "/menu/guadalajara" },
    { label: "Menú Colima", href: "/menu/colima" },
    { label: "WhatsApp", href: "https://wa.me/523315126548", external: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-darkPurple/90 backdrop-blur-lg text-white shadow-lg shadow-darkPurple/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Tres Raíces"
                className="h-10 w-10 rounded-full"
              />
              <div className="font-semibold leading-tight hidden sm:block">
                <div className="text-base">Boutique Tres Raíces</div>
                <div className="text-xs opacity-80">Carne Selecta</div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-mintGreen transition-colors font-medium tap-target flex items-center"
                  {...(link.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="md:hidden tap-target flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Abrir menú"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          id="mobile-menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-cream shadow-2xl animate-slide-in-right">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
                <div className="font-bold text-darkPurple text-lg">
                  Menú
                </div>
                <button
                  type="button"
                  className="tap-target flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <svg
                    className="w-6 h-6 text-darkPurple"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="flex items-center min-h-[44px] px-4 py-3 rounded-xl text-darkPurple font-medium hover:bg-mintGreen/30 transition-colors"
                        onClick={() => setIsOpen(false)}
                        {...(link.external && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {link.label}
                        {link.external && (
                          <svg
                            className="w-4 h-4 ml-2 opacity-60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="border-t border-slate-200 px-4 py-4">
                <div className="text-sm text-slate-600 text-center">
                  &copy; {new Date().getFullYear()} Tres Raíces
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
