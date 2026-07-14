import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { redes } from '../lib/socials'

// Shared festival navbar used by Home and Info. Section links point to the home
// page anchors (`/#...`) so they work from any route.
export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined
    const closeMenuWithEscape = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', closeMenuWithEscape)
    return () => window.removeEventListener('keydown', closeMenuWithEscape)
  }, [isMobileMenuOpen])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="landing-topbar">
      <div className="landing-logo-row">
        <Link to="/" className="landing-logo" aria-label="Turicine inicio">
          <picture className="logo-picture">
            <source media="(max-width: 900px)" srcSet="/logobl.png" />
            <img src="/logo1.png" alt="Turicine" className="logo-image" />
          </picture>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
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

      <nav id="main-nav" className={`landing-nav ${isMobileMenuOpen ? 'is-open' : ''}`} aria-label="Menú principal">
        <a href="/#home-principal" onClick={closeMobileMenu}>Inicio</a>
        <a href="/#sobre" onClick={closeMobileMenu}>Sobre</a>
        <Link to="/catalogo" onClick={closeMobileMenu}>Programación 7ma edición</Link>
        <a href="/#premios" onClick={closeMobileMenu}>Premios</a>
      </nav>
    </header>
  )
}
