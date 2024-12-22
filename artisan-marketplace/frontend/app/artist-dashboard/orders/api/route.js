import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');


    const response = await fetch('http://localhost:5000/api/orders/artist/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.value}`,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch orders' }, 
        { status: response.status }
      );
    }

    return NextResponse.json(
      { orders: data || [] }, 
      { status: 200 }
    );

  } catch (err) {
    console.error('Error fetching artist orders:', err);
    return NextResponse.json(
      { message: "Something went wrong" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    // Parse the request body to get the status
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.value}`,
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update order' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Order status updated', order: data },
      { status: 200 }
    );

  } catch (err) {
    console.error('Error updating order status:', err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}