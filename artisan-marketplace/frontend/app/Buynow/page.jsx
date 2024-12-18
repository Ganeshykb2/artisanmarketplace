'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription, CardFooter, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';
import CartButton from '@/components/ui/cartButton';
import ShoppingCartList from '@/components/ui/shoppingCartList';

const BuyNow = () => {
  const [product, setProduct] = useState({});
  const [cartItems, setCartItems] = useState([]);

  const total = cartItems?.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  const searchParams = useSearchParams()
 
  const productId = searchParams.get('productId')

  const getCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const cart = await response?.json();
      if (response.ok) {
        setCartItems(cart?.cart?.products || []);
        console.log(cart?.cart?.products);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    // Fetch product details from the backend or static data (e.g., based on productId)
    const getProduct = async ()=>{
      try{
        const response = await fetch(`http://localhost:5000/api/products/product-id/${productId}`);
        const result = await response?.json();
        if(!response.ok){
          throw new Error("Failed to fetch product");
        }
        setProduct(result?.product);
      }catch(err){
        console.log(err)
      }
    }
    if(productId){
      getProduct();
    } else {
      getCart();
    }
    
  }, []);

  
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
  

  const handlePurchase = () => {
  };

  return (
    <div className="buy-now py-8">
      {product?.productId ? (
        <Card className="max-w-lg mx-auto shadow-lg">
          <div className="w-full h-60 overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={`Product ${product.name}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{product?.name}</CardTitle>
            <CardDescription className="text-gray-600">{product?.description}</CardDescription>
          </CardHeader>
          <CardContent> 
            <CardDescription>By Artisan {product.artistId}</CardDescription>
            <CardDescription className="text-lg font-bold mt-2">₹{product?.price}</CardDescription>
          </CardContent>
          <CardFooter className="mt-4">
            <Button onClick={handlePurchase} className="bg-green-600 text-white hover:bg-green-700">
              Place Order
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="max-w-lg mx-auto mt-4">
        {cartItems?.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cartItems?.map((item) => (
              <ShoppingCartList
              key={item.productId}
              item={item}
              updateCart={updateCart}
            />
            ))}
          </ul>
        )}
        {cartItems?.length > 0 && (
          <div>
            <div className="mt-4 flex justify-between items-center">
              <p className="font-bold">Total:</p>
              <p className="font-bold">₹{total.toFixed(2)}</p>
            </div>
            <div className='flex justify-center py-6'>
              <Button className="bg-green-600 text-white hover:bg-green-700">Place Order</Button>
            </div>
          </div>
          
        )}
      </div>
      )}
    </div>
  );
};

export default BuyNow;
