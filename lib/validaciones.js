/**
 * Validation utilities for Cortes Relativos
 * Enforces business rules and data integrity on client and server.
 */

export const MIN_HOURS_ADVANCE = 2;
export const BUFFER_MINUTES = 15;
export const OPERATING_DAYS = [2, 3, 4, 5, 6];
export const OPERATING_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
];
export const LATE_ARRIVAL_MINUTES = 15;
export const LATE_SURCHARGE_PERCENT = 20;

export const VALID_APPOINTMENT_STATUSES = [
  'pendiente',
  'confirmado',
  'cancelado',
  'liberado',
  'completado'
];

export const VALID_WAITLIST_STATUSES = [
  'activa',
  'notificada',
  'cancelada',
  'atendida'
];

/**
 * Validates a client's full name.
 * Must be non-empty and have at least 2 characters.
 */
export function validateClientName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'El nombre es obligatorio.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres.' };
  }
  if (trimmed.length > 100) {
    return { isValid: false, error: 'El nombre no puede superar los 100 caracteres.' };
  }
  return { isValid: true, value: trimmed };
}

/**
 * Validates a WhatsApp / phone number.
 * Allows common formats (digits, spaces, hyphens, plus sign for country code).
 */
export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'El número de WhatsApp es obligatorio.' };
  }
  const cleanPhone = phone.trim().replace(/[\s-]/g, '');
  // Validates phone numbers with optional leading + and 8 to 15 digits
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Ingresá un número de WhatsApp válido (ej. +5493837420000 o 3837420000).' };
  }
  return { isValid: true, value: cleanPhone };
}

/**
 * Validates an optional email address.
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: true, value: null };
  }
  const trimmed = email.trim();
  if (trimmed === '') {
    return { isValid: true, value: null };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'El formato de correo electrónico no es válido.' };
  }
  return { isValid: true, value: trimmed };
}

/**
 * Validates appointment date & time against the minimum advance booking notice (default 2 hours).
 */
export function validateAppointmentTime(dateTimeInput, minHoursAdvance = MIN_HOURS_ADVANCE, now = new Date()) {
  if (!dateTimeInput) {
    return { isValid: false, error: 'La fecha y hora del turno son obligatorias.' };
  }

  // Asegurar zona horaria de Argentina (UTC-3) si viene en formato YYYY-MM-DDTHH:mm(:ss) sin offset
  const normalizedInput = (typeof dateTimeInput === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(dateTimeInput))
    ? (dateTimeInput.length === 16 ? dateTimeInput + ':00-03:00' : dateTimeInput + '-03:00')
    : dateTimeInput;

  const targetDate = new Date(normalizedInput);
  if (isNaN(targetDate.getTime())) {
    return { isValid: false, error: 'La fecha y hora ingresadas no son válidas.' };
  }

  const referenceTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const diffMilliseconds = targetDate.getTime() - referenceTime;
  const diffHours = diffMilliseconds / (1000 * 60 * 60);

  if (diffHours < minHoursAdvance) {
    return {
      isValid: false,
      error: `La reserva debe realizarse con al menos ${minHoursAdvance} horas de anticipación.`
    };
  }

  return { isValid: true, value: targetDate };
}

/**
 * Validates a requested appointment against the business days and start times
 * used by the booking calendar. The business timezone is Argentina.
 */
export function validateAppointmentOperatingHours(dateTimeInput) {
  const date = new Date(dateTimeInput);
  if (!Number.isFinite(date.getTime())) {
    return { isValid: false, error: 'La fecha y hora ingresadas no son válidas.' };
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = weekdays[values.weekday];
  const time = `${values.hour}:${values.minute}`;

  if (!OPERATING_DAYS.includes(weekday) || !OPERATING_HOURS.includes(time) || values.second !== '00') {
    return { isValid: false, error: 'El horario seleccionado está fuera del horario de atención.' };
  }

  return { isValid: true, value: date };
}

/**
 * Returns a timestamp's calendar date in the business timezone.
 */
export function getAppointmentBusinessDate(dateTimeInput) {
  const date = new Date(dateTimeInput);
  if (!Number.isFinite(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

/**
 * Authoritative reservation time validation used by the server before booking.
 */
export function validateServerAppointmentTime(dateTimeInput, now = new Date()) {
  const timeValidation = validateAppointmentTime(dateTimeInput, MIN_HOURS_ADVANCE, now);
  if (!timeValidation.isValid) return timeValidation;
  return validateAppointmentOperatingHours(timeValidation.value);
}

/**
 * Checks overlap using the service duration plus the configured safety buffer.
 */
export function appointmentIntervalsOverlap(startA, durationA, startB, durationB) {
  const startATime = new Date(startA).getTime();
  const startBTime = new Date(startB).getTime();
  if (!Number.isFinite(startATime) || !Number.isFinite(startBTime)) return false;

  const endA = startATime + (durationA + BUFFER_MINUTES) * 60 * 1000;
  const endB = startBTime + (durationB + BUFFER_MINUTES) * 60 * 1000;
  return startATime < endB && endA > startBTime;
}

/**
 * Checks whether an active appointment conflicts for the requested barber.
 * A missing barber preserves the current behavior and checks all appointments.
 */
export function hasAppointmentConflict({ start, duration, barberId }, appointments) {
  return appointments.some((appointment) => {
    if (appointment.estado === 'cancelado' || appointment.estado === 'liberado') return false;
    if (
      barberId &&
      appointment.peluquero_id &&
      Number(appointment.peluquero_id) !== Number(barberId)
    ) {
      return false;
    }
    return appointmentIntervalsOverlap(
      start,
      duration,
      appointment.fecha_hora,
      appointment.duracion_minutos || 30
    );
  });
}

/**
 * Validates appointment status.
 */
export function validateAppointmentStatus(status) {
  if (!status || !VALID_APPOINTMENT_STATUSES.includes(status)) {
    return {
      isValid: false,
      error: `El estado del turno no es válido. Valores permitidos: ${VALID_APPOINTMENT_STATUSES.join(', ')}`
    };
  }
  return { isValid: true, value: status };
}
