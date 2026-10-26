'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ConfirmarContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('No se especificó un turno para consultar.');
      setIsLoading(false);
      return;
    }

    async function fetchAppointment() {
      try {
        const res = await fetch(`/api/confirmar?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setAppointment(data.appointment);
        } else {
          setError(data.error || 'Turno no encontrado.');
        }
      } catch (err) {
        setError('Error de conexión al obtener el turno.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppointment();
  }, [id]);

  const handleConfirmAttendance = async () => {
    setIsProcessing(true);
    setActionMessage('');
    try {
      const res = await fetch('/api/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'confirm' }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointment(data.appointment);
        setActionMessage('¡Excelente! Confirmaste tu asistencia. Einstein está tranquilo. 😄');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Error al procesar la confirmación.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!confirm('¿Estás seguro de que deseás cancelar este turno?')) return;
    setIsProcessing(true);
    setActionMessage('');
    try {
      const res = await fetch('/api/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'cancel' }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointment((prev) => ({ ...prev, estado: 'cancelado' }));
        setActionMessage('El turno ha sido cancelado. El lugar ha quedado disponible.');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Error al cancelar el turno.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          gap: '1rem',
          color: '#576574',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '4px solid var(--color-fondo-secundario)',
            borderTopColor: 'var(--color-acento)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p>Cargando información del turno...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '2rem auto',
          padding: '2rem 1.25rem',
          textAlign: 'center',
          backgroundColor: '#fff3cd',
          borderRadius: 'var(--radio-borde)',
          color: 'var(--color-principal)',
        }}
      >
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
          No se pudo encontrar el turno
        </h2>
        <p style={{ marginBottom: '1.5rem', color: '#856404' }}>
          {error || 'El turno solicitado no existe o fue removido.'}
        </p>
        <Link
          href="/turnos"
          className="btn-primario"
          style={{ display: 'inline-flex', maxWidth: '280px' }}
        >
          Volver a reservar
        </Link>
      </div>
    );
  }

  const isConfirmed = appointment.estado === 'confirmado';
  const isCanceled = appointment.estado === 'cancelado';
  const appointmentDate = new Date(appointment.fecha_hora);

  const estadoBg = {
    confirmado: '#d4edda',
    cancelado: '#f8d7da',
    pendiente: '#fff3cd',
  };
  const estadoColor = {
    confirmado: '#155724',
    cancelado: '#721c24',
    pendiente: '#856404',
  };

  return (
    <div
      style={{
        maxWidth: '620px',
        margin: '0 auto',
        padding: '1.5rem 1rem 5rem',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <Link href="/">
          <Image
            src="/img/logo.svg"
            alt="Logo Cortes Relativos"
            width={100}
            height={100}
            style={{ width: '80px', height: 'auto', margin: '0 auto 0.75rem' }}
          />
        </Link>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
            color: 'var(--color-principal)',
          }}
        >
          {isCanceled
            ? '❌ Turno Cancelado'
            : isConfirmed
            ? '✅ ¡Asistencia Confirmada!'
            : '🎉 ¡Turno Registrado!'}
        </h1>
        <p style={{ color: '#576574', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Comprobante:{' '}
          <strong style={{ color: 'var(--color-principal)' }}>#{appointment.id}</strong>
        </p>
      </header>

      {/* Mensaje de acción */}
      {actionMessage && (
        <div
          style={{
            backgroundColor: '#e6fffa',
            border: '1px solid #38b2ac',
            color: '#234e52',
            padding: '1rem',
            borderRadius: 'var(--radio-borde)',
            marginBottom: '1.25rem',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '0.95rem',
          }}
          role="status"
        >
          {actionMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-msg" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Tarjeta de detalle */}
      <div className="tarjeta-turno" style={{ marginBottom: '1.25rem' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            color: 'var(--color-principal)',
            marginBottom: '1rem',
            paddingBottom: '0.4rem',
            borderBottom: '2px solid var(--color-acento)',
          }}
        >
          Detalle del Turno
        </h3>

        {/* Grid de datos — 1 columna en móvil, 2 en tablet+ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          {[
            { label: 'Cliente', value: appointment.cliente_nombre },
            { label: 'WhatsApp', value: appointment.cliente_telefono },
            { label: 'Servicio', value: appointment.servicio_nombre },
            {
              label: 'Peluquero',
              value: appointment.peluquero_nombre || 'Primer disponible',
            },
            {
              label: 'Fecha y Hora',
              value: (
                <>
                  {appointmentDate.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                  <br />
                  {appointmentDate.toTimeString().slice(0, 5)} hs
                </>
              ),
            },
            {
              label: 'Estado',
              value: (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 12px',
                    borderRadius: '12px',
                    backgroundColor: estadoBg[appointment.estado] || '#e2e8f0',
                    color: estadoColor[appointment.estado] || '#576574',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                    fontSize: '0.9rem',
                  }}
                >
                  {appointment.estado}
                </span>
              ),
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  color: '#8395a7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.2rem',
                }}
              >
                {label}
              </span>
              <p style={{ fontWeight: '600', color: 'var(--color-principal)', fontSize: '0.95rem' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Aviso WhatsApp — solo si no cancelado */}
        {!isCanceled && (
          <div
            className="aviso"
            style={{ fontSize: '0.85rem' }}
          >
            <h4 style={{ marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              📱 Recordatorio por WhatsApp:
            </h4>
            <p style={{ color: '#576574', marginBottom: '0.5rem' }}>
              Te enviaremos un mensaje al{' '}
              <strong>{appointment.cliente_telefono}</strong> antes de tu cita para
              confirmar tu presencia. Si no confirmás a tiempo, el turno puede
              liberarse.
            </p>
            <p style={{ color: '#b7791f', fontSize: '0.82rem', fontWeight: '500' }}>
              ⏰ Demoras mayores a 15 minutos tienen un adicional del 20%.
            </p>
          </div>
        )}
      </div>

      {/* Botones de acción — fijos al pie en móvil */}
      {!isCanceled && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '620px',
            backgroundColor: 'var(--color-fondo)',
            borderTop: '1px solid var(--color-fondo-secundario)',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            zIndex: 200,
            boxShadow: '0 -4px 16px rgba(44,62,80,0.08)',
          }}
        >
          {!isConfirmed && (
            <button
              type="button"
              onClick={handleConfirmAttendance}
              disabled={isProcessing}
              className="btn-primario"
            >
              {isProcessing ? 'Confirmando...' : '✅ Confirmar Asistencia'}
            </button>
          )}

          {isConfirmed && (
            <div
              style={{
                textAlign: 'center',
                padding: '0.75rem',
                backgroundColor: '#d4edda',
                borderRadius: 'var(--radio-borde)',
                color: '#155724',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              ✅ Asistencia ya confirmada
            </div>
          )}

          <button
            type="button"
            onClick={handleCancelAppointment}
            disabled={isProcessing}
            style={{
              backgroundColor: '#fff',
              color: '#d63031',
              border: '1.5px solid #d63031',
              padding: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: 'var(--radio-borde)',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              minHeight: '48px',
              width: '100%',
            }}
          >
            Cancelar Turno
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link
          href="/"
          style={{
            color: 'var(--color-principal)',
            textDecoration: 'underline',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          ← Volver a la página principal
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmarPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 1rem',
            color: '#576574',
          }}
        >
          <p>Cargando información del turno...</p>
        </div>
      }
    >
      <ConfirmarContent />
    </Suspense>
  );
}
