import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = await fetch("http://localhost:5000/api/admins/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.value}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Directly return the data structure from the backend
      return NextResponse.json({ 
        data: data || [], // Use data directly if the backend sends an array of events
        message: "Events fetched successfully",
        total: data.length || 0 // Total number of events
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
