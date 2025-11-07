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
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple mb-4">
            Categorías Destacadas
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explora nuestra selección de carnes premium, cuidadosamente curadas para tu mesa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`/menu/guadalajara?cat=${encodeURIComponent(category.slug)}`}
              className="card p-6 hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {category.emoji}
              </div>
              <h3 className="text-xl font-bold text-darkPurple mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {category.tagline}
              </p>
              <div className="text-federalBlue font-medium text-sm group-hover:underline">
                Ver productos →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
