'use client';

import { useState } from 'react';

/**
 * Reservation form collecting client data and displaying critical booking notices.
 * Optimizado para móvil: campos grandes, sin zoom en iOS, checkbox táctil ampliado.
 */
export default function FormularioReserva({
  selectedService,
  selectedBarber,
  selectedDate,
  selectedTime,
  onSubmit,
  isSubmitting,
  error
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [clientError, setClientError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!name.trim()) {
      setClientError('Por favor ingresá tu nombre completo.');
      return;
    }
    if (!phone.trim()) {
      setClientError('Por favor ingresá tu número de WhatsApp para poder contactarte.');
      return;
    }
    if (!acceptedTerms) {
      setClientError('Debés aceptar las condiciones de confirmación y puntualidad.');
      return;
    }

    const dateTimeStr = `${selectedDate}T${selectedTime}:00`;
    onSubmit({
      clientName: name.trim(),
      clientPhone: phone.trim(),
      clientEmail: email.trim() || null,
      serviceId: selectedService.id,
      barberId: selectedBarber ? selectedBarber.id : null,
      dateTime: dateTimeStr,
    });
  };

  const displayError = clientError || error;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Error feedback */}
      {displayError && (
        <div className="error-msg" role="alert">
          ⚠️ {displayError}
        </div>
      )}

      {/* Nombre */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="clientName" className="campo-label">
          Nombre completo *
        </label>
        <input
          id="clientName"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Ana Pérez"
          required
          className="campo-input"
        />
      </div>

      {/* WhatsApp */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="clientPhone" className="campo-label">
          Número de WhatsApp *
        </label>
        <input
          id="clientPhone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+5493837420000 o 3837420000"
          required
          className="campo-input"
        />
        <small style={{ display: 'block', color: '#576574', fontSize: '0.78rem', marginTop: '0.25rem' }}>
          Te enviaremos el recordatorio de confirmación por este medio.
        </small>
      </div>

      {/* Email (opcional) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="clientEmail" className="campo-label">
          Correo electrónico{' '}
          <span style={{ fontWeight: 400, color: '#8395a7' }}>(opcional)</span>
        </label>
        <input
          id="clientEmail"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          className="campo-input"
        />
      </div>

      {/* Condiciones */}
      <div
        style={{
          border: '1px solid var(--color-acento)',
          backgroundColor: '#fffdf0',
          padding: '1rem',
          borderRadius: 'var(--radio-borde)',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          color: 'var(--color-principal)',
        }}
      >
        <h4 style={{ marginBottom: '0.4rem', color: '#b7791f', fontSize: '0.9rem' }}>
          ⚠️ Condiciones de la reserva:
        </h4>
        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
          <li>
            <strong>Confirmación previa:</strong> Recibirás un recordatorio por WhatsApp.
            Es indispensable confirmar; de lo contrario el turno queda liberado.
          </li>
          <li>
            <strong>Puntualidad:</strong> Más de 15 minutos de demora conllevan un{' '}
            <strong>recargo del 20%</strong>.
          </li>
        </ul>
      </div>

      {/* Checkbox de aceptación — área de toque ampliada */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            fontSize: '0.88rem',
            cursor: 'pointer',
            padding: '0.75rem',
            borderRadius: 'var(--radio-borde)',
            backgroundColor: acceptedTerms ? '#f0fff4' : 'var(--color-fondo-secundario)',
            border: acceptedTerms ? '1px solid #68d391' : '1px solid #d1d8e0',
            transition: 'all 0.2s ease',
          }}
        >
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{
              width: '22px',
              height: '22px',
              flexShrink: 0,
              marginTop: '0.05rem',
              accentColor: 'var(--color-acento)',
              cursor: 'pointer',
            }}
          />
          <span>
            Leí y acepto las condiciones sobre confirmación por WhatsApp y el recargo por demora.
          </span>
        </label>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primario"
        style={{ fontSize: '1.1rem' }}
      >
        {isSubmitting ? 'Procesando reserva...' : '✅ Confirmar Reserva'}
      </button>
    </form>
  );
}
