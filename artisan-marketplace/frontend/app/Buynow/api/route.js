import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the request body to get order details
    const { productIds, quantities, shippingAddress } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse(JSON.stringify({ success: false, message: "Products are required to create an order" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!shippingAddress) {
      return new NextResponse(JSON.stringify({ success: false, message: "Shipping address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }


    // Get cookies to retrieve token
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    // Make API call to create the order
    const response = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({ productIds, quantities, shippingAddress }),
    });

    const result = await response.json();

    if (!response.ok) {
      return new NextResponse(JSON.stringify({ success: false, message: result.message || "Error creating order" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify({ success: true, message: result?.message, order: result.order }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, message: "Error creating order", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req){
    try{
        const url = new URL(req.url);
        const ordersParam = url.searchParams.get('orderId'); // 'orders' is the query parameter
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
    
        // Check if the 'orders' query parameter exists
        if (!ordersParam) {
          return new NextResponse(JSON.stringify({ error: 'Missing "orders" query parameter' }), {
            status: 400,
          });
        }

        const response = await fetch(`http://localhost:5000/api/orders/${ordersParam}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        const result = await response?.json();
        if(!response.ok){
            return new NextResponse(JSON.stringify({ success: false, message: result.message || "Error fetching order" }), {
                status: response.status,
                headers: { "Content-Type": "application/json" },
              });
        }
        console.log(result);
        return new NextResponse(JSON.stringify({ success: true, order: result.order }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

    }catch(error){
        console.log(error);
        return new NextResponse(JSON.stringify({ success: false, message: "Error creating order", error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
    }
}
