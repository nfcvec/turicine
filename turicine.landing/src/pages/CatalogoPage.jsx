import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCatalog } from '../lib/catalog'
import { formatDuration } from '../lib/format'
import WhereToWatchModal from '../components/WhereToWatchModal'

function pickInitial(movies) {
  // Prefer the first movie that has an image so the hero looks intentional.
  return movies.find((movie) => movie.images.length > 0) ?? movies[0] ?? null
}

function CatalogoPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null) // null = "Todas"
  const [chipsOpen, setChipsOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [whereOpen, setWhereOpen] = useState(false)
  const [synopsisExpanded, setSynopsisExpanded] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchCatalog(controller.signal)
      .then((data) => {
        const cats = data?.categories ?? []
        // Attach the category name to each movie so the hero and cards can use it.
        const decorated = cats.map((category) => ({
          ...category,
          movies: category.movies.map((movie) => ({ ...movie, categoryName: category.name })),
        }))
        setCategories(decorated)
        setSelected(pickInitial(decorated.flatMap((c) => c.movies)))
        setError(null)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const visibleMovies = useMemo(() => {
    if (activeCategory === null) return categories.flatMap((c) => c.movies)
    return categories.find((c) => c.id === activeCategory)?.movies ?? []
  }, [categories, activeCategory])

  const featured = selected ?? null
  const backdrop = featured?.images?.[0]
  const heroDuration = useMemo(
    () => (featured ? formatDuration(featured.durationSeconds) : ''),
    [featured],
  )

  const activeLabel =
    activeCategory === null
      ? 'Todas'
      : categories.find((c) => c.id === activeCategory)?.name ?? 'Todas'

  const chooseCategory = (categoryId) => {
    setActiveCategory(categoryId)
    setChipsOpen(false)
  }

  const handleSelect = (movie) => {
    setSelected(movie)
    setSynopsisExpanded(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="net-shell" id="catalogo">
      <div
        className="net-backdrop"
        style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
        aria-hidden="true"
      />
      <div className="net-overlay" aria-hidden="true" />

      <header className="net-topbar reveal-1">
        <Link to="/" className="net-logo" aria-label="Turicine inicio">
          <picture className="logo-picture">
            <source media="(max-width: 900px)" srcSet="/logobl.png" />
            <img src="/logo1.png" alt="Turicine" className="logo-image" />
          </picture>
        </Link>
        <nav className="net-nav" aria-label="Menu principal">
          <Link to="/">Volver al inicio</Link>
        </nav>
      </header>

      {loading && <p className="catalog-status">Cargando catálogo…</p>}
      {error && !loading && <p className="catalog-status catalog-error">{error}</p>}

      {!loading && !error && featured && (
        <section className="hero-net reveal-2">
          <p className="hero-chip">{featured.categoryName}</p>
          <h1>{featured.title}</h1>
          <p className="hero-meta">
            {heroDuration && <span>{heroDuration}</span>}
            {featured.directors && <span>{featured.directors}</span>}
          </p>
          {featured.synopsis && (
            <div className="hero-synopsis">
              <p
                id="hero-synopsis-text"
                className={`hero-description ${synopsisExpanded ? 'is-expanded' : ''}`}
              >
                {featured.synopsis}
              </p>
              <button
                type="button"
                className="hero-synopsis-toggle"
                onClick={() => setSynopsisExpanded((expanded) => !expanded)}
                aria-expanded={synopsisExpanded}
                aria-controls="hero-synopsis-text"
                aria-label={synopsisExpanded ? 'Contraer sinopsis' : 'Ver sinopsis completa'}
              >
                <span aria-hidden="true">⌄</span>
              </button>
            </div>
          )}
          <div className="hero-actions">
            <button type="button" className="cta info" onClick={() => setWhereOpen(true)}>
              Dónde ver
            </button>
          </div>
        </section>
      )}

      {whereOpen && featured && (
        <WhereToWatchModal movie={featured} onClose={() => setWhereOpen(false)} />
      )}

      {!loading && !error && (
        <section className="catalog-browse reveal-3">
          <div className="catalog-selector">
            <button
              type="button"
              className="catalog-chips-toggle"
              onClick={() => setChipsOpen((open) => !open)}
              aria-expanded={chipsOpen}
              aria-label="Elegir categoría"
            >
              {activeLabel}
              <span className="catalog-chips-caret" aria-hidden="true">▾</span>
            </button>
            <div
              className={`catalog-chips ${chipsOpen ? 'is-open' : ''}`}
              role="tablist"
              aria-label="Categorías"
            >
              <button
                type="button"
                className={`catalog-chip ${activeCategory === null ? 'is-active' : ''}`}
                onClick={() => chooseCategory(null)}
                aria-selected={activeCategory === null}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`catalog-chip ${activeCategory === category.id ? 'is-active' : ''}`}
                  onClick={() => chooseCategory(category.id)}
                  aria-selected={activeCategory === category.id}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-track">
            {visibleMovies.map((movie) => {
              const poster = movie.images?.[0]
              const isActive = featured?.id === movie.id
              return (
                <button
                  type="button"
                  key={movie.id}
                  className={`movie-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelect(movie)}
                  aria-label={`Mostrar ${movie.title}`}
                >
                  {poster ? (
                    <img className="movie-card-img" src={poster} alt={movie.title} loading="lazy" />
                  ) : (
                    <span className="movie-card-placeholder" aria-hidden="true" />
                  )}
                  <span className="movie-card-title">{movie.title}</span>
                </button>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}

export default CatalogoPage
