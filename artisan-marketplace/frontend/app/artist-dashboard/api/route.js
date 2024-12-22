
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    const response = await fetch('http://localhost:5000/api/artists/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token?.value}`, // Include the JWT token
        }
      });
  
      const data = await response.json();
    
    return NextResponse.json({ data
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}