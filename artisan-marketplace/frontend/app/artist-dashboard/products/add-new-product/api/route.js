import { message } from "antd";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req,res){ 
    try {
        const productData = await req?.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/products/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token?.value}`, // Include the JWT token
          },
          body: JSON.stringify(productData),
        });
        const product = await response?.json();
        if (response.ok) {
            return NextResponse.json({message: product?.message}, {status: product?.status});
        }
        return NextResponse.json({message: product?.message}, {status: product?.status});
    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
}    