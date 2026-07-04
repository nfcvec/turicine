import { useState } from 'react'
import { Link } from 'react-router-dom'

const fechasImportantes = [
  {
    date: '15 MAR 2026',
    title: 'Apertura de convocatoria',
    tone: 'is-yellow',
  },
  {
    date: '15 MAY 2026',
    title: 'Fin de convocatoria',
    tone: 'is-red',
  },
  {
    date: '8 JUN 2026',
    title: 'Notificacion oficial',
    tone: 'is-cyan',
  },
  {
    date: '5 - 15 AGO 2026',
    title: 'Festival en Quito',
    tone: 'is-purple',
  },
]

const premios = [
  {
    title: 'Mejor pelicula',
    tone: 'award-teal',
  },
  {
    title: 'Mejor cortometraje nacional',
    tone: 'award-gold',
  },
  {
    title: 'Mejor cortometraje estudiantil internacional',
    tone: 'award-violet',
  },
  {
    title: 'Voto del publico',
    tone: 'award-blue',
    featured: true,
  },
]

const redes = [
  {
    name: 'Instagram',
    icon: '/instagram.png',
    href: 'https://www.instagram.com/turicine.ec/',
  },
  {
    name: 'Facebook',
    icon: '/facebook.png',
    href: 'https://www.facebook.com/turicine',
  },
  {
    name: 'LinkedIn',
    icon: '/linkedin.png',
    href: 'https://www.linkedin.com/in/festival-ecuatoriano-turicine-fect-2b2095300/',
  },
]

function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <main className="landing-page" id="home-principal">
      <section className="landing-hero reveal-1">
        <header className="landing-topbar">
          <div className="landing-logo-row">
            <div className="landing-logo" aria-label="Turicine">
              <picture className="logo-picture">
                <source media="(max-width: 900px)" srcSet="/logobl.png" />
                <img src="/logo1.png" alt="Turicine" className="logo-image" />
              </picture>
            </div>

            <button
              type="button"
              className="menu-toggle"
              aria-label="Abrir menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="main-nav"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="menu-toggle-bar" aria-hidden="true" />
              <span className="menu-toggle-bar" aria-hidden="true" />
              <span className="menu-toggle-bar" aria-hidden="true" />
            </button>
          </div>

          <div className="landing-socials" aria-label="Redes sociales">
            {redes.map((red) => (
              <a key={red.name} href={red.href} target="_blank" rel="noreferrer" className="social-link" aria-label={red.name}>
                <img src={red.icon} alt="" className="social-icon" />
              </a>
            ))}
          </div>

          <nav id="main-nav" className={`landing-nav ${isMobileMenuOpen ? 'is-open' : ''}`} aria-label="Menu principal">
            <a href="#home-principal" onClick={closeMobileMenu}>Inicio</a>
            <a href="#sobre" onClick={closeMobileMenu}>Sobre</a>
            <Link to="/catalogo" onClick={closeMobileMenu}>Programacion 7ma edicion</Link>
            <a href="#premios" onClick={closeMobileMenu}>Premios</a>
          </nav>
        </header>

        <div className="hero-grid">
          <div className="hero-copy reveal-2">
            <h1>
              Festival
              <br />
              Turicine
              <span>FECT26</span>
            </h1>

            <p className="hero-lead">El Festival de Cine de Quito</p>

            <p className="hero-date">5 al 15 de agosto de 2026</p>

            <div className="hero-actions">
              <Link to="/catalogo" className="landing-cta cta-hot">
                PROGRAMACIÓN 2026
              </Link>
            </div>
          </div>

          <div className="hero-visual reveal-3">
            <img src="/collage.png" alt="Collage del Festival Turicine" className="hero-collage-image" />
          </div>
        </div>
      </section>

      <section className="about-band reveal-2" id="sobre">
        <div className="about-wrap">
          <article className="about-copy">
            <h2>Sobre el Festival</h2>
            <p>
              El Festival Turicine, organizado por el Grupo Turicine, impulsa y difunde la produccion
              cinematografica ecuatoriana, latinoamericana y del Sur Global. Buscamos expandirnos por
              todo el pais e incentivar la formacion de publicos a traves del cine y la cultura.
            </p>
          </article>

          <aside className="about-side">
            <picture>
              <source media="(max-width: 900px)" srcSet="/logobl.png" />
              <img src="/logo2.png" alt="Imagen del Festival Turicine" className="about-image" />
            </picture>
            <Link to="/info" className="about-cta">
              Conoce más
            </Link>
          </aside>
        </div>
      </section>

      <section className="motif-strip" aria-hidden="true">
        <span className="motif m1" />
        <span className="motif m2" />
        <span className="motif m3" />
        <span className="motif m4" />
        <span className="motif m5" />
        <span className="motif m6" />
        <span className="motif m7" />
        <span className="motif m8" />
        <span className="motif m9" />
        <span className="motif m10" />
      </section>

      <section className="dates-section reveal-3" id="fechas">
        <h2>Fechas importantes</h2>
        <div className="dates-timeline">
          {fechasImportantes.map((item, index) => (
            <div
              key={item.date}
              className={`date-step ${index === fechasImportantes.length - 1 ? 'is-last' : ''}`}
            >
              <article className={`date-card ${item.tone}`}>
                <div className={`date-icon ${index < 3 ? 'is-check' : 'is-highlight'}`} aria-hidden="true">
                  {index < 3 ? <img src="/check.png" alt="" /> : <img src="/calendario.png" alt="" />}
                </div>
                <p className="date-main">{item.date}</p>
                <p>{item.title}</p>
              </article>

              {index < fechasImportantes.length - 1 && (
                <img src="/flecha.png" alt="" className="date-arrow" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="awards-section reveal-4" id="premios">
        <h2 className="awards-title">Premios 2026</h2>

        <div className="awards-grid">
          {premios.map((premio) => (
            <article key={premio.title} className={`award-card ${premio.tone} ${premio.featured ? 'is-featured' : ''}`}>
              <div className="award-laurel-image" aria-hidden="true" />
              <h3>{premio.title}</h3>
            </article>
          ))}
        </div>

        <button type="button" className="awards-cta">
          <span aria-hidden="true">★</span>
          Instrucciones para votar
          <span aria-hidden="true">★</span>
        </button>
      </section>
    </main>
  )
}

export default HomePage
