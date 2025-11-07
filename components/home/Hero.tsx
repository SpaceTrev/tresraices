export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image/Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkPurple via-federalBlue to-uclaBlue">
        <div className="absolute inset-0 bg-[url('/img/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl container-pad text-center text-white py-16">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Carnes selectas, <br className="hidden sm:block" />
            directo a tu mesa
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-cream/90 font-light">
            Cortes premium de productores locales, entrega directa en Guadalajara y Colima.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a 
              href="/menu/guadalajara" 
              className="btn bg-mintGreen text-darkPurple hover:bg-cream font-semibold px-8 py-4 text-lg rounded-2xl shadow-lg transition-all hover:scale-105"
            >
              Ver menú
            </a>
            <a 
              href="https://wa.me/523315126548"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-8 py-4 text-lg rounded-2xl border border-white/30 transition-all hover:scale-105"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent"></div>
    </section>
  );
}
