import { useEffect, useMemo, useState } from 'react'

const featuredTitles = [
  {
    id: 'atlas-nublado',
    title: 'Atlas Nublado',
    year: 2026,
    age: '16+',
    duration: '2h 11m',
    genre: 'Sci-Fi Drama',
    description:
      'Una cartografa descubre que un mapa de tormentas predice desapariciones en toda la costa del Pacifico.',
    backdrop:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 'circuito-solar',
    title: 'Circuito Solar',
    year: 2025,
    age: '13+',
    duration: '1h 48m',
    genre: 'Action',
    description:
      'Un grupo de bailarines urbanos entra a una liga clandestina donde cada ronda se decide con coreografia y estrategia.',
    backdrop:
      'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 'eco-negro',
    title: 'Eco Negro',
    year: 2024,
    age: '18+',
    duration: '2h 03m',
    genre: 'Thriller',
    description:
      'Un podcaster investiga un teatro abandonado donde cada grabacion trae voces de un crimen nunca resuelto.',
    backdrop:
      'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1800&q=80',
  },
]

const rows = [
  {
    id: 'solo-en-home',
    label: 'Solo en Turicine',
    movies: [
      {
        title: 'Black Sunrise',
        subtitle: 'Nueva temporada',
        image:
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'You Are Here',
        subtitle: 'Trending #2',
        image:
          'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Cobra Line',
        subtitle: 'Top 10',
        image:
          'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Neon District',
        subtitle: 'Estreno',
        image:
          'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Gran Viaje',
        subtitle: 'Popular',
        image:
          'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    id: 'para-ti',
    label: 'Recomendadas para ti',
    movies: [
      {
        title: 'Avenida Cero',
        subtitle: 'Suspenso',
        image:
          'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Tiempo Circular',
        subtitle: 'Drama',
        image:
          'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Noches Azules',
        subtitle: 'Romance',
        image:
          'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Ritmo 404',
        subtitle: 'Musical',
        image:
          'https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Terminal Norte',
        subtitle: 'Crimen',
        image:
          'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
]

function App() {
  const [activeHero, setActiveHero] = useState(0)
  const featured = useMemo(() => featuredTitles[activeHero], [activeHero])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((current) => (current + 1) % featuredTitles.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="net-shell" id="inicio">
      <div
        className="net-backdrop"
        style={{ backgroundImage: `url(${featured.backdrop})` }}
        aria-hidden="true"
      />
      <div className="net-overlay" aria-hidden="true" />

      <header className="net-topbar reveal-1">
        <div className="net-brand" aria-label="Turicine Home">
          <span className="net-brand-mark">N</span>
          <span className="net-brand-name">TURICINE</span>
        </div>
        <nav className="net-nav" aria-label="Menu principal">
          <a href="#inicio">Home</a>
          <a href="#series">Shows</a>
          <a href="#peliculas">Movies</a>
          <a href="#juegos">Games</a>
          <a href="#mi-lista">My Netflix</a>
        </nav>
      </header>

      <section className="hero-net reveal-2">
        <p className="hero-chip">Only on Turicine</p>
        <h1>{featured.title}</h1>
        <p className="hero-meta">
          <span>{featured.genre}</span>
          <span>{featured.year}</span>
          <span>{featured.duration}</span>
          <span>{featured.age}</span>
        </p>
        <p className="hero-description">{featured.description}</p>
        <div className="hero-actions">
          <button type="button" className="cta play">
            Play
          </button>
          <button type="button" className="cta info">
            More Info
          </button>
        </div>

        <div className="hero-dots" role="tablist" aria-label="Seleccion de destacadas">
          {featuredTitles.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`dot ${index === activeHero ? 'is-active' : ''}`}
              onClick={() => setActiveHero(index)}
              aria-label={`Mostrar ${item.title}`}
              aria-selected={index === activeHero}
            />
          ))}
        </div>
      </section>

      <section className="rows-net" id="peliculas">
        {rows.map((row, rowIndex) => (
          <article className={`movie-row reveal-${Math.min(4, rowIndex + 2)}`} key={row.id}>
            <h2>{row.label}</h2>
            <div className="movie-track">
              {row.movies.map((movie) => (
                <div className="movie-card" key={movie.title}>
                  <img src={movie.image} alt={movie.title} loading="lazy" />
                  <div className="movie-overlay">
                    <p>{movie.title}</p>
                    <span>{movie.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
