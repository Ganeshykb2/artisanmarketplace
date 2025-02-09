'use client';
import React, { useState } from 'react';
import { Card, CardTitle, CardDescription, CardFooter } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Alert } from '@components/ui/alert';

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: '$100', quantity: 1 },
    { id: 2, name: 'Product 2', price: '$200', quantity: 2 },
    // Example cart items
  ]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
  };

  return (
    <div className="add-to-cart py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <div className="space-y-6">
            {cartItems.map(item => (
              <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                <CardDescription className="text-gray-600">Price: {item.price}</CardDescription>
                <CardDescription className="text-gray-600">Quantity: {item.quantity}</CardDescription>
                <CardFooter className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-red-500 text-white cursor-pointer" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </Badge>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Alert className="bg-yellow-500 text-black p-4">
          <strong>Your cart is empty.</strong>
        </Alert>
      )}
    </div>
  );
};

export default AddToCart;
