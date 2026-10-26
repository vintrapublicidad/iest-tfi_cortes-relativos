import { NextResponse } from 'next/server';
import {
  getServices,
  getBarbers,
  getAppointments,
  createAppointment,
  addToWaitlist
} from '@/lib/data.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const barberId = searchParams.get('barberId');

    const [services, barbers, appointments] = await Promise.all([
      getServices(),
      getBarbers(),
      getAppointments(date, barberId)
    ]);

    return NextResponse.json({
      success: true,
      services,
      barbers,
      appointments
    });
  } catch (error) {
    console.error('Error fetching turnos data:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar la disponibilidad.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.type === 'waitlist') {
      const waitlistEntry = await addToWaitlist({
        clientName: body.clientName,
        clientPhone: body.clientPhone,
        serviceId: body.serviceId
      });
      return NextResponse.json({
        success: true,
        message: 'Te anotamos exitosamente en la lista de espera.',
        data: waitlistEntry
      }, { status: 201 });
    }

    const newAppointment = await createAppointment({
      clientName: body.clientName,
      clientPhone: body.clientPhone,
      clientEmail: body.clientEmail,
      serviceId: body.serviceId,
      barberId: body.barberId,
      dateTime: body.dateTime
    });

    return NextResponse.json({
      success: true,
      message: 'Turno solicitado con éxito.',
      appointment: newAppointment
    }, { status: 201 });
  } catch (error) {
    console.warn('Booking validation error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la reserva.' },
      { status: 400 }
    );
  }
}
