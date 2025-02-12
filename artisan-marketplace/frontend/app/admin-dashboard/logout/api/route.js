// frontend/app/admin-dashboard/logout/api/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token', { path: '/' }); // Make sure cookie deletion is scoped correctly
    const API_NOT_BASE = process.env.NOT_BASE;
    // Redirect to the login page after successful logout
    return NextResponse.redirect(`${API_NOT_BASE}/admin-dashboard/login`);
  } catch (err) {
    console.error('Error clearing cookies:', err);
    return NextResponse.json(
      { message: 'Bad Request' },
      { status: 400 }
    );
  }
}
