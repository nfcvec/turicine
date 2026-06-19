import { useEffect, useMemo, useRef, useState } from 'react'

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

const venues = [
  { id: 'teatro-principal', name: 'Teatro Principal', capacity: '850 asientos' },
  { id: 'sala-experimental', name: 'Sala Experimental', capacity: '200 asientos' },
  { id: 'cine-arte', name: 'Cine Arte', capacity: '500 asientos' },
  { id: 'plaza-abierta', name: 'Plaza Abierta', capacity: 'Al aire libre' },
]

const showtimes = {
  'atlas-nublado': {
    'teatro-principal': ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'],
    'sala-experimental': ['11:00 AM', '3:00 PM', '7:00 PM'],
    'cine-arte': ['9:30 AM', '12:30 PM', '4:00 PM', '7:30 PM'],
    'plaza-abierta': ['6:00 PM', '8:30 PM'],
  },
  'circuito-solar': {
    'teatro-principal': ['9:00 AM', '12:00 PM', '3:30 PM', '7:00 PM'],
    'sala-experimental': ['10:00 AM', '2:00 PM', '6:00 PM'],
    'cine-arte': ['11:00 AM', '2:30 PM', '5:00 PM', '8:00 PM'],
    'plaza-abierta': ['7:00 PM', '9:30 PM'],
  },
  'eco-negro': {
    'teatro-principal': ['10:30 AM', '1:00 PM', '4:30 PM', '8:00 PM'],
    'sala-experimental': ['11:30 AM', '3:30 PM', '7:30 PM'],
    'cine-arte': ['10:00 AM', '1:30 PM', '3:30 PM', '7:00 PM'],
    'plaza-abierta': ['5:30 PM', '8:00 PM'],
  },
}

function App() {
  const [activeHero, setActiveHero] = useState(0)
  const [selectedVenue, setSelectedVenue] = useState(null)
  const venuesRef = useRef(null)
  const showtimesRef = useRef(null)

  const featured = useMemo(() => featuredTitles[activeHero], [activeHero])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((current) => (current + 1) % featuredTitles.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const handleHeroClick = () => {
    setTimeout(() => {
      venuesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleVenueSelect = (venueId) => {
    setSelectedVenue(venueId)
    setTimeout(() => {
      showtimesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const currentShowtimes = featured && selectedVenue ? showtimes[featured.id]?.[selectedVenue] : null

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
          <span className="net-brand-mark">T</span>
          <span className="net-brand-name">TURICINE</span>
        </div>
        <nav className="net-nav" aria-label="Menu principal">
          <a href="#inicio">Inicio</a>
          <a href="#sedes">Sedes</a>
          <a href="#horarios">Horarios</a>
          <a href="#info">Información</a>
        </nav>
      </header>

      <section className="hero-net reveal-2" onClick={handleHeroClick}>
        <p className="hero-chip">Festival Turicine 2026</p>
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
            Ver Sedes
          </button>
          <button type="button" className="cta info">
            Más Info
          </button>
        </div>

        <div className="hero-dots" role="tablist" aria-label="Seleccion de películas destacadas">
          {featuredTitles.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`dot ${index === activeHero ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setActiveHero(index)
              }}
              aria-label={`Mostrar ${item.title}`}
              aria-selected={index === activeHero}
            />
          ))}
        </div>
      </section>

      <section className="venues-net reveal-3" id="sedes" ref={venuesRef}>
        <div className="section-content">
          <h2>Selecciona una Sede</h2>
          <p className="section-subtitle">{featured.title} — Elige dónde quieres verla</p>
          
          <div className="venues-grid">
            {venues.map((venue) => (
              <button
                key={venue.id}
                className={`venue-card ${selectedVenue === venue.id ? 'is-selected' : ''}`}
                onClick={() => handleVenueSelect(venue.id)}
              >
                <div className="venue-icon">📍</div>
                <h3>{venue.name}</h3>
                <p className="venue-capacity">{venue.capacity}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedVenue && currentShowtimes && (
        <section className="showtimes-net reveal-4" id="horarios" ref={showtimesRef}>
          <div className="section-content">
            <h2>Horarios Disponibles</h2>
            <p className="section-subtitle">
              {featured.title} — {venues.find((v) => v.id === selectedVenue)?.name}
            </p>

            <div className="showtimes-grid">
              {currentShowtimes.map((time) => (
                <button key={time} className="showtime-card">
                  <span className="time">{time}</span>
                  <span className="availability">Disponible</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
