export default function Footer() {
  return (
    <footer className="bg-federalBlue text-cream border-t border-black/10">
      <div className="mx-auto max-w-7xl container-pad py-8 sm:py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Tres Raíces" 
                className="h-12 w-12 rounded-full"
              />
              <div className="font-semibold leading-tight">
                <div className="text-lg">Boutique Tres Raíces</div>
                <div className="text-xs opacity-80">Carne Selecta</div>
              </div>
            </div>
            <p className="text-sm text-cream/80">
              Carnicería boutique con cortes premium y entrega a domicilio.
            </p>
          </div>

          {/* Regiones */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Regiones</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/menu/guadalajara" className="hover:text-mintGreen transition-colors tap-target inline-flex items-center">
                  Guadalajara, Jalisco
                </a>
              </li>
              <li>
                <a href="/menu/colima" className="hover:text-mintGreen transition-colors tap-target inline-flex items-center">
                  Colima, Colima
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contacto</h3>
            <div className="space-y-2 text-sm">
              <div>
                <a 
                  href="https://wa.me/523315126548"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mintGreen transition-colors font-medium tap-target inline-flex items-center"
                >
                  📱 33 1512 6548
                </a>
              </div>
              <div className="text-cream/80">
                Pedidos por WhatsApp
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cream/20 text-center text-sm text-cream/60">
          <p>&copy; {new Date().getFullYear()} Boutique Tres Raíces. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
