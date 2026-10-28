import { NextResponse } from 'next/server';
import { getBarbers, addBarber, updateBarber, deleteBarber } from '@/lib/data.js';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'einstein123';

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const querySecret = request.nextUrl.searchParams.get('token');
  return token === ADMIN_SECRET || querySecret === ADMIN_SECRET;
}

export async function GET() {
  try {
    const barbers = await getBarbers();
    return NextResponse.json({ success: true, barbers });
  } catch (error) {
    console.error('Error fetching barbers:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener barberos.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }
  try {
    const { nombre, especialidad, whatsapp } = await request.json();
    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ success: false, error: 'El nombre es obligatorio.' }, { status: 400 });
    }
    const newBarber = await addBarber({ nombre: nombre.trim(), especialidad: especialidad?.trim() || '', whatsapp: whatsapp?.trim() || '' });
    return NextResponse.json({ success: true, barber: newBarber }, { status: 201 });
  } catch (error) {
    console.error('Error adding barber:', error);
    return NextResponse.json({ success: false, error: 'Error al crear barbero.' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }
  try {
    const { id, nombre, especialidad, whatsapp } = await request.json();
    if (!id || !nombre || !nombre.trim()) {
      return NextResponse.json({ success: false, error: 'Identificador y nombre requeridos.' }, { status: 400 });
    }
    const updated = await updateBarber(id, { nombre: nombre.trim(), especialidad: especialidad?.trim() || '', whatsapp: whatsapp?.trim() || '' });
    return NextResponse.json({ success: true, barber: updated });
  } catch (error) {
    console.error('Error updating barber:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar barbero.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Identificador requerido.' }, { status: 400 });
    }
    const ok = await deleteBarber(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('Error deleting barber:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar barbero.' }, { status: 500 });
  }
}
