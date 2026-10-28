import { query } from './db.js';
import {
  validateAppointmentTime,
  validateClientName,
  validatePhoneNumber,
  validateEmail,
  MIN_HOURS_ADVANCE
} from './validaciones.js';
import { sendWhatsAppMessage } from './whatsapp.js';

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
    horario_fin: '23:00:00',
    dias_trabajo: 'Martes a Sábado',
    whatsapp: '+5493837421111', 
  },
  {
    id: 2,
    nombre: 'Peluquero de ejemplo 2',
    especialidad: 'Color y peinados',
    horario_inicio: '09:00:00',
    horario_fin: '23:00:00',
    dias_trabajo: 'Martes a Sábado',
    whatsapp: '+5493837422222', 
  },
];

// In-memory fallback for barbers (used when DB unavailable)
let memoryBarbers = [...INITIAL_BARBERS];

// In-memory fallback for company WhatsApp number
let memoryCompanyWhatsApp = '+549000000000'; 

/**
 * Adds a new barber.
 * @param {{nombre:string, especialidad:string, whatsapp:string}} barberData
 */
export async function addBarber({ nombre, especialidad, whatsapp }) {
  try {
    const res = await query(
      `INSERT INTO peluqueros (nombre, especialidad, whatsapp) VALUES ($1, $2, $3) RETURNING *`,
      [nombre, especialidad, whatsapp]
    );
    return res.rows[0];
  } catch {
    const newId = memoryBarbers.length ? Math.max(...memoryBarbers.map(b => b.id)) + 1 : 1;
    const newBarber = { id: newId, nombre, especialidad, whatsapp };
    memoryBarbers.push(newBarber);
    return newBarber;
  }
}

/**
 * Updates an existing barber.
 */
export async function updateBarber(id, { nombre, especialidad, whatsapp }) {
  const barberId = parseInt(id, 10);
  try {
    const res = await query(
      `UPDATE peluqueros SET nombre = $1, especialidad = $2, whatsapp = $3 WHERE id = $4 RETURNING *`,
      [nombre, especialidad, whatsapp, barberId]
    );
    return res.rows[0];
  } catch {
    const idx = memoryBarbers.findIndex(b => b.id === barberId);
    if (idx !== -1) {
      memoryBarbers[idx] = { id: barberId, nombre, especialidad, whatsapp };
      return memoryBarbers[idx];
    }
    return null;
  }
}

/**
 * Deletes a barber.
 */
export async function deleteBarber(id) {
  const barberId = parseInt(id, 10);
  try {
    await query(`DELETE FROM peluqueros WHERE id = $1`, [barberId]);
    return true;
  } catch {
    const idx = memoryBarbers.findIndex(b => b.id === barberId);
    if (idx !== -1) {
      memoryBarbers.splice(idx, 1);
      return true;
    }
    return false;
  }
}

/**
 * Retrieves company WhatsApp number.
 */
export async function getCompanyWhatsApp() {
  try {
    const res = await query(`SELECT value FROM configuracion WHERE key = 'company_whatsapp'`);
    if (res.rows && res.rows.length) return res.rows[0].value;
  } catch { }
  return memoryCompanyWhatsApp;
}

/**
 * Sets company WhatsApp number.
 */
