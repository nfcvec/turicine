function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-lime-100 text-slate-800">
      <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-orange-300/40 blur-3xl" />
      <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-lime-300/40 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-orange-200/80 bg-white/85 p-8 shadow-xl backdrop-blur sm:p-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Estamos trabajando en algo para ti
          </div>

          <h1 className="text-balance text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Sitio en construccion
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Muy pronto tendras una nueva experiencia en Turicine. Gracias por tu
            paciencia, estamos afinando cada detalle para recibirte.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-lime-200 bg-lime-50/70 p-4">
              <p className="text-sm font-semibold text-lime-800">Avance actual</p>
              <p className="mt-1 text-slate-700">Diseno y contenido en proceso.</p>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
              <p className="text-sm font-semibold text-orange-800">Gracias por visitar</p>
              <p className="mt-1 text-slate-700">Vuelve pronto para ver novedades.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
