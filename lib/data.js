import { query } from './db.js';
import {
  validateAppointmentTime,
  validateClientName,
  validatePhoneNumber,
  validateEmail,
  MIN_HOURS_ADVANCE
} from './validaciones.js';

// Provisional seed data according to docs/05-DATOS.md and AGENTS.md
const INITIAL_SERVICES = [
  { id: 1, nombre: 'Corte de caballero', precio: 0.0, duracion_minutos: 30, categoria: 'Corte' },
  { id: 2, nombre: 'Corte de dama', precio: 0.0, duracion_minutos: 45, categoria: 'Corte' },
  { id: 3, nombre: 'Corte de niño', precio: 0.0, duracion_minutos: 30, categoria: 'Corte' },
  { id: 4, nombre: 'Color completo', precio: 0.0, duracion_minutos: 120, categoria: 'Color' },
  { id: 5, nombre: 'Brushing / peinado', precio: 0.0, duracion_minutos: 45, categoria: 'Peinado' },
  { id: 6, nombre: 'Corte y barba', precio: 0.0, duracion_minutos: 60, categoria: 'Barba' },
];

const INITIAL_BARBERS = [
  {
    id: 1,
    nombre: 'Peluquero de ejemplo 1',
    especialidad: 'Cortes clásicos y modernos',
    horario_inicio: '09:00:00',
    horario_fin: '20:00:00',
    dias_trabajo: 'Lunes a Sábado',
  },
  {
    id: 2,
    nombre: 'Peluquero de ejemplo 2',
    especialidad: 'Color y peinados',
    horario_inicio: '09:00:00',
    horario_fin: '20:00:00',
    dias_trabajo: 'Lunes a Sábado',
  },
];

// In-memory fallback stores
let memoryClients = [
  { id: 1, nombre: 'Ana Pérez', telefono: '+5493837420000', email: 'ejemplo@correo.com' },
  { id: 2, nombre: 'Carlos Gómez (Ejemplo)', telefono: '+5493837420001', email: 'carlos.ejemplo@correo.com' },
];

let memoryAppointments = [
  {
    id: 1,
    cliente_id: 1,
    servicio_id: 2,
    peluquero_id: 1,
    fecha_hora: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    estado: 'pendiente',
    confirmado: false,
    recordatorio_enviado: false,
    cliente_nombre: 'Ana Pérez',
    cliente_telefono: '+5493837420000',
    servicio_nombre: 'Corte de dama',
    peluquero_nombre: 'Peluquero de ejemplo 1'
  },
  {
    id: 2,
    cliente_id: 2,
    servicio_id: 1,
    peluquero_id: 2,
    fecha_hora: new Date(Date.now() + 52 * 3600 * 1000).toISOString(),
    estado: 'confirmado',
    confirmado: true,
    recordatorio_enviado: true,
    cliente_nombre: 'Carlos Gómez (Ejemplo)',
    cliente_telefono: '+5493837420001',
    servicio_nombre: 'Corte de caballero',
    peluquero_nombre: 'Peluquero de ejemplo 2'
  }
];

let memoryWaitlist = [
  {
    id: 1,
    cliente_id: 2,
    servicio_id: 4,
    fecha_solicitud: new Date().toISOString(),
    estado: 'activa',
    cliente_nombre: 'Carlos Gómez (Ejemplo)',
    cliente_telefono: '+5493837420001',
    servicio_nombre: 'Color completo'
  }
];

/**
 * Retrieves all available services.
 */
export async function getServices() {
  try {
    const res = await query('SELECT * FROM servicios ORDER BY id ASC');
    if (res.rows && res.rows.length > 0) return res.rows;
  } catch {
    // Fallback to in-memory seed data
  }
  return INITIAL_SERVICES;
}

/**
 * Retrieves all barbers.
 */
