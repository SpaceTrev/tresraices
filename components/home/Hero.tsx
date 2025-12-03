export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/img/hero.png')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-darkPurple/70 via-darkPurple/60 to-federalBlue/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl container-pad text-center text-white py-16">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in">
            Carnes selectas, <br className="hidden sm:block" />
            <span className="text-yellow-600">directo a tu mesa</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-cream/90 font-light">
            Cortes premium de productores locales, entrega directa en Guadalajara y Colima.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a 
              href="/menu/guadalajara" 
              className="btn bg-federalBlue text-white hover:bg-federalBlue/80 font-semibold px-8 py-4 text-lg rounded-2xl shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
            >
              Ver menú
            </a>
            <a 
              href="https://wa.me/523315126548"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-cream text-darkPurple hover:bg-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
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