export async function setCompanyWhatsApp(number) {
  try {
    await query(`INSERT INTO configuracion (key, value) VALUES ('company_whatsapp', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [number]);
    return true;
  } catch {
    memoryCompanyWhatsApp = number;
    return true;
  }
}


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
  return memoryBarbers;
}

// New helper to expose barbers with WhatsApp numbers
export async function getBarbersWithWhatsApp() {
  // For now just return the same data as getBarbers, which includes whatsapp field
  return await getBarbers();
}

/**
 * Retrieves appointments for a given date and optional barber.
 */
export async function getAppointments(dateStr, barberId = null) {
  try {
    let sql = `
      SELECT t.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono,
       s.nombre as servicio_nombre, s.duracion_minutos,
       p.nombre as peluquero_nombre,
       p.whatsapp as peluquero_whatsapp
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
  // 2. Comprobación de conflicto con ventana de seguridad de 15 min entre cortes
  const serviceList = await getServices();
  const currentService = serviceList.find(s => s.id === sId) || { duracion_minutos: 30 };
  const requestedDuration = currentService.duracion_minutos || 30;
  const requestedStart = targetDate.getTime();
  const requestedTotalEnd = requestedStart + (requestedDuration + 15) * 60 * 1000; // corte + 15m ventana

  const existing = await getAppointments(targetDate.toISOString().split('T')[0], pId);
  const conflict = existing.some((apt) => {
    const existingStart = new Date(apt.fecha_hora).getTime();
    const existingDuration = apt.duracion_minutos || 30;
    const existingTotalEnd = existingStart + (existingDuration + 15) * 60 * 1000; // corte + 15m ventana
    // Solapamiento de intervalos: [inicioA, finA) se cruza con [inicioB, finB)
    return requestedStart < existingTotalEnd && requestedTotalEnd > existingStart;
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
    const createdApt = await getAppointmentById(newId);
    if (createdApt) {
      if (pId && createdApt.peluquero_whatsapp) {
        const barberMsg = encodeURIComponent(`Nuevo turno para ${createdApt.servicio_nombre} el ${targetDate.toLocaleString('es-AR')}`);
        sendWhatsAppMessage(createdApt.peluquero_whatsapp, barberMsg).catch(err => console.error('Error WhatsApp barbero:', err));
      }
      if (createdApt.cliente_telefono) {
        const confirmUrl = `/confirmar?id=${createdApt.id}`;
        const clientMsg = encodeURIComponent(`Hola ${createdApt.cliente_nombre}, tu turno para ${createdApt.servicio_nombre} el ${targetDate.toLocaleString('es-AR')} está pendiente. Confirma aquí: ${confirmUrl}`);
        sendWhatsAppMessage(createdApt.cliente_telefono, clientMsg).catch(err => console.error('Error WhatsApp cliente:', err));
      }
    }
    return createdApt;
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
      peluquero_nombre: barber.nombre,
      peluquero_whatsapp: barber.whatsapp,
    };

    memoryAppointments.push(newAppointment);
    // Notificación WhatsApp
    if (pId && barber && barber.whatsapp) {
      const barberMsg = encodeURIComponent(`Nuevo turno para ${service.nombre} el ${targetDate.toLocaleString('es-AR')}`);
      // Send to barber
      sendWhatsAppMessage(barber.whatsapp, barberMsg).catch(err => {
        console.error('Failed to notify barber via WhatsApp:', err);
      });
    }
    // Send confirmation to client
    if (client && client.telefono) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const confirmUrl = `${siteUrl}/confirmar?id=${newAppointment.id}`;
      const clientMsg = encodeURIComponent(`Hola ${client.nombre}, tu turno para ${service.nombre} el ${targetDate.toLocaleString('es-AR')} está pendiente. Por favor confirma aquí: ${confirmUrl}`);
      sendWhatsAppMessage(client.telefono, clientMsg).catch(err => {
        console.error('Failed to send client confirmation via WhatsApp:', err);
      });
    }
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
  let apt = null;
  try {
    await query(
      `UPDATE turnos SET estado = $1, confirmado = $2 WHERE id = $3`,
      [newStatus, isConfirmed, numericId]
    );
    apt = await getAppointmentById(numericId);
  } catch {
    const found = memoryAppointments.find((a) => a.id === numericId);
    if (found) {
      found.estado = newStatus;
      found.confirmado = isConfirmed;
      apt = found;
    }
  }

  if (apt && isConfirmed && apt.cliente_telefono) {
    const msg = encodeURIComponent(`Â¡Hola ${apt.cliente_nombre}! Tu turno #${apt.id} para ${apt.servicio_nombre} ha sido confirmado. Te esperamos en Cortes Relativos.`);
    sendWhatsAppMessage(apt.cliente_telefono, msg).catch(err => console.error('Error notif confirmacion:', err));
  }

  return apt;
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






