'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ShoppingCartList from './shoppingCartList';

export default function ShoppingCartModal({ isOpen, onClose, items, updateCart }) {
  const total = items?.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {items?.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items?.map((item) => (
                <ShoppingCartList
                  key={item.productId}
                  item={item}
                  updateCart={updateCart}
                />
              ))}
            </ul>
          )}
        </div>
        {items?.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <p className="font-bold">Total:</p>
            <p className="font-bold">₹{total.toFixed(2)}</p>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={()=>{window.location.href='/Buynow'}}>Checkout</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
