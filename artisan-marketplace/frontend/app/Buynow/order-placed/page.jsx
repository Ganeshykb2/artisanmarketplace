'use client'

import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'


export default function OrderSummary({ searchParams }) {
  // Check if we have the necessary parameters
//   if (!searchParams.orderId) {
//     notFound()
//   }
  const { orderId } = React.use(searchParams);
  const [order,setOrder] = useState({});

  useEffect(()=>{
    const fetchOders = async ()=> {
        const response = await fetch(`/Buynow/api?orderId=${orderId}`);

        if(!response.ok){
            throw new Error("Failed to fetch order");
        }

        const result = await response?.json();
        console.log(result);
        setOrder(result?.order);
    }
    fetchOders();
  },[]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-4 text-green-600">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Order Placed</span>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Order Summary</h1>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-semibold text-gray-800">{order?.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Shipping Address:</span>
            <span className="font-semibold text-gray-800">{order?.shippingAddress}</span>
          </div>
          <ul className="divide-y divide-gray-200">
              {order?.items?.map((item) => (
                <li key={item?.productId}className="py-4 flex justify-between">
                      <div>
                        <p className="font-medium">{item?.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item?.quantity}</p>
                      </div>
                      <div>
                        <p>₹{(item.price * item?.quantity).toFixed(2)}</p>
                      </div>
                    </li>
              ))}
            </ul>
          {/* <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-semibold text-gray-800">{items}</span>
          </div> */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold text-gray-800">₹{parseFloat(order?.totalAmount).toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  )
}

