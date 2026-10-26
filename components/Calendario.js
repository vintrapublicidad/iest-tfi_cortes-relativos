'use client';

import { useMemo } from 'react';

const OPERATING_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30'
];

/**
 * Calendar and time slot picker.
 * Optimizado para móvil: scroll-snap horizontal en fechas, botones de horarios grandes.
 */
export default function Calendario({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  bookedAppointments = [],
  selectedBarberId = null
}) {
  // Genera los próximos 14 días
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('es-AR', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('es-AR', { month: 'short' });
      dates.push({
        iso: isoStr,
        dayName,
        dayNumber,
        monthName,
        isSunday: d.getDay() === 0,
      });
    }
    return dates;
  }, []);

  // Estado de cada horario para la fecha seleccionada
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const now = new Date();
    return OPERATING_HOURS.map((timeStr) => {
      const slotDateTime = new Date(`${selectedDate}T${timeStr}:00`);
      const diffHours = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      const isTooSoon = diffHours < 10;
      const isBooked = bookedAppointments.some((apt) => {
        if (apt.estado === 'cancelado' || apt.estado === 'liberado') return false;
        if (selectedBarberId && apt.peluquero_id && apt.peluquero_id !== selectedBarberId) return false;
        const aptTime = new Date(apt.fecha_hora);
        const aptDateStr = aptTime.toISOString().split('T')[0];
        const aptHourStr = aptTime.toTimeString().slice(0, 5);
        return aptDateStr === selectedDate && aptHourStr === timeStr;
      });
      return {
        time: timeStr,
        isTooSoon,
        isBooked,
        isAvailable: !isTooSoon && !isBooked,
      };
    });
  }, [selectedDate, bookedAppointments, selectedBarberId]);

  const availableCount = timeSlots.filter((s) => s.isAvailable).length;

  return (
    <div>
      {/* Aviso de anticipación */}
      <div className="aviso" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
        ℹ️ Los turnos requieren al menos <strong>10 horas de anticipación</strong>.
      </div>

      {/* ── Selector de fecha: scroll horizontal con scroll-snap ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="campo-label" style={{ marginBottom: '0.6rem' }}>
          Elegí un día:
        </p>
        <div className="scroll-horizontal" role="listbox" aria-label="Seleccioná una fecha">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.iso;
            return (
              <button
                key={item.iso}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectDate(item.iso)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '64px',
                  padding: '0.7rem 0.6rem',
                  borderRadius: 'var(--radio-borde)',
                  border: isSelected
                    ? '2px solid var(--color-principal)'
                    : '1px solid #d1d8e0',
                  backgroundColor: isSelected
                    ? 'var(--color-acento)'
                    : 'var(--color-fondo-secundario)',
                  color: 'var(--color-principal)',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: item.isSunday ? 0.45 : 1,
                  gap: '0.1rem',
                }}
              >
                <span style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                  {item.dayName}
                </span>
                <span style={{ fontSize: '1.3rem', fontWeight: '700', lineHeight: 1 }}>
                  {item.dayNumber}
                </span>
                <span style={{ fontSize: '0.65rem', textTransform: 'capitalize', color: isSelected ? 'var(--color-principal)' : '#576574' }}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Horarios ── */}
      {selectedDate ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
            <p className="campo-label">Elegí un horario:</p>
            {availableCount > 0 ? (
              <span style={{ fontSize: '0.75rem', color: '#576574' }}>
                {availableCount} disponibles
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#e17055', fontWeight: '600' }}>
                Sin horarios disponibles
              </span>
            )}
          </div>

          <div className="grid-horarios">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              let bg = 'var(--color-fondo)';
              let textColor = 'var(--color-principal)';
              let border = '1px solid #cbd5e1';
              let opacity = 1;

              if (!slot.isAvailable) {
                bg = 'var(--color-fondo-secundario)';
                textColor = '#b2bec3';
                border = '1px dashed #dcdde1';
                opacity = 0.6;
              } else if (isSelected) {
                bg = 'var(--color-acento)';
                border = '2px solid var(--color-principal)';
              }

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.isAvailable}
                  onClick={() => onSelectTime(slot.time)}
                  title={
                    slot.isBooked
                      ? 'Horario ya reservado'
                      : slot.isTooSoon
                      ? 'Menos de 10 hs de anticipación'
                      : 'Horario disponible'
                  }
                  style={{
                    padding: '0.6rem 0.25rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? '700' : '500',
                    borderRadius: 'var(--radio-borde)',
                    backgroundColor: bg,
                    color: textColor,
                    border,
                    cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                    opacity,
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '1.25rem',
              fontSize: '0.78rem',
              color: '#576574',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  background: 'var(--color-fondo)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '3px',
                }}
              />
              Disponible
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  background: 'var(--color-acento)',
                  border: '1px solid var(--color-principal)',
                  borderRadius: '3px',
                }}
              />
              Seleccionado
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  background: 'var(--color-fondo-secundario)',
                  border: '1px dashed #dcdde1',
                  borderRadius: '3px',
                  opacity: 0.6,
                }}
              />
              No disponible
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            backgroundColor: 'var(--color-fondo-secundario)',
            borderRadius: 'var(--radio-borde)',
            color: '#576574',
            fontSize: '0.95rem',
          }}
        >
          👆 Tocá un día para ver los horarios disponibles
        </div>
      )}
    </div>
  );
}
