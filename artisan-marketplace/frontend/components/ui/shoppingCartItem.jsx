'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShoppingCartModal from './shoppingCartModal';

export function ShoppingCartItem() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Calculate total item count in the cart
  const itemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch the cart items from the API
  const getCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const cart = await response?.json();
      if (response.ok) {
        setCartItems(cart?.cart?.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  // Update cart items based on changes from child components
  const updateCart = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0) // Remove items with zero quantity
    );
  };

  // Load cart items on component mount
  useEffect(() => {
    getCart();
  }, []);

  // Open the cart modal and refresh cart data
  const openCart = async () => {
    await getCart();
    setIsCartOpen(true);
  };

  // Close the cart modal
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button
              onClick={openCart}
              variant="ghost"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <ShoppingCartModal
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cartItems}
        updateCart={updateCart} // Pass the updateCart function to the modal
      />
    </>
  );
}
