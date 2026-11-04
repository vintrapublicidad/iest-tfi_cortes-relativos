import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateClientName,
  validatePhoneNumber,
  validateEmail,
  validateAppointmentTime,
  validateAppointmentOperatingHours,
  validateAppointmentStatus,
  validateServerAppointmentTime,
  appointmentIntervalsOverlap,
  hasAppointmentConflict,
  getAppointmentBusinessDate,
  MIN_HOURS_ADVANCE,
  BUFFER_MINUTES
} from '../lib/validaciones.js';
import { createAppointment } from '../lib/data.js';

test('1. Validación de Nombre de Cliente', () => {
  assert.equal(validateClientName('').isValid, false, 'Nombre vacío debe ser inválido');
  assert.equal(validateClientName('A').isValid, false, 'Nombre con 1 letra debe ser inválido');
  assert.equal(validateClientName('Carlos Gómez').isValid, true, 'Nombre válido debe ser aceptado');
  assert.equal(validateClientName('   Ana   ').value, 'Ana', 'Debe recortar espacios');
});

test('2. Validación de Teléfono / WhatsApp', () => {
  assert.equal(validatePhoneNumber('').isValid, false, 'Teléfono vacío debe ser inválido');
  assert.equal(validatePhoneNumber('abc123').isValid, false, 'Letras en teléfono debe ser inválido');
  assert.equal(validatePhoneNumber('3837420000').isValid, true, 'Número local de 10 dígitos es válido');
  assert.equal(validatePhoneNumber('+5493837421111').isValid, true, 'Formato internacional WhatsApp es válido');
});

test('3. Validación de Email Opcional', () => {
  assert.equal(validateEmail('').isValid, true, 'Email vacío es válido (es opcional)');
  assert.equal(validateEmail(null).isValid, true, 'Email null es válido (es opcional)');
  assert.equal(validateEmail('invalido').isValid, false, 'Email sin @ debe ser inválido');
  assert.equal(validateEmail('test@peluqueria.com').isValid, true, 'Email correcto es válido');
});

test('4. Anticipación mínima: rechaza menos de 2 h y acepta el límite y más', () => {
  assert.equal(MIN_HOURS_ADVANCE, 2);
  const ahora = new Date('2026-11-04T07:00:00-03:00');
  const antesDelLimite = new Date(ahora.getTime() + (2 * 60 * 60 * 1000) - 1).toISOString();
  const enElLimite = new Date(ahora.getTime() + 2 * 60 * 60 * 1000).toISOString();
  const despuesDelLimite = new Date(ahora.getTime() + (2 * 60 * 60 * 1000) + 1).toISOString();

  assert.equal(validateAppointmentTime(antesDelLimite, MIN_HOURS_ADVANCE, ahora).isValid, false);
  assert.equal(validateAppointmentTime(enElLimite, MIN_HOURS_ADVANCE, ahora).isValid, true);
  assert.equal(validateAppointmentTime(despuesDelLimite, MIN_HOURS_ADVANCE, ahora).isValid, true);
});

test('5. Validación de Estados de Turno Permitidos', () => {
  assert.equal(validateAppointmentStatus('pendiente').isValid, true);
  assert.equal(validateAppointmentStatus('confirmado').isValid, true);
  assert.equal(validateAppointmentStatus('cancelado').isValid, true);
  assert.equal(validateAppointmentStatus('estado_inventado').isValid, false, 'Estado desconocido debe rechazarse');
});

test('6. Horarios permitidos y días de atención', () => {
  assert.equal(validateAppointmentOperatingHours('2026-11-04T09:00:00-03:00').isValid, true);
  assert.equal(validateAppointmentOperatingHours('2026-11-04T22:30:00-03:00').isValid, true);
  assert.equal(validateAppointmentOperatingHours('2026-11-04T08:30:00-03:00').isValid, false);
  assert.equal(validateAppointmentOperatingHours('2026-11-04T13:00:00-03:00').isValid, false);
  assert.equal(validateAppointmentOperatingHours('2026-11-04T14:30:00-03:00').isValid, false);
  assert.equal(validateAppointmentOperatingHours('2026-11-04T23:00:00-03:00').isValid, false);
  assert.equal(validateAppointmentOperatingHours('2026-11-08T10:00:00-03:00').isValid, false, 'Domingo debe rechazarse');
  assert.equal(validateAppointmentOperatingHours('2026-11-09T10:00:00-03:00').isValid, false, 'Lunes debe rechazarse');
});

test('7. El servidor valida la anticipación y los horarios sin depender del calendario', () => {
  const ahora = new Date('2026-11-04T07:00:00-03:00');
  assert.equal(validateServerAppointmentTime('2026-11-04T09:00:00', ahora).isValid, true);
  assert.equal(validateServerAppointmentTime('2026-11-04T09:30:00', ahora).isValid, true);
  assert.equal(validateServerAppointmentTime('2035-07-04T14:30:00-03:00').isValid, false);
  assert.equal(getAppointmentBusinessDate('2035-07-08T01:30:00Z'), '2035-07-07');
});

test('8. La capa de reserva del servidor rechaza solicitudes con menos de 2 horas', async () => {
  await assert.rejects(
    createAppointment({
      clientName: 'Cliente de prueba',
      clientPhone: '+5493837420000',
      serviceId: 1,
      barberId: 1,
      dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }),
    /al menos 2 horas de anticipación/
  );
});

test('9. Colisiones respetan duración, peluquero, estados y amortiguación', () => {
  const activeAppointment = {
    fecha_hora: '2035-07-03T10:00:00-03:00',
    duracion_minutos: 30,
    peluquero_id: 1,
    estado: 'pendiente',
  };

  assert.equal(BUFFER_MINUTES, 15);
  assert.equal(appointmentIntervalsOverlap('2035-07-03T10:30:00-03:00', 30, activeAppointment.fecha_hora, 30), true);
  assert.equal(appointmentIntervalsOverlap('2035-07-03T10:45:00-03:00', 30, activeAppointment.fecha_hora, 30), false);
  assert.equal(appointmentIntervalsOverlap('2035-07-03T09:30:00-03:00', 15, activeAppointment.fecha_hora, 30), false);
  assert.equal(hasAppointmentConflict({
    start: '2035-07-03T10:30:00-03:00', duration: 30, barberId: 1
  }, [activeAppointment]), true);
  assert.equal(hasAppointmentConflict({
    start: '2035-07-03T10:30:00-03:00', duration: 30, barberId: 2
  }, [activeAppointment]), false);
  assert.equal(hasAppointmentConflict({
    start: '2035-07-03T10:30:00-03:00', duration: 30, barberId: 1
  }, [{ ...activeAppointment, estado: 'cancelado' }]), false);
});
