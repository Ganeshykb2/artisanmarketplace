import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/products/getArtistWithProducts`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from the server');
    }
    const data = await response.json();
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
