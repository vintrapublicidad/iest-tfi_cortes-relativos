import { NextResponse } from 'next/server';
import { getAppointmentById, confirmAppointment, cancelAppointment } from '@/lib/data.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Identificador de turno requerido.' },
        { status: 400 }
      );
    }

    const appointment = await getAppointmentById(id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'No se encontró el turno solicitado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar el turno.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Identificador de turno requerido.' },
        { status: 400 }
      );
    }

    if (action === 'cancel') {
      const canceled = await cancelAppointment(id);
      if (!canceled) {
        return NextResponse.json(
          { success: false, error: 'No se pudo cancelar el turno.' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'El turno ha sido cancelado exitosamente.'
      });
    }

    // Default action: confirm
    const updated = await confirmAppointment(id);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'No se pudo confirmar el turno especificado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '¡Asistencia confirmada con éxito! Te esperamos.',
      appointment: updated
    });
  } catch (error) {
    console.error('Error in appointment action:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
