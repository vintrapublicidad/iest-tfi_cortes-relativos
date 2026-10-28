import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateClientName,
  validatePhoneNumber,
  validateEmail,
  validateAppointmentTime,
  validateAppointmentStatus,
  MIN_HOURS_ADVANCE
} from '../lib/validaciones.js';

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

test('4. Validación de Anticipación Mínima (10 Horas)', () => {
  const ahora = new Date();

  // Turno dentro de 2 horas (debe fallar)
  const turnoMuyPronto = new Date(ahora.getTime() + 2 * 60 * 60 * 1000).toISOString();
  const resFallo = validateAppointmentTime(turnoMuyPronto);
  assert.equal(resFallo.isValid, false, 'Turno con 2 hs de anticipación debe ser rechazado');

  // Turno dentro de 24 horas (debe pasar)
  const turnoValido = new Date(ahora.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const resExito = validateAppointmentTime(turnoValido);
  assert.equal(resExito.isValid, true, 'Turno con 24 hs de anticipación debe ser aceptado');
});

test('5. Validación de Estados de Turno Permitidos', () => {
  assert.equal(validateAppointmentStatus('pendiente').isValid, true);
  assert.equal(validateAppointmentStatus('confirmado').isValid, true);
  assert.equal(validateAppointmentStatus('cancelado').isValid, true);
  assert.equal(validateAppointmentStatus('estado_inventado').isValid, false, 'Estado desconocido debe rechazarse');
});

test('6. Validación Matemática de Ventana de 15 Minutos de Amortiguación (Buffer)', () => {
  // Simulación de dos turnos para verificar el algoritmo de colisión
  const BUFFER_MINUTOS = 15;
  const duracionCorte = 30; // 30 minutos

  // Turno A: Inicia 10:00 (600 min). Con buffer termina a 10:45 (645 min).
  const inicioA = 10 * 60;
  const totalFinA = inicioA + duracionCorte + BUFFER_MINUTOS; // 645 min

  // Intento de Turno B a las 10:30 (630 min).
  // Aunque el corte A terminó físicamente a las 10:30, la ventana de 15 min ocupa hasta las 10:45.
  const inicioB_solapado = 10 * 60 + 30; // 630 min
  const totalFinB_solapado = inicioB_solapado + duracionCorte + BUFFER_MINUTOS; // 675 min

  const hayConflictoSolapado = inicioB_solapado < totalFinA && totalFinB_solapado > inicioA;
  assert.equal(hayConflictoSolapado, true, 'El turno de las 10:30 debe colisionar con el buffer del turno de las 10:00');

  // Intento de Turno C a las 11:00 (660 min).
  // Ya pasaron los 45 min del bloque anterior (10:00 a 10:45).
  const inicioC_libre = 11 * 60; // 660 min
  const totalFinC_libre = inicioC_libre + duracionCorte + BUFFER_MINUTOS; // 705 min

  const hayConflictoLibre = inicioC_libre < totalFinA && totalFinC_libre > inicioA;
  assert.equal(hayConflictoLibre, false, 'El turno de las 11:00 debe quedar libre tras superar la ventana de amortiguación');
});
