import ScrollReveal from "./ScrollReveal";

export default function CTASection() {
  return (
    <section className="section-pad">
      <ScrollReveal>
        <div className="relative bg-darkPurple text-cream py-16 px-4 rounded-3xl mx-auto max-w-7xl shadow-2xl overflow-hidden">
        
        <div className="container-pad text-center space-y-8 relative z-10">
          <div className="text-6xl mb-4 animate-bounce" style={{animationDuration: '2s'}}>🥩</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Descubre el sabor de la <span className="text-yellow-600">calidad premium</span>
          </h2>
          
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-cream/90">
            Haz tu pedido hoy y recibe carnes excepcionales directamente en tu puerta.
          </p>

          <div>
            <a 
              href="/menu/guadalajara"
              className="btn bg-yellow-600 text-white hover:bg-yellow-700 font-bold px-10 py-5 text-lg rounded-2xl shadow-2xl shadow-yellow-800/50 transition-all hover:scale-105 hover:-translate-y-1 inline-flex"
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
