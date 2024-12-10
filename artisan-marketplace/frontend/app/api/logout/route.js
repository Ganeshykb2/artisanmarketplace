import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(){
    try {
        const cookieStore = await cookies();
        cookieStore.delete('id');
        cookieStore.delete('name');
        cookieStore.delete('email');
        cookieStore.delete('type');
        return NextResponse.json( {message: "Log out Successfull"}, { status: 200 });
    } catch(err){
        console.log("Cookies Error",err);
        return NextResponse.json({message: "Bad Request" }, { status: 400 });
    } 
}