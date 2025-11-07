export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 -mx-4 sm:-mx-8 md:-mx-16">
      <div className="bg-darkPurple text-cream py-16 px-4">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Descubre el sabor de la calidad Tres Raíces
          </h2>
          
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-cream/80">
            Haz tu pedido hoy y recibe carnes premium directamente en tu puerta.
          </p>

          <div>
            <a 
              href="/menu/guadalajara"
              className="btn bg-mintGreen text-darkPurple hover:bg-cream font-bold px-10 py-5 text-lg rounded-2xl shadow-xl transition-all hover:scale-105 inline-flex"
            >
              Ver menú completo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
