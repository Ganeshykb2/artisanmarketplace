import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    const response = await fetch('http://localhost:5000/api/events/getevents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.value}`, // Include the JWT token
      }
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ events: data.events }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
