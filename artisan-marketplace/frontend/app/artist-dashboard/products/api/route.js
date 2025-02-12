import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const cookieStore = await cookies();
        const artistId = cookieStore?.get('id');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/products/artistsproducts/${artistId?.value}`);
        const prod = await response?.json();

        if(response.ok){
            return NextResponse.json({message: prod?.message,products: prod?.products}, {status: prod?.status});
        }

        return NextResponse.json({message: prod?.message}, {status: prod?.status});
    } catch(err){

        console.log(err);
        
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
    
}