'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/artist-dashboard/orders/api');
        const data = await response.json();
        if (!response.ok) {
          setError(data?.message || "Failed to fetch orders");
          return;
        }
        setOrders(data?.orders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading orders...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))
        ) : (
          <div>No orders found.</div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/artist-dashboard/orders/api`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: order.orderId,status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the order status locally
      order.status = newStatus;
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Order #{order.orderId.slice(-6)}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer</h3>
            <p className="mt-1">{order.customerId}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Items</h3>
            <div className="mt-1 space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
            <p className="mt-1 text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
            <p className="mt-1 text-sm">{order.shippingAddress}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
            <p className="mt-1 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {order.status === 'pending' && (
          <>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusUpdate('delivered')}
              disabled={updating}
            >
              <Package className="mr-2 h-4 w-4" />
              Mark as Delivered
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={updating}
            >
              Cancel Order
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}