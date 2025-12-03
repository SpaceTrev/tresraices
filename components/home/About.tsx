import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl container-pad">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <ScrollReveal>
            <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple leading-tight">
              De la granja a tu mesa
            </h2>
            
            <p className="text-lg text-slate-700 leading-relaxed">
              En Tres Raíces, conectamos productores locales con familias que valoran la autenticidad. 
              Cada corte es seleccionado con cuidado, garantizando trazabilidad completa y frescura 
              incomparable desde el origen hasta tu cocina.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-darkPurple to-federalBlue rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🌱
                </div>
                <div>
                  <div className="font-semibold text-darkPurple">100% local</div>
                  <div className="text-sm text-slate-600">Productores mexicanos</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-darkPurple to-federalBlue rounded-full flex items-center justify-center text-2xl shadow-lg">
                  ⚡
                </div>
                <div>
                  <div className="font-semibold text-darkPurple">Entrega 24h</div>
                  <div className="text-sm text-slate-600">Pedidos rápidos</div>
                </div>
              </div>
            </div>
            </div>
          </ScrollReveal>

          {/* Image */}
          <ScrollReveal delay={200}>
            <div className="relative">
            <div className="card overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="relative w-full h-[400px] overflow-hidden">
                <img 
                  src="/img/tabla-de-cortes.png" 
                  alt="Tabla de cortes premium - Variedad de carnes frescas Tres Raíces"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay for text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-darkPurple/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
            {/* Enhanced decorative accents */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cream/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-600/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
