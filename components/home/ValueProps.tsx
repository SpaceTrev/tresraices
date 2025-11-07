const valueProps = [
  {
    icon: "🐄",
    title: "Cortes Premium",
    description: "Solo la mejor calidad de productores seleccionados"
  },
  {
    icon: "🚚",
    title: "Entrega Rápida",
    description: "Envíos en 24 horas a Guadalajara y Colima"
  },
  {
    icon: "🇲🇽",
    title: "Hecho en México",
    description: "Apoyamos a productores y granjas locales"
  }
];

export default function ValueProps() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-cream">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple mb-4">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
          {valueProps.map((prop, index) => (
            <div 
              key={index}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md text-4xl">
                {prop.icon}
              </div>
              <h3 className="text-xl font-bold text-darkPurple">
                {prop.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
