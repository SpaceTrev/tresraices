export default function About() {
  return (
    <section className="py-16 sm:py-20 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
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
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-mintGreen rounded-full flex items-center justify-center text-2xl">
                  🌱
                </div>
                <div>
                  <div className="font-semibold text-darkPurple">100% local</div>
                  <div className="text-sm text-slate-600">Productores mexicanos</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-lightBlue rounded-full flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div>
                  <div className="font-semibold text-darkPurple">Entrega 24h</div>
                  <div className="text-sm text-slate-600">Pedidos rápidos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="card overflow-hidden shadow-xl">
              <img 
                src="/img/about-section.jpg" 
                alt="Cortes de carne premium"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mintGreen/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
