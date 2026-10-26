import { NextResponse } from 'next/server';
import {
  getAllAppointments,
  getWaitlistEntries,
  getAdminMetrics,
  updateAppointmentStatus
} from '@/lib/data.js';

// Clave simple para el administrador (puede configurarse con ADMIN_SECRET en .env)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'einstein123';

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const querySecret = request.nextUrl.searchParams.get('token');
  return token === ADMIN_SECRET || querySecret === ADMIN_SECRET;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Acceso no autorizado. Clave requerida.' },
      { status: 401 }
    );
  }

  try {
    const [appointments, waitlist, metrics] = await Promise.all([
      getAllAppointments(),
      getWaitlistEntries(),
      getAdminMetrics(),
    ]);

    return NextResponse.json({
      success: true,
      appointments,
      waitlist,
      metrics,
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor al obtener datos administrativos.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Acceso no autorizado.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, id, estado } = body;

    if (action === 'update_status') {
      if (!id || !estado) {
        return NextResponse.json(
          { success: false, error: 'Faltan parámetros id o estado.' },
          { status: 400 }
        );
      }

      const updated = await updateAppointmentStatus(id, estado);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: 'Turno no encontrado.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        appointment: updated,
        message: `Estado actualizado a "${estado}".`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Acción no reconocida.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in admin POST route:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud del administrador.' },
      { status: 500 }
    );
  }
}
