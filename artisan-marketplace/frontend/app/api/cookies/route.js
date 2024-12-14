import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(){
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('id');
        const userName = cookieStore.get('name');
        const userEmail = cookieStore.get('email');
        const userType = cookieStore.get('type');
        return NextResponse.json({user: {userId, userName, userEmail, userType} }, { status: 200 });
    } catch(err){
        console.log("Cookies Error",err);
        return NextResponse.json({message: "Bad Request" }, { status: 400 });
    } 
}