import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Fetch all orders for a customer
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ message: 'Authentication token missing' }, { status: 401 });
    }

    // Make an API call to fetch orders for the customer
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/orders/orders`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.value}` },
    });

    const data = await response.json();
    if (response.ok) {
      return NextResponse.json({ data, message: 'Orders fetched successfully' }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
