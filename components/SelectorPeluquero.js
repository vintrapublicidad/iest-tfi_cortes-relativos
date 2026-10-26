'use client';

/**
 * Barber selector component.
 * Optimizado para móvil: cards compactas en grilla 2 columnas, tamaño táctil adecuado.
 */
export default function SelectorPeluquero({ barbers, selectedBarberId, onSelectBarber }) {
  const opciones = [
    {
      id: null,
      nombre: 'Primer disponible',
      descripcion: 'Cualquier peluquero de nuestro equipo',
      emoji: '💈',
      horario: null,
    },
    ...barbers.map((b) => ({
      id: b.id,
      nombre: b.nombre,
      descripcion: b.especialidad,
      emoji: '✂️',
      horario: b.horario_inicio && b.horario_fin
        ? `${b.horario_inicio.slice(0, 5)} – ${b.horario_fin.slice(0, 5)}`
        : null,
    })),
  ];

  return (
    <div>
      <p style={{ fontSize: '0.9rem', color: '#576574', marginBottom: '1rem' }}>
        Podés elegir un estilista o dejar que te asignemos el primero disponible.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
        }}
      >
        {opciones.map((op) => {
          const isSelected =
            op.id === null
              ? selectedBarberId === null
              : selectedBarberId === op.id;

          return (
            <button
              key={op.id ?? 'any'}
              type="button"
              onClick={() => onSelectBarber(op.id)}
              aria-pressed={isSelected}
              style={{
                padding: '1rem 0.85rem',
                textAlign: 'left',
                borderRadius: 'var(--radio-borde)',
                border: isSelected
                  ? '2px solid var(--color-acento)'
                  : '1px solid #d1d8e0',
                backgroundColor: isSelected ? '#fffdf0' : 'var(--color-fondo)',
                boxShadow: isSelected
                  ? '0 3px 10px rgba(241, 196, 15, 0.25)'
                  : '0 1px 4px rgba(44,62,80,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                minHeight: '80px',
                position: 'relative',
              }}
            >
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '8px',
                    backgroundColor: 'var(--color-acento)',
                    color: 'var(--color-principal)',
                    fontSize: '0.6rem',
                    fontWeight: '700',
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  ✓
                </span>
              )}
              <span style={{ fontSize: '1.3rem' }}>{op.emoji}</span>
              <strong
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-principal)',
                  lineHeight: 1.2,
                }}
              >
                {op.nombre}
              </strong>
              {op.descripcion && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#576574',
                    lineHeight: 1.3,
                  }}
                >
                  {op.descripcion}
                </span>
              )}
              {op.horario && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#8395a7',
                    marginTop: '0.15rem',
                  }}
                >
                  🕐 {op.horario}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
