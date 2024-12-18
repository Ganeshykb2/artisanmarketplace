// admin-dashboard\allartists\api\updateall\api\route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Fetch unverified artists with orders 5 or more
export async function GET_unverified() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ message: 'Authentication token missing' }, { status: 401 });
    }

    const response = await fetch('http://localhost:5000/api/admins/unverified-artists', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.value}` },
    });

    const data = await response.json();
    if (response.ok) {
      return NextResponse.json({
        data: data || [],
        message: data.length > 0
          ? 'Unverified artists with 5+ orders fetched successfully'
          : 'No unverified artists with 5 or more orders found',
        total: data.length || 0,
      }, { status: 200 });
    }

    return NextResponse.json({
      message: data.message || 'No unverified artists found',
      data: [],
      total: 0,
    }, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching unverified artists' }, { status: 500 });
  }
}

  
// Update all unverified artists to verified
export async function PUT() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = await fetch("http://localhost:5000/api/admins/verify-all", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.value}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        message: data.message || "Unverified artists updated successfully",
      }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    console.error("Error updating unverified artists", err);
    return NextResponse.json({
      message: "No reply from server",
    }, { status: 500 });
  }
}