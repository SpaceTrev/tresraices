export default function HomePage() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Carne selecta a domicilio</h1>
        <p className="text-lg">Menús y precios siempre actualizados según nuestra lista mayorista. Elige tu ciudad y haz tu pedido por WhatsApp.</p>
        <div className="flex gap-3">
          <a className="btn btn-primary" href="/menu/guadalajara">Guadalajara</a>
          <a className="btn btn-primary" href="/menu/colima">Colima</a>
        </div>
        <div className="text-sm opacity-70">Precios sujetos a cambio sin previo aviso. Última actualización visible en cada menú.</div>
      </div>
      <div className="card p-6">
        <img src="/flyer-1.jpg" className="rounded-xl" alt="Flyer" />
      </div>
    </section>
  );
}