export async function getBarbers() {
  try {
    const res = await query('SELECT * FROM peluqueros ORDER BY id ASC');
    if (res.rows && res.rows.length > 0) return res.rows;
  } catch {
    // Fallback to in-memory seed data
  }
  return INITIAL_BARBERS;
}

/**
 * Retrieves appointments for a given date and optional barber.
 */
export async function getAppointments(dateStr, barberId = null) {
  try {
    let sql = `
      SELECT t.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono,
             s.nombre as servicio_nombre, s.duracion_minutos, p.nombre as peluquero_nombre
      FROM turnos t
      JOIN clientes c ON t.cliente_id = c.id
      JOIN servicios s ON t.servicio_id = s.id
      LEFT JOIN peluqueros p ON t.peluquero_id = p.id
      WHERE t.estado NOT IN ('cancelado', 'liberado')
    `;
    const params = [];

    if (dateStr) {
      params.push(dateStr);
      sql += ` AND DATE(t.fecha_hora) = $${params.length}`;
    }

    if (barberId) {
      params.push(parseInt(barberId, 10));
      sql += ` AND t.peluquero_id = $${params.length}`;
    }

    sql += ' ORDER BY t.fecha_hora ASC';
    const res = await query(sql, params);
    return res.rows;
  } catch {
    // Fallback
    return memoryAppointments.filter((apt) => {
      if (apt.estado === 'cancelado' || apt.estado === 'liberado') return false;
      if (barberId && apt.peluquero_id !== parseInt(barberId, 10)) return false;
      if (dateStr) {
        const aptDate = apt.fecha_hora.split('T')[0];
        if (aptDate !== dateStr) return false;
      }
      return true;
    });
  }
}

/**
 * Retrieves a single appointment by ID.
 */
export async function getAppointmentById(id) {
  const numericId = parseInt(id, 10);
  try {
    const sql = `
      SELECT t.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono, c.email as cliente_email,
             s.nombre as servicio_nombre, s.precio as servicio_precio, s.duracion_minutos,
             p.nombre as peluquero_nombre
      FROM turnos t
      JOIN clientes c ON t.cliente_id = c.id
      JOIN servicios s ON t.servicio_id = s.id
      LEFT JOIN peluqueros p ON t.peluquero_id = p.id
      WHERE t.id = $1
    `;
    const res = await query(sql, [numericId]);
    if (res.rows && res.rows[0]) return res.rows[0];
  } catch {
    // Fallback
  }
  const found = memoryAppointments.find((a) => a.id === numericId);
  return found || null;
}

/**
 * Creates a new appointment with strict server-side validation.
 */
