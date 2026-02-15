import { NextResponse } from 'next/server';

/**
 * POST /api/auth/reset-password
 * Restablece la contraseña del usuario (No implementado)
 */
export async function POST() {
    return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
