import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${API_BASE_URL}/admins/artistproducts`, {
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
        data: data.data || [], // Use data.data directly
        message: "Artists fetched successfully",
        total: data.total || 0
      }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    console.error("Error fetching the artist products", err);
    return NextResponse.json({ 
      message: "No reply from server", 
      data: [],
      total: 0
    }, { status: 500 });
  }
}