import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

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
    title: 'Notificación oficial',
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
    title: 'Mejor película',
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
    title: 'Voto del público',
    tone: 'award-blue',
    featured: true,
  },
]

const pasosVotacion = [
  'Sigue la cuenta oficial de TURICINE en Instagram.',
  'Busca la publicación de la película o cortometraje y dale "Me gusta (❤️)".',
  'Comenta en esa misma publicación el nombre de la película o cortometraje.',
]

const criteriosValidacion = [
  'El usuario sigue la cuenta oficial de TURICINE.',
  'La publicación correspondiente tiene el "Me gusta (❤️)" del usuario.',
  'Existe un comentario del usuario mencionando el nombre de la película o cortometraje.',
]

function HomePage() {
  return (
    <main className="landing-page" id="home-principal">
      <section className="landing-hero reveal-1">
        <SiteHeader />

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
              El Festival TURICINE es una plataforma cultural dedicada a impulsar, exhibir y fortalecer el cine de ficción ecuatoriano,
              latinoamericano y del Sur Global. A través de proyecciones, actividades formativas y espacios de industria, promovemos el
              encuentro entre cineastas, instituciones, marcas y público, llevando nuestra visión de cine en todas partes, cine para todos a
              cada vez más territorios.
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
        <h2>Nuestro Camino al Festival</h2>
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

        <section className="public-vote-panel" aria-labelledby="public-vote-title">
          <h3 id="public-vote-title">¿Cómo votar por el Premio del Público?</h3>

          <ol className="public-vote-steps" aria-label="Pasos para votar">
            {pasosVotacion.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>

          <details className="public-vote-details">
            <summary>Ver criterios de validación del voto</summary>
            <ul>
              {criteriosValidacion.map((criterio) => (
                <li key={criterio}>{criterio}</li>
              ))}
            </ul>
            <p>
              Una vez verificados estos tres requisitos, el voto será considerado válido para el conteo del Premio del Público.
            </p>
          </details>
        </section>
      </section>

      <SiteFooter />
    </main>
  )
}

export default HomePage
