/**
 * Validation utilities for Cortes Relativos
 * Enforces business rules and data integrity on client and server.
 */

export const MIN_HOURS_ADVANCE = 10;
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
 * Validates appointment date & time against the 10-hour minimum advance booking notice.
 */
export function validateAppointmentTime(dateTimeInput, minHoursAdvance = MIN_HOURS_ADVANCE) {
  if (!dateTimeInput) {
    return { isValid: false, error: 'La fecha y hora del turno son obligatorias.' };
  }

  const targetDate = new Date(dateTimeInput);
  if (isNaN(targetDate.getTime())) {
    return { isValid: false, error: 'La fecha y hora ingresadas no son válidas.' };
  }

  const now = new Date();
  const diffMilliseconds = targetDate.getTime() - now.getTime();
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
