import Image from "next/image";
import Link from "next/link";

const FEATURED_SERVICES = [
  { id: 1, nombre: 'Corte de caballero', duracion: '30 min', precio: '$ 0' },
  { id: 2, nombre: 'Corte de dama', duracion: '45 min', precio: '$ 0' },
  { id: 3, nombre: 'Corte de niño', duracion: '30 min', precio: '$ 0' },
  { id: 4, nombre: 'Color completo', duracion: '120 min', precio: '$ 0' },
  { id: 5, nombre: 'Brushing / peinado', duracion: '45 min', precio: '$ 0' },
  { id: 6, nombre: 'Corte y barba', duracion: '60 min', precio: '$ 0' },
];

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-fondo)',
          borderBottom: '1px solid var(--color-fondo-secundario)',
          boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.65rem 1rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Image
              src="/img/logo.svg"
              alt="Logo de Cortes Relativos con ilustración inspirada en Einstein y elementos de peluquería"
              width={40}
              height={40}
              style={{ width: '36px', height: 'auto' }}
            />
            <span
              style={{
                fontFamily: 'var(--fuente-titulos)',
                fontSize: '1.3rem',
                color: 'var(--color-principal)',
              }}
            >
              Cortes Relativos
            </span>
          </Link>

          <Link
            href="/turnos"
            style={{
              backgroundColor: 'var(--color-acento)',
              color: 'var(--color-principal)',
              padding: '0.55rem 1.1rem',
              fontSize: '0.9rem',
              fontWeight: '700',
              borderRadius: 'var(--radio-borde)',
              boxShadow: '0 2px 8px rgba(241, 196, 15, 0.3)',
              whiteSpace: 'nowrap',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Reservar
          </Link>
        </div>
      </nav>

      {/* ── Marquee Editorial Continuo (Bexa Motion) ── */}
      <aside className="ticker-container" aria-label="Información destacada">
        <div className="ticker-track">
          <div className="ticker-item"><span className="ticker-dot"></span> ATENCIÓN PERSONALIZADA EN TINOGASTA</div>
          <div className="ticker-item"><span className="ticker-dot"></span> DISPONIBILIDAD EN TIEMPO REAL</div>
          <div className="ticker-item"><span className="ticker-dot"></span> CONFIRMACIÓN INSTANTÁNEA POR WHATSAPP</div>
          <div className="ticker-item"><span className="ticker-dot"></span> EXPERTOS EN ESTILO & BARBERÍA</div>
          {/* Duplicado para loop infinito fluido */}
          <div className="ticker-item"><span className="ticker-dot"></span> ATENCIÓN PERSONALIZADA EN TINOGASTA</div>
          <div className="ticker-item"><span className="ticker-dot"></span> DISPONIBILIDAD EN TIEMPO REAL</div>
          <div className="ticker-item"><span className="ticker-dot"></span> CONFIRMACIÓN INSTANTÁNEA POR WHATSAPP</div>
          <div className="ticker-item"><span className="ticker-dot"></span> EXPERTOS EN ESTILO & BARBERÍA</div>
        </div>
      </aside>


      {/* ── Hero ── */}
      <header
        style={{
          padding: '2.5rem 1.25rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div className="logo-lightning-wrapper">
          <Image
            src="/img/logo.svg"
            alt="Logo de Cortes Relativos con ilustración inspirada en Einstein y elementos de peluquería"
            width={200}
            height={200}
            priority
            style={{ width: '160px', height: 'auto', display: 'block' }}
          />
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            color: 'var(--color-principal)',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
          }}
        >
          Tu estilo, relativamente perfecto
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: '#576574',
            maxWidth: '560px',
            lineHeight: '1.6',
            marginBottom: '1.75rem',
            padding: '0 0.5rem',
          }}
        >
          Peluquería en Tinogasta, Catamarca. Elegí tu servicio, tu estilista y
          reservá tu horario online sin esperas.
        </p>

        <Link
          href="/turnos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-acento)',
            color: 'var(--color-principal)',
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            borderRadius: 'var(--radio-borde)',
            boxShadow: '0 4px 14px rgba(241, 196, 15, 0.35)',
            minHeight: '52px',
            width: '100%',
            maxWidth: '340px',
          }}
        >
          ✂️ Reservar Turno Ahora
        </Link>
      </header>

      {/* ── Aviso cómo funciona ── */}
      <section
        style={{
          maxWidth: '860px',
          width: '100%',
          margin: '0 auto',
          padding: '0 1rem 0',
        }}
      >
        <div className="aviso" style={{ fontSize: '0.9rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            💡 ¿Cómo funciona el sistema de reservas?
          </h3>
          <ol style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: 2 }}>
            <li>
              <strong>Elegí tu turno</strong> con al menos{' '}
              <strong>10 horas de anticipación</strong>.
            </li>
            <li>
              <strong>Confirmá por WhatsApp:</strong> te avisaremos antes del turno.
              Sin confirmación, el turno puede liberarse.
            </li>
            <li>
              <strong>Puntualidad:</strong> demoras de más de 15 minutos tienen un
              adicional del 20%.
            </li>
          </ol>
        </div>
      </section>

      {/* ── Servicios ── */}
      <main
        style={{
          maxWidth: '860px',
          width: '100%',
          margin: '0 auto',
          padding: '1.75rem 1rem 3rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            color: 'var(--color-principal)',
            textAlign: 'center',
            marginBottom: '1.25rem',
          }}
        >
          Nuestros Servicios
        </h2>

        <div className="grid-servicios">
          {FEATURED_SERVICES.map((serv) => (
            <div
              key={serv.id}
              style={{
                backgroundColor: 'var(--color-fondo)',
                border: '1px solid #d1d8e0',
                borderRadius: 'var(--radio-borde)',
                padding: '1rem',
                boxShadow: '0 2px 6px rgba(44, 62, 80, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-principal)', marginBottom: '0.25rem' }}>
                  {serv.nombre}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#576574' }}>
                  ⏱️ {serv.duracion}
                </span>
              </div>
              <div
                style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.6rem',
                  borderTop: '1px dashed #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: '700', color: 'var(--color-principal)', fontSize: '0.9rem' }}>
                  {serv.precio}{' '}
                  <small style={{ fontWeight: '400', color: '#8395a7', fontSize: '0.7rem' }}>
                    (prov.)
                  </small>
                </span>
                <Link
                  href="/turnos"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--color-principal)',
                    textDecoration: 'underline',
                  }}
                >
                  Agendar →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA al pie de servicios */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            href="/turnos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-principal)',
              color: 'white',
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: 'var(--radio-borde)',
              minHeight: '48px',
            }}
          >
            Ver disponibilidad y reservar →
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: 'var(--color-principal)',
          color: 'white',
          padding: '2rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '1.4rem', letterSpacing: '1px' }}>
          CORTES RELATIVOS
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-acento)', marginTop: '0.25rem' }}>
          &quot;Tu estilo, relativamente perfecto.&quot;
        </p>
        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.75rem' }}>
          Tinogasta, Catamarca • Martes a Sábados de 09:00 a 13:00 y 15:00 a 23:00 hs
        </p>
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          * Los precios indicados son provisorios ($0) según documentación. •{' '}
          <Link href="/admin" style={{ color: '#cbd5e1', textDecoration: 'underline' }}>
            Acceso Administración
          </Link>
        </p>
      </footer>
    </div>
  );
}
