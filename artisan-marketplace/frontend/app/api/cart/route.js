import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try{
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("cart");
    const token = cookieStore.get('token');
    let cart = cartCookie ? JSON.parse(cartCookie.value) : [];

    const response = await fetch('http://localhost:5000/api/carts/get-cart',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token?.value}` },
  })

  const result = await response?.json();
  if(!response.ok){
    return new NextResponse(JSON.stringify({ success: false, message: "Cart Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
    return new NextResponse(JSON.stringify({ success: true, cart: result?.cart }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }catch(err){
    return new NextResponse(JSON.stringify({ success: false, message: "Error getting cart items", err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    // Parse the request body to get product details
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return new NextResponse(JSON.stringify({ success: false, message: "Product ID is required" }), {
        status: 400,
      });
    }

    // Get cookies and retrieve the cart
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("cart");
    const token = cookieStore.get('token');
    let cart = cartCookie ? JSON.parse(cartCookie.value) : [];

    // Check if the product already exists in the cart
    const productIndex = cart.findIndex(item => item.productId === productId);

    if (productIndex > -1) {
      // If product exists, update the quantity
      cart[productIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.push({ productId, quantity });
    }

    // Serialize the updated cart and set it in the cookies
    cookieStore.set("cart", JSON.stringify(cart), { 
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    });

    const response = await fetch('http://localhost:5000/api/carts/add-item',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token?.value}` },
        body: JSON.stringify({productId}),
    })

    const result = await response?.json();
    
  console.log(result);
    if(!response.ok){
      return new NextResponse(JSON.stringify({ success: false, message: "Error updating cart" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify({ success: true, cart: result?.cart }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, message: "Error updating cart", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}