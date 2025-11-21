import ScrollReveal from "./ScrollReveal";

export default function CTASection() {
  return (
    <section className="section-pad">
      <ScrollReveal>
        <div className="relative bg-gradient-to-br from-darkPurple via-federalBlue to-uclaBlue text-cream py-16 px-4 rounded-3xl mx-auto max-w-7xl shadow-2xl overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-mintGreen/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lightBlue/10 rounded-full blur-3xl"></div>
        
        <div className="container-pad text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Descubre el sabor de la calidad Tres Raíces
          </h2>
          
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-cream/90">
            Haz tu pedido hoy y recibe carnes premium directamente en tu puerta.
          </p>

          <div>
            <a 
              href="/menu/guadalajara"
              className="btn bg-mintGreen text-darkPurple hover:bg-cream font-bold px-10 py-5 text-lg rounded-2xl shadow-2xl shadow-mintGreen/50 transition-all hover:scale-105 hover:shadow-mintGreen/70 hover:-translate-y-1 inline-flex"
            >
              Ver menú completo
            </a>
          </div>
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
