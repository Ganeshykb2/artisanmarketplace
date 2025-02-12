import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(req,res){
    
    try {
        const userData = await req?.json();
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await response.json();
        if(response.ok){
            const cookieStore = await cookies();
            cookieStore.set('token', data?.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
            });
            return NextResponse.json({message: data?.message, user: data?.user }, { status: 200 })
        } else {
            return NextResponse.json( {message: data?.message}, { status: 404 })
        }
    } catch(err){
        console.log(err);
    }
}