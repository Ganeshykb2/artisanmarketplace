'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const fetchOrders = async () => {
  try {
    const response = await fetch('/customer-dashboard/orders/api/');
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data.data.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackClick = () => {
    setSelectedOrder(null);
  };

  const OrderList = ({ orders, onOrderClick }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Order ID</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Total Amount</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{order.orderId}</td>
              <td className="py-2 px-4 border-b">{format(new Date(order.createdAt), 'PP')}</td>
              <td className="py-2 px-4 border-b">${order.totalAmount.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onOrderClick(order)}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const OrderDetails = ({ order, onBackClick }) => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Order ID: {order.orderId}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${order.totalAmount.toFixed(2)}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.shippingAddress}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(order.createdAt), 'PPpp')}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(order.updatedAt), 'PPpp')}</dd>
          </div>
          {order.deliveredAt && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Delivered At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(order.deliveredAt), 'PPpp')}</dd>
            </div>
          )}
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900">Order Items</h4>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          onClick={onBackClick}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
      {isLoading ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : selectedOrder ? (
        <OrderDetails order={selectedOrder} onBackClick={handleBackClick} />
      ) : (
        <OrderList orders={orders} onOrderClick={handleOrderClick} />
      )}
    </div>
  );
};

export default CustomerDashboard;

