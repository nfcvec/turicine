import { useEffect, useRef, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { submitLead } from '../lib/leads'

const alianzas = [
  {
    audience: 'Marcas & empresas privadas',
    title: 'Auspicio Corporativo',
    description:
      'Asociación con un proyecto cultural de alto valor simbólico. Presencia de marca en sedes, piezas gráficas y audiovisuales, activaciones durante el festival, naming de secciones o actividades, e integración en experiencias culturales reales. Una estrategia de RSC que tiene impacto visible y medible.',
    action: 'Conversemos',
    tone: 'is-gold',
    subject: 'Alianza corporativa con TURICINE',
  },
  {
    audience: 'Instituciones & organismos públicos',
    title: 'Apoyo Institucional',
    description:
      'TURICINE es un aliado estratégico para gestión cultural con resultados visibles. Cumplimiento de objetivos culturales y educativos, fortalecimiento de políticas públicas, acceso a públicos diversos y territorios, visibilidad institucional con impacto social, y articulación con procesos formativos y comunitarios.',
    action: 'Explorar alianza',
    tone: 'is-blue',
    subject: 'Alianza institucional con TURICINE',
  },
  {
    audience: 'Comunidad & voluntarios',
    title: 'Únete al Equipo',
    description:
      '¿Amas el cine? ¿Buscas experiencia real en gestión cultural, producción de eventos o comunicación? TURICINE abre sus puertas a personas con energía, compromiso y pasión por la cultura. Esta es tu oportunidad de ser parte de algo que transforma comunidades.',
    action: 'Quiero participar',
    tone: 'is-green',
    subject: 'Quiero participar con TURICINE',
  },
]

function InfoPage() {
  const [activeAlliance, setActiveAlliance] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [sent, setSent] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (activeAlliance && dialog && !dialog.open) {
      setSent(false)
      setFormError(null)
      dialog.showModal()
    }
  }, [activeAlliance])

  const closeForm = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close()
    }

    setActiveAlliance(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const payload = {
      fullName: data.get('name'),
      email: data.get('email'),
      message: data.get('comment') || null,
      topic: activeAlliance?.audience || null,
    }

    setFormError(null)
    setSubmitting(true)
    try {
      await submitLead(payload)
      setSent(true)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="info-page">
      <SiteHeader />
      <div className="info-content">
        <section className="info-hero reveal-1" aria-labelledby="alliances-title">
          <p className="info-kicker">Alianzas estratégicas</p>
          <h1 id="alliances-title">Construye cultura con nosotros.</h1>
          <p className="info-lead">
            Cada alianza se diseña: <strong>a la medida del aliado.</strong>
          </p>
        </section>

        <section className="alliances-grid reveal-2" aria-label="Opciones de alianza con Turicine">
          {alianzas.map((alianza) => (
            <article key={alianza.title} className={`alliance-card ${alianza.tone}`}>
              <div className="alliance-card-body">
                <p className="alliance-chip">{alianza.audience}</p>
                <h2>{alianza.title}</h2>
                <p className="alliance-description">{alianza.description}</p>
              </div>

              <button
                type="button"
                className="alliance-action"
                onClick={() => setActiveAlliance(alianza)}
              >
                {alianza.action} <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </section>
      </div>

      <dialog
        ref={dialogRef}
        className="alliance-dialog"
        aria-labelledby="alliance-form-title"
        onClose={() => setActiveAlliance(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeForm()
        }}
      >
        <div className="alliance-dialog-panel">
          <button type="button" className="dialog-close" onClick={closeForm} aria-label="Cerrar formulario">
            ×
          </button>

          <p className="dialog-kicker">{activeAlliance?.audience}</p>

          {sent ? (
            <>
              <h2 id="alliance-form-title">¡Mensaje enviado!</h2>
              <p className="dialog-intro">
                Gracias por tu interés. Nos pondremos en contacto contigo pronto.
              </p>
              <button type="button" className="dialog-submit" onClick={closeForm}>
                Cerrar
              </button>
            </>
          ) : (
            <>
              <h2 id="alliance-form-title">Hablemos de tu alianza</h2>
              <p className="dialog-intro">
                Déjanos tus datos y cuéntanos cómo te gustaría ser parte de TURICINE.
              </p>

              <form className="alliance-form" onSubmit={handleSubmit}>
                {formError && <p className="dialog-error">{formError}</p>}

                <label htmlFor="alliance-name">
                  Nombre <span aria-hidden="true">*</span>
                </label>
                <input id="alliance-name" name="name" type="text" autoComplete="name" required autoFocus />

                <label htmlFor="alliance-email">
                  Correo <span aria-hidden="true">*</span>
                </label>
                <input id="alliance-email" name="email" type="email" autoComplete="email" required />

                <label htmlFor="alliance-comment">Comentario <small>(opcional)</small></label>
                <textarea id="alliance-comment" name="comment" rows="4" />

                <p className="required-note">* Campos requeridos</p>
                <button type="submit" className="dialog-submit" disabled={submitting}>
                  {submitting ? 'Enviando…' : 'Enviar mensaje'} <span aria-hidden="true">→</span>
                </button>
              </form>
            </>
          )}
        </div>
      </dialog>

      <a
        className="whatsapp-float"
        href={`https://wa.me/593992538869?text=${encodeURIComponent('Hola, quiero más información.')}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Solicitar más información por WhatsApp"
      >
        <span className="whatsapp-tooltip" aria-hidden="true">Hola, quiero más información</span>
        <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.04 3A12.84 12.84 0 0 0 5.18 22.7L3.5 29l6.45-1.7A12.92 12.92 0 1 0 16.04 3Zm0 23.67c-1.9 0-3.76-.5-5.39-1.45l-.39-.23-3.83 1 1.02-3.72-.25-.4a10.69 10.69 0 1 1 8.84 4.8Zm5.86-8c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.71.16-.21.32-.82 1.05-1 1.27-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58a9.62 9.62 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.25-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.42 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.14-.29-.22-.61-.38Z"
          />
        </svg>
      </a>

      <SiteFooter />
    </main>
  )
}

export default InfoPage
