import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = await fetch("http://localhost:5000/api/contact/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.value}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ 
        data: data.data || [], // Use data.data directly
        message: "Contact messages fetched successfully"
      }, { status: 200 });
    }

    return NextResponse.json({ message: data.message }, { status: response.status });
  } catch (err) {
    console.error("Error fetching the contact messages", err);
    return NextResponse.json({ 
      message: "No reply from server", 
      data: []
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Message ID is required" }, { status: 400 });
    }

    const response = await fetch(`http://localhost:5000/api/contact/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.value}`,
      },
    });

    if (response.ok) {
      return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ message: data.message }, { status: response.status });
    

  } catch (err) {
    console.error("Error deleting the message", err);
    return NextResponse.json({ 
      message: "No reply from server" 
    }, { status: 500 });
  }
}
