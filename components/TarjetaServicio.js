'use client';

/**
 * Service card component.
 * Optimizado para móvil: compacta en grilla 2 columnas, tamaño táctil mínimo.
 */
export default function TarjetaServicio({ service, isSelected, onSelect }) {
  const isZeroPrice = Number(service.precio) === 0;

  return (
    <div
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(service);
        }
      }}
      style={{
        backgroundColor: 'var(--color-fondo)',
        border: isSelected
          ? '2px solid var(--color-acento)'
          : '1px solid #d1d8e0',
        borderRadius: 'var(--radio-borde)',
        padding: '1rem 0.85rem',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        boxShadow: isSelected
          ? '0 4px 14px rgba(241, 196, 15, 0.35)'
          : '0 1px 4px rgba(44, 62, 80, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: isSelected ? '#fffdf0' : 'var(--color-fondo)',
        minHeight: '96px',
      }}
    >
      {/* Badge de seleccionado */}
      {isSelected && (
        <span
          style={{
            position: 'absolute',
            top: '7px',
            right: '8px',
            backgroundColor: 'var(--color-acento)',
            color: 'var(--color-principal)',
            fontSize: '0.62rem',
            fontWeight: '700',
            padding: '2px 7px',
            borderRadius: '10px',
          }}
        >
          ✓
        </span>
      )}

      {/* Nombre y categoría */}
      <div>
        <h3
          style={{
            fontSize: '0.95rem',
            marginBottom: '0.2rem',
            color: 'var(--color-principal)',
            lineHeight: 1.2,
            paddingRight: isSelected ? '2rem' : 0,
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
              fontWeight: '500',
              padding: '1px 7px',
              borderRadius: '4px',
              marginBottom: '0.5rem',
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
          paddingTop: '0.5rem',
          borderTop: '1px dashed #e2e8f0',
          marginTop: '0.4rem',
        }}
      >
        <span style={{ fontSize: '0.78rem', color: '#576574' }}>
          ⏱️ {service.duracion_minutos} min
        </span>
        <span
          style={{
            fontWeight: '700',
            fontSize: '0.9rem',
            color: 'var(--color-principal)',
          }}
        >
          {isZeroPrice ? (
            <span>
              $ 0{' '}
              <small style={{ fontWeight: 400, color: '#8395a7', fontSize: '0.7rem' }}>
                (prov.)
              </small>
            </span>
          ) : (
            `$ ${service.precio}`
          )}
        </span>
      </div>
    </div>
  );
}