export async function createAppointment({
  clientName,
  clientPhone,
  clientEmail,
  serviceId,
  barberId,
  dateTime
}) {
  // 1. Validations
  const nameVal = validateClientName(clientName);
  if (!nameVal.isValid) throw new Error(nameVal.error);

  const phoneVal = validatePhoneNumber(clientPhone);
  if (!phoneVal.isValid) throw new Error(phoneVal.error);

  const emailVal = validateEmail(clientEmail);
  if (!emailVal.isValid) throw new Error(emailVal.error);

  const timeVal = validateAppointmentTime(dateTime, MIN_HOURS_ADVANCE);
  if (!timeVal.isValid) throw new Error(timeVal.error);

  const targetDate = timeVal.value;
  const sId = parseInt(serviceId, 10);
  const pId = barberId ? parseInt(barberId, 10) : null;

  // 2. Check for double booking / conflict
  const existing = await getAppointments(targetDate.toISOString().split('T')[0], pId);
  const conflict = existing.some((apt) => {
    const existingTime = new Date(apt.fecha_hora).getTime();
    return Math.abs(existingTime - targetDate.getTime()) < 20 * 60 * 1000; // 20 min overlap threshold
  });

  if (conflict) {
    throw new Error('El horario seleccionado ya no se encuentra disponible. Por favor elegí otro horario.');
  }

  // 3. Try PostgreSQL insertion
  try {
    // Find or create client
    let clientRes = await query('SELECT id FROM clientes WHERE telefono = $1', [phoneVal.value]);
    let cId;
    if (clientRes.rows.length > 0) {
      cId = clientRes.rows[0].id;
    } else {
      const newClient = await query(
        'INSERT INTO clientes (nombre, telefono, email) VALUES ($1, $2, $3) RETURNING id',
        [nameVal.value, phoneVal.value, emailVal.value]
      );
      cId = newClient.rows[0].id;
    }

    const insertTurno = await query(
      `INSERT INTO turnos (cliente_id, servicio_id, peluquero_id, fecha_hora, estado, confirmado, recordatorio_enviado)
       VALUES ($1, $2, $3, $4, 'pendiente', false, false)
       RETURNING id`,
      [cId, sId, pId, targetDate.toISOString()]
    );

    const newId = insertTurno.rows[0].id;
    return await getAppointmentById(newId);
  } catch {
    // Fallback in-memory
    let client = memoryClients.find((c) => c.telefono === phoneVal.value);
    if (!client) {
      client = {
        id: memoryClients.length + 1,
        nombre: nameVal.value,
        telefono: phoneVal.value,
        email: emailVal.value
      };
      memoryClients.push(client);
    }

    const services = await getServices();
    const barbers = await getBarbers();
    const service = services.find((s) => s.id === sId) || { nombre: 'Servicio general', precio: 0, duracion_minutos: 30 };
    const barber = barbers.find((b) => b.id === pId) || { nombre: 'Peluquero asignado' };

    const newAppointment = {
      id: memoryAppointments.length + 1,
      cliente_id: client.id,
      servicio_id: sId,
      peluquero_id: pId,
      fecha_hora: targetDate.toISOString(),
      estado: 'pendiente',
      confirmado: false,
      recordatorio_enviado: false,
      cliente_nombre: client.nombre,
      cliente_telefono: client.telefono,
      cliente_email: client.email,
      servicio_nombre: service.nombre,
      servicio_precio: service.precio,
      duracion_minutos: service.duracion_minutos,
      peluquero_nombre: barber.nombre
    };

    memoryAppointments.push(newAppointment);
    return newAppointment;
  }
}

/**
 * Updates appointment status to 'confirmado'.
 */
export async function confirmAppointment(id) {
  const numericId = parseInt(id, 10);
  try {
    await query(
      `UPDATE turnos SET estado = 'confirmado', confirmado = true WHERE id = $1`,
      [numericId]
    );
    return await getAppointmentById(numericId);
  } catch {
    // Fallback
    const apt = memoryAppointments.find((a) => a.id === numericId);
    if (apt) {
      apt.estado = 'confirmado';
      apt.confirmado = true;
      return apt;
    }
    return null;
  }
}

/**
 * Cancels an appointment.
 */
export async function cancelAppointment(id) {
  const numericId = parseInt(id, 10);
  try {
    await query(
      `UPDATE turnos SET estado = 'cancelado' WHERE id = $1`,
      [numericId]
    );
    return true;
  } catch {
    const apt = memoryAppointments.find((a) => a.id === numericId);
    if (apt) {
      apt.estado = 'cancelado';
      return true;
    }
    return false;
  }
}

/**
 * Adds a client to the waitlist.
 */
