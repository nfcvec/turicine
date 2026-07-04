import { Link } from 'react-router-dom'

const faqs = [
  {
    question: 'Cuando inicia Turicine 2026?',
    answer: 'La apertura oficial sera el 18 de septiembre y la cartelera se extiende por cuatro semanas.',
  },
  {
    question: 'Como compro entradas?',
    answer:
      'Puedes seleccionar titulo, sede y horario desde Catalogo. En una siguiente iteracion se conecta la pasarela de pago.',
  },
  {
    question: 'Hay funciones al aire libre?',
    answer:
      'Si. La sede Plaza Abierta cuenta con funciones nocturnas y actividades especiales de fin de semana.',
  },
]

function InfoPage() {
  return (
    <main className="info-page">
      <header className="info-topbar reveal-1">
        <div className="net-brand" aria-label="Turicine">
          <span className="net-brand-mark">T</span>
          <span className="net-brand-name">TURICINE</span>
        </div>

        <nav className="home-nav" aria-label="Menu principal">
          <Link to="/">Home</Link>
          <Link to="/catalogo">Catalogo</Link>
          <Link to="/info">Info</Link>
        </nav>
      </header>

      <section className="info-hero reveal-2">
        <p className="home-kicker">Info General</p>
        <h1>Todo lo que necesitas para planear tu visita.</h1>
      </section>

      <section className="info-grid reveal-3">
        <article className="info-block">
          <h2>Contacto</h2>
          <p>hola@turicine.com</p>
          <p>+57 300 000 0000</p>
        </article>

        <article className="info-block">
          <h2>Sedes principales</h2>
          <p>Teatro Principal</p>
          <p>Sala Experimental</p>
          <p>Cine Arte</p>
          <p>Plaza Abierta</p>
        </article>

        <article className="info-block">
          <h2>Preguntas frecuentes</h2>
          {faqs.map((item) => (
            <div key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </article>
      </section>
    </main>
  )
}

export default InfoPage
