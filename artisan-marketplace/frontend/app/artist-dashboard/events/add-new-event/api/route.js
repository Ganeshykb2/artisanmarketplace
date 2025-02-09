import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const eventData = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/events/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.value}`, // Include the JWT token
      },
      body: JSON.stringify(eventData),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({ message: result?.message }, { status: 200 });
    }

    return NextResponse.json({ message: result?.message }, { status: 400 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
