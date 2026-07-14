import { useEffect, useState } from 'react'

function googleSearchUrl(venue) {
  const query = [venue.name, venue.address].filter(Boolean).join(' ')
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

// Builds a wa.me link prefilled with the movie title and venue name.
function whatsappUrl(venue, movieTitle) {
  const number = String(venue.whatsappNumber).replace(/\D/g, '')
  const text = `Hola, estoy interesado en ver "${movieTitle}" en "${venue.name}".`
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export default function WhereToWatchModal({ movie, onClose }) {
  const [expandedId, setExpandedId] = useState(null)
  const venues = movie?.venues ?? []

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const toggle = (id) => setExpandedId((current) => (current === id ? null : id))

  return (
    <div
      className="wtw-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Dónde ver ${movie.title}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="wtw-panel">
        <button type="button" className="wtw-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <p className="wtw-kicker">Dónde ver</p>
        <h2 className="wtw-title">{movie.title}</h2>

        {venues.length === 0 ? (
          <p className="wtw-empty">Aún no hay cines asignados a esta película.</p>
        ) : (
          <ul className="wtw-list">
            {venues.map((venue) => {
              const open = expandedId === venue.id
              return (
                <li key={venue.id} className={`wtw-venue ${open ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="wtw-venue-trigger"
                    onClick={() => toggle(venue.id)}
                    aria-expanded={open}
                  >
                    {venue.logoUrl ? (
                      <img className="wtw-logo" src={venue.logoUrl} alt={venue.name} />
                    ) : (
                      <span className="wtw-logo wtw-logo-fallback" aria-hidden="true">
                        {venue.name.charAt(0)}
                      </span>
                    )}
                    <span className="wtw-venue-name">{venue.name}</span>
                    <span className="wtw-caret" aria-hidden="true">{open ? '▴' : '▾'}</span>
                  </button>

                  {open && (
                    <div className="wtw-contact">
                      {venue.address && <p className="wtw-address">{venue.address}</p>}
                      <div className="wtw-links">
                        {venue.phoneNumber && (
                          <a className="wtw-link" href={`tel:${venue.phoneNumber}`}>
                            Llamar
                          </a>
                        )}
                        {venue.whatsappNumber && (
                          <a
                            className="wtw-link"
                            href={whatsappUrl(venue, movie.title)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            WhatsApp
                          </a>
                        )}
                        {venue.mapsUrl ? (
                          <a className="wtw-link" href={venue.mapsUrl} target="_blank" rel="noreferrer">
                            Ver en Google Maps
                          </a>
                        ) : (
                          <a
                            className="wtw-link"
                            href={googleSearchUrl(venue)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ir a Google
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
