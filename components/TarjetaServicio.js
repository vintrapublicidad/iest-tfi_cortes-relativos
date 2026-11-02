'use client';

import Image from 'next/image';
import { Check, Clock } from 'lucide-react';

const SERVICE_IMAGES = {
  1: '/img/servicios/corte-caballero.png',
  2: '/img/servicios/corte-dama.png',
  3: '/img/servicios/corte-nino.png',
  4: '/img/servicios/color-completo.png',
  5: '/img/servicios/peinado.png',
  6: '/img/servicios/corte-barba.png',
};

function getServiceImage(service) {
  if (service?.imagen) return service.imagen;
  if (service?.id && SERVICE_IMAGES[service.id]) return SERVICE_IMAGES[service.id];

  const norm = (service?.nombre || '').toLowerCase();
  if (norm.includes('caballero')) return SERVICE_IMAGES[1];
  if (norm.includes('dama')) return SERVICE_IMAGES[2];
  if (norm.includes('niño') || norm.includes('nino')) return SERVICE_IMAGES[3];
  if (norm.includes('color')) return SERVICE_IMAGES[4];
  if (norm.includes('peinado') || norm.includes('brushing')) return SERVICE_IMAGES[5];
  if (norm.includes('barba')) return SERVICE_IMAGES[6];

  return '/img/logo.png';
}

/**
 * Service card component.
 * Muestra fotografía superior en formato cover, nombre, categoría, duración y precio.
 * Compatible tanto con interacción táctil para reservas como para vista informativa.
 */
export default function TarjetaServicio({
  service,
  isSelected = false,
  onSelect,
  isInteractive = true,
}) {
  const isZeroPrice = Number(service.precio) === 0 || service.precio === '$ 0';
  const displayPrice = isZeroPrice ? '$ 0' : (String(service.precio).startsWith('$') ? service.precio : `$ ${service.precio}`);
  const displayDuration = service.duracion_minutos ? `${service.duracion_minutos} min` : (service.duracion || '30 min');
  const imageUrl = getServiceImage(service);

  const handleClick = () => {
    if (isInteractive && onSelect) {
      onSelect(service);
    }
  };

  return (
    <div
      onClick={handleClick}
      role={isInteractive && onSelect ? 'button' : undefined}
      tabIndex={isInteractive && onSelect ? 0 : undefined}
      aria-pressed={isInteractive && onSelect ? isSelected : undefined}
      onKeyDown={(e) => {
        if (isInteractive && onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(service);
        }
      }}
      className={`tarjeta-tactil ${isSelected ? 'tarjeta-servicio-selected' : ''}`}
      style={{
        backgroundColor: isSelected ? '#fffdf0' : 'var(--color-fondo)',
        border: isSelected
          ? '2px solid var(--color-acento)'
          : '1px solid #d1d8e0',
        borderRadius: 'var(--radio-borde)',
        overflow: 'hidden',
        cursor: isInteractive && onSelect ? 'pointer' : 'default',
        transition: 'all 0.22s ease',
        boxShadow: isSelected
          ? '0 6px 18px rgba(241, 196, 15, 0.35)'
          : '0 2px 8px rgba(44, 62, 80, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Badge de seleccionado */}
      {isSelected && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'var(--color-acento)',
            color: 'var(--color-principal)',
            fontSize: '0.75rem',
            fontWeight: '700',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}
        >
          <Check size={14} strokeWidth={3} />
        </span>
      )}

      {/* ── Fotografía superior del servicio ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          backgroundColor: '#e2e8f0',
          overflow: 'hidden',
        }}
      >
        <Image
          src={imageUrl}
          alt={`Fotografía del servicio ${service.nombre}`}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
          }}
          loading="lazy"
        />
      </div>

      {/* ── Información: nombre, categoría, duración y precio ── */}
      <div
        style={{
          padding: '0.85rem 0.85rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '0.98rem',
              fontWeight: '700',
              marginBottom: '0.2rem',
              color: 'var(--color-principal)',
              lineHeight: 1.25,
            }}
          >
            {service.nombre}
          </h3>

          {service.categoria && (
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-fondo-secundario)',
                color: 'var(--color-principal)',
                fontSize: '0.67rem',
                fontWeight: '600',
                padding: '2px 7px',
                borderRadius: '4px',
                marginBottom: '0.45rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {service.categoria}
            </span>
          )}
        </div>

        {/* Duración y precio */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.55rem',
            borderTop: '1px dashed #e2e8f0',
            marginTop: '0.5rem',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: '#576574', fontWeight: '500' }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}><Clock size={13} color="#576574" /> {displayDuration}</span>
          </span>
          <span
            style={{
              fontWeight: '700',
              fontSize: '0.92rem',
              color: 'var(--color-principal)',
            }}
          >
            {displayPrice}{' '}
            {isZeroPrice && (
              <small style={{ fontWeight: 400, color: '#8395a7', fontSize: '0.7rem' }}>
                (prov.)
              </small>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
