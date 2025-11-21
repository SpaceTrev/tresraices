import ScrollReveal from "./ScrollReveal";

const categories = [
  {
    name: "Res",
    tagline: "Cortes premium de alta calidad",
    emoji: "🥩",
    slug: "Res"
  },
  {
    name: "Cerdo",
    tagline: "Jugosos cortes artesanales",
    emoji: "🥓",
    slug: "Cerdo"
  },
  {
    name: "Aves",
    tagline: "Pollo, pato y pavo frescos",
    emoji: "🍗",
    slug: "Pollo"
  },
  {
    name: "Especialidades",
    tagline: "Búfalo, cordero, conejo y más",
    emoji: "🦌",
    slug: "Búfalo"
  }
];

export default function CategoryShowcase() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl container-pad">
        <ScrollReveal>
          <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple mb-4">
            Categorías Destacadas
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explora nuestra selección de carnes premium, cuidadosamente curadas para tu mesa.
          </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((category, index) => (
            <ScrollReveal key={category.slug} delay={index * 100}>
              <a
                href={`/menu/guadalajara?cat=${encodeURIComponent(category.slug)}`}
                className="card p-6 hover:shadow-2xl transition-all hover:-translate-y-2 group cursor-pointer bg-gradient-to-br from-white to-cream/20 border border-slate-100 hover:border-federalBlue/20 relative overflow-hidden"
              >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-federalBlue/5 to-mintGreen/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>
                <h3 className="text-xl font-bold text-darkPurple mb-2 group-hover:text-federalBlue transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {category.tagline}
                </p>
                <div className="text-federalBlue font-medium text-sm group-hover:underline flex items-center gap-1">
                  Ver productos 
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
