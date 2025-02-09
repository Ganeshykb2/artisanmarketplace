//events/api/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/events/getAllEvents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ 
        data: data || [], 
        message: "Events fetched successfully",
        total: data.length || 0 
      }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    console.error("Error fetching the events", err);
    return NextResponse.json({ 
      message: "No reply from server", 
      data: [],
      total: 0
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const eventId = await req?.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    // Enhanced token validation
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Log token for debugging (remove in production)
    console.log('Token found:', token?.value);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${API_BASE_URL}/api/events/${eventId}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token?.value}`,
        },
      }
    );

    // Log response status for debugging (remove in production)
    console.log('Backend response status:', response.status);

    const data = await response.json();

    if (response.status === 401) {
      return NextResponse.json(
        { success: false, message: data?.message },
        { status: 401 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: data?.message,
      data
    });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { 
        success: false, 
        message: err.message || "Failed to register for event"
      },
      { status: err.status || 500 }
    );
  }
}
