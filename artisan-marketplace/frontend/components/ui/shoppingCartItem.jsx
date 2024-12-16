'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import ShoppingCartModal from './shoppingCartModal'

export function ShoppingCartItem() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])

  const itemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0)

  const openCart = async () => {
    setIsCartOpen(true);
    try{
      const response = await fetch('/api/cart');
      const cart = await response?.json();
      if(response.ok){
        const cartItems = cart?.cart
        setCartItems(cartItems?.products);
      }
    } catch(err){
      console.log(err);
    }
  }
  const closeCart = () => setIsCartOpen(false)

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button
              onClick={openCart}
              variant="ghost" size="icon"
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
      <ShoppingCartModal isOpen={isCartOpen} onClose={closeCart} items={cartItems} />
    </>
  )
}

