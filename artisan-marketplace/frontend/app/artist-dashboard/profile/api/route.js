import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token');
      const response = await fetch('http://localhost:5000/api/artists/getartistdetails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token?.value}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        return NextResponse.json({ artist: data.artist }, {message:data.message},{ status: 200 });
      }
      return NextResponse.json({ message: data.message }, { status: response.status });
    } catch (err) {
      return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
  }
  
  // UPDATE artist profile
export  async function PUT(request) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token');
      const body = await request.json();
      
      const response = await fetch('http://localhost:5000/api/artists/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token?.value}`,
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      if (response.ok) {
        return NextResponse.json({ artist: data.artist }, { status: 200 });
      }
      return NextResponse.json({ message: data.message }, { status: response.status });
    } catch (err) {
      return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
  }
