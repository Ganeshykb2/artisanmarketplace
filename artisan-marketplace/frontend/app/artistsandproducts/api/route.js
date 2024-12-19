import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/api/products/getArtistWithProducts');
    if (!response.ok) {
      throw new Error('Failed to fetch data from the server');
    }
    const data = await response.json();
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
