import { NextResponse } from 'next/server';
import { getCompanyWhatsApp, setCompanyWhatsApp } from '@/lib/data.js';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'einstein123';

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const querySecret = request.nextUrl.searchParams.get('token');
  return token === ADMIN_SECRET || querySecret === ADMIN_SECRET;
}

export async function GET() {
  try {
    const number = await getCompanyWhatsApp();
    return NextResponse.json({ success: true, number });
  } catch (error) {
    console.error('Error fetching company WhatsApp:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener número de empresa.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }
  try {
    const { number } = await request.json();
    if (!number || typeof number !== 'string') {
      return NextResponse.json({ success: false, error: 'Número inválido.' }, { status: 400 });
    }
    await setCompanyWhatsApp(number.trim());
    return NextResponse.json({ success: true, number: number.trim() });
  } catch (error) {
    console.error('Error setting company WhatsApp:', error);
    return NextResponse.json({ success: false, error: 'Error al guardar número de empresa.' }, { status: 500 });
  }
}
