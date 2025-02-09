import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Fetch all artists
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!token?.value) {
      return NextResponse.json({ message: 'Authentication token missing' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/admins/artists`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.value}` },
    });

    const data = await response.json();
    if (response.ok) {
      return NextResponse.json({ data, message: 'Artists fetched successfully' }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching artists' }, { status: 500 });
  }
}

// Verify a specific artist
export async function PUT(req) {
  try {
    const { artistId } = await req.json();
    if (!artistId) {
      return NextResponse.json({ message: 'Artist ID is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ message: 'Authentication token missing' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/admins/verify-artist/${artistId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
    });

    const data = await response.json();
    if (response.ok) {
      return NextResponse.json({ message: data.message }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: 'Error verifying artist' }, { status: 500 });
  }
}
