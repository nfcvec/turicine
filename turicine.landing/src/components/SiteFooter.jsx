import { useEffect, useState } from 'react'
import { redes } from '../lib/socials'
import { fetchSponsors } from '../lib/sponsors'

// Shared festival footer used by Home and Info.
export default function SiteFooter() {
  const [sponsors, setSponsors] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    fetchSponsors(controller.signal)
      .then((data) => setSponsors(Array.isArray(data) ? data : []))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return (
    <footer className="home-footer">
      {sponsors.length > 0 && (
        <section className="sponsor-strip" aria-label="Auspiciantes">
          <p className="sponsor-strip-title">Auspiciantes</p>
          <div className="sponsor-marquee">
            {/* Duplicated track for a seamless, automatic loop. */}
            <ul className="sponsor-track" aria-hidden="false">
              {sponsors.map((sponsor, index) => (
                <li key={`a-${index}`} className="sponsor-item">
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="sponsor-logo" loading="lazy" />
                </li>
              ))}
            </ul>
            <ul className="sponsor-track" aria-hidden="true">
              {sponsors.map((sponsor, index) => (
                <li key={`b-${index}`} className="sponsor-item">
                  <img src={sponsor.logoUrl} alt="" className="sponsor-logo" loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="home-footer-main">
        <div className="footer-brand">
          <p>TURICINE</p>
          <span>Festival de Cine de Quito · FECT26</span>
        </div>

        <div className="footer-contact">
          <p>Contacto</p>
          <a href="mailto:presidencia@turicine.ec">presidencia@turicine.ec</a>
        </div>

        <div className="footer-socials" aria-label="Redes sociales de Turicine">
          <p>Síguenos</p>
          <div>
            {redes.map((red) => (
              <a key={red.name} href={red.href} target="_blank" rel="noreferrer" aria-label={red.name}>
                <img src={red.icon} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="home-footer-bottom">
        <p>© 2026 TURICINE. Todos los derechos reservados.</p>
        <p>Cine en todas partes, cine para todos.</p>
      </div>
    </footer>
  )
}
