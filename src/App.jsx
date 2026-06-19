function App() {
  return (
    <main className="festival-shell">
      <div className="festival-noise" aria-hidden="true" />

      <div className="festival-frame">
        <header className="festival-topbar reveal-1">
          <div className="brand">
            <span className="brand-main">TURICINE</span>
            <span className="brand-sub">FEST</span>
          </div>
          <nav className="festival-nav" aria-label="Menu principal">
            <a href="#inicio">Inicio</a>
            <a href="#sobre">Sobre</a>
            <a href="#convocatoria">Convocatoria 2026</a>
            <a href="#categorias">Categorias</a>
            <a href="#premios">Premios</a>
            <a href="#mas">Mas</a>
          </nav>
        </header>

        <section className="hero" id="inicio">
          <div className="hero-copy reveal-2">
            <p className="edition-tag">Edicion 2026</p>
            <h1>
              Festival
              <span>Turicine 2026</span>
            </h1>
            <p className="hero-description">
              Cine curatorial latinoamericano y del Sur Global en Quito.
              Encuentros, creacion y mirada cultural.
            </p>
            <p className="hero-date">5 al 15 de agosto 2026</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#convocatoria">Postular pelicula</a>
              <a className="btn btn-outline" href="#sobre">Conocer el festival</a>
            </div>
          </div>

          <div className="hero-panel reveal-3" aria-hidden="true">
            <div className="panel-cut panel-cut-red" />
            <div className="panel-cut panel-cut-gold" />
            <div className="panel-grid" />
          </div>
        </section>

        <section className="paper-strip reveal-2" id="sobre">
          <h2>Sobre el festival</h2>
          <p>
            Turicine impulsa cine de produccion curatorial, latinoamericana y del
            Sur Global. Creamos un espacio para descubrir voces, formar publico y
            conectar cultura con comunidad.
          </p>
        </section>

        <section className="dates-block" id="convocatoria">
          <h2 className="reveal-3">Fechas importantes</h2>
          <div className="dates-grid">
            <article className="date-card reveal-3">
              <p className="date">15 mar 2026</p>
              <p>Apertura de convocatoria</p>
            </article>
            <article className="date-card reveal-4">
              <p className="date">15 may 2026</p>
              <p>Fin de convocatoria</p>
            </article>
            <article className="date-card reveal-4">
              <p className="date">8 jun 2026</p>
              <p>Notificacion oficial</p>
            </article>
            <article className="date-card reveal-4">
              <p className="date">5 - 15 ago 2026</p>
              <p>Festival en Quito</p>
            </article>
          </div>
        </section>

        <section className="category-strip" id="categorias">
          <h2>Categorias competitivas 2026</h2>
          <div className="category-list">
            <span>Largometraje ficcion</span>
            <span>Documental de autor</span>
            <span>Cortometraje experimental</span>
            <span>Nuevas voces andinas</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
