import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Fetch all artists
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = await fetch("http://localhost:5000/api/admins/artists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.value}`,
      },
    });

    const data = await response.json();
    console.log(response);
    if (response.ok) {
      return NextResponse.json({
        data: data || [],
        message: "Artists fetched successfully",
        total: data.length || 0
      }, { status: 200 });
    }
    
    return NextResponse.json({ message: data.message }, { status: response.status });

  } catch (err) {
    console.error("Error fetching artists", err);
    return NextResponse.json({
      message: "No reply from server",
      data: [],
      total: 0
    }, { status: 500 });
  }
}



// Update a specific unverified artist to verified
export async function PUT_verify(req) {
  const { artistId } = await req.json();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = await fetch(`http://localhost:5000/api/admins/verify-artist/${artistId}`, {
      method: "PUT", // Corrected to PUT
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.value}`,
      },
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      return NextResponse.json({
        message: data.message || `Artist with ID ${artistId} verified successfully`,
      }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    console.error("Error verifying artist", err);
    return NextResponse.json({
      message: "No reply from server",
    }, { status: 500 });
  }
}
