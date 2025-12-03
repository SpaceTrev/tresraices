const valueProps = [
  {
    icon: "🥩",
    title: "Calidad Excepcional",
    description: "Cortes premium seleccionados cuidadosamente de productores de confianza"
  },
  {
    icon: "⚡",
    title: "Entrega 24 Horas",
    description: "Frescura garantizada con envío rápido a tu domicilio en GDL y Colima"
  },
  {
    icon: "🌱",
    title: "Producto Nacional",
    description: "100% mexicano - apoyamos a productores y granjas locales"
  }
];

import ScrollReveal from "./ScrollReveal";

export default function ValueProps() {
  return (
    <section className="section-pad bg-cream">
      <div className="mx-auto max-w-7xl container-pad">
        <ScrollReveal>
          <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple mb-4">
            ¿Por qué elegirnos?
          </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
          {valueProps.map((prop, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white to-cream rounded-full shadow-lg text-4xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-xl">
                {prop.icon}
              </div>
              <h3 className="text-xl font-bold text-darkPurple group-hover:text-yellow-700 transition-colors">
                {prop.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {prop.description}
              </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