export async function addToWaitlist({ clientName, clientPhone, serviceId }) {
  const nameVal = validateClientName(clientName);
  if (!nameVal.isValid) throw new Error(nameVal.error);

  const phoneVal = validatePhoneNumber(clientPhone);
  if (!phoneVal.isValid) throw new Error(phoneVal.error);

  const sId = parseInt(serviceId, 10);

  try {
    let clientRes = await query('SELECT id FROM clientes WHERE telefono = $1', [phoneVal.value]);
    let cId;
    if (clientRes.rows.length > 0) {
      cId = clientRes.rows[0].id;
    } else {
      const newClient = await query(
        'INSERT INTO clientes (nombre, telefono) VALUES ($1, $2) RETURNING id',
        [nameVal.value, phoneVal.value]
      );
      cId = newClient.rows[0].id;
    }

    const waitRes = await query(
      `INSERT INTO lista_espera (cliente_id, servicio_id, estado)
       VALUES ($1, $2, 'activa')
       RETURNING id, fecha_solicitud`,
      [cId, sId]
    );
    return waitRes.rows[0];
  } catch {
    // Fallback
    const entry = {
      id: memoryWaitlist.length + 1,
      cliente_nombre: nameVal.value,
      cliente_telefono: phoneVal.value,
      servicio_id: sId,
      fecha_solicitud: new Date().toISOString(),
      estado: 'activa'
    };
    memoryWaitlist.push(entry);
    return entry;
  }
}

/**
 * Retrieves all appointments for the Admin panel with all statuses (including cancelado/liberado).
 */
export async function getAllAppointments() {
  try {
    const sql = `
      SELECT t.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono, c.email as cliente_email,
             s.nombre as servicio_nombre, s.precio as servicio_precio, s.duracion_minutos,
             p.nombre as peluquero_nombre
      FROM turnos t
      JOIN clientes c ON t.cliente_id = c.id
      JOIN servicios s ON t.servicio_id = s.id
      LEFT JOIN peluqueros p ON t.peluquero_id = p.id
      ORDER BY t.fecha_hora DESC
    `;
    const res = await query(sql);
    if (res.rows && res.rows.length > 0) return res.rows;
  } catch {
    // Fallback
  }
  return [...memoryAppointments].sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
}

/**
 * Retrieves waitlist items for the Admin panel.
 */
export async function getWaitlistEntries() {
  try {
    const sql = `
      SELECT w.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono,
             s.nombre as servicio_nombre
      FROM lista_espera w
      JOIN clientes c ON w.cliente_id = c.id
      JOIN servicios s ON w.servicio_id = s.id
      ORDER BY w.fecha_solicitud DESC
    `;
    const res = await query(sql);
    if (res.rows && res.rows.length > 0) return res.rows;
  } catch {
    // Fallback
  }
  return [...memoryWaitlist].sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud));
}

/**
 * Updates an appointment status (e.g. 'confirmado', 'cancelado', 'pendiente', 'liberado').
 */
export async function updateAppointmentStatus(id, newStatus) {
  const numericId = parseInt(id, 10);
  const isConfirmed = newStatus === 'confirmado';
  try {
    await query(
      `UPDATE turnos SET estado = $1, confirmado = $2 WHERE id = $3`,
      [newStatus, isConfirmed, numericId]
    );
    return await getAppointmentById(numericId);
  } catch {
    const apt = memoryAppointments.find((a) => a.id === numericId);
    if (apt) {
      apt.estado = newStatus;
      apt.confirmado = isConfirmed;
      return apt;
    }
    return null;
  }
}

/**
 * Computes KPIs and statistics for the Admin Dashboard.
 */
export async function getAdminMetrics() {
  const all = await getAllAppointments();
  const waitlist = await getWaitlistEntries();

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const turnosHoy = all.filter((a) => a.fecha_hora?.startsWith(todayStr));
  const confirmados = all.filter((a) => a.estado === 'confirmado');
  const pendientes = all.filter((a) => a.estado === 'pendiente');
  const cancelados = all.filter((a) => a.estado === 'cancelado');
  const esperaActiva = waitlist.filter((w) => w.estado === 'activa');

  // Conteo por servicio
  const porServicio = {};
  all.forEach((a) => {
    const sName = a.servicio_nombre || 'General';
    porServicio[sName] = (porServicio[sName] || 0) + 1;
  });

  return {
    totalTurnos: all.length,
    turnosHoy: turnosHoy.length,
    confirmados: confirmados.length,
    pendientes: pendientes.length,
    cancelados: cancelados.length,
    esperaActiva: esperaActiva.length,
    porServicio,
  };
}

