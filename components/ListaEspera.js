'use client';

import { useState } from 'react';

/**
 * Waitlist component. Mobile-first: campos grandes, sin zoom en iOS.
 */
export default function ListaEspera({ services = [], onJoined }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim()) {
      setError('Por favor completá tu nombre y número de WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'waitlist',
          clientName: name.trim(),
          clientPhone: phone.trim(),
          serviceId: parseInt(serviceId, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No pudimos registrarte en la lista de espera.');
      }

      setSubmitted(true);
      if (onJoined) onJoined(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          backgroundColor: '#e6fffa',
          border: '1px solid #38b2ac',
          borderRadius: 'var(--radio-borde)',
          padding: '1.5rem',
          textAlign: 'center',
          color: '#234e52',
        }}
      >
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</p>
        <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
          ¡Anotado en la lista de espera!
        </h4>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
          En cuanto se libere un turno para el servicio elegido, te contactaremos
          automáticamente por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <details
      style={{
        backgroundColor: 'var(--color-fondo-secundario)',
        border: '1px dashed #b2bec3',
        borderRadius: 'var(--radio-borde)',
      }}
    >
      <summary
        style={{
          padding: '1rem 1.25rem',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.95rem',
          color: 'var(--color-principal)',
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          userSelect: 'none',
          minHeight: '52px',
        }}
      >
        ⏳ ¿No encontrás un horario disponible? <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#8395a7' }}>Lista de espera ›</span>
      </summary>

      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#576574', marginBottom: '1rem' }}>
          Anotate y te avisamos de inmediato si otro cliente libera su lugar.
        </p>

        {error && (
          <div className="error-msg" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1rem' }}>
            <div>
              <label
                htmlFor="wl-name"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem' }}
              >
                Nombre *
              </label>
              <input
                id="wl-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                className="campo-input"
              />
            </div>

            <div>
              <label
                htmlFor="wl-phone"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem' }}
              >
                WhatsApp *
              </label>
              <input
                id="wl-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Tu número de WhatsApp"
                required
                className="campo-input"
              />
            </div>

            <div>
              <label
                htmlFor="wl-service"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem' }}
              >
                Servicio deseado
              </label>
              <select
                id="wl-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="campo-input"
                style={{ backgroundColor: 'white' }}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} ({s.duracion_minutos} min)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: 'var(--color-principal)',
              color: 'white',
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: 'var(--radio-borde)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              minHeight: '48px',
              border: 'none',
            }}
          >
            {isSubmitting ? 'Anotando...' : '📋 Anotarme en lista de espera'}
          </button>
        </form>
      </div>
    </details>
  );
}
