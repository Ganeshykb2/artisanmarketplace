import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CartButton from './cartButton';

function ProductCard({ product }) {
  const [addToCart, setAddToCart] = useState(0); // Default: Not in cart
  const [isLoading, setIsLoading] = useState(false); // Tracks ongoing requests
  const [error, setError] = useState(null);

  // Fetch initial cart quantity for this product
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch('/api/cart');
        const result = await response.json();
        if (response.ok) {
          const cartProduct = result.cart?.products?.find(
            (prod) => prod.productId === product.productId
          );
          setAddToCart(cartProduct?.quantity || 0); // Set cart quantity or default to 0
        }
      } catch (err) {
        console.error('Failed to fetch cart data:', err);
        setError('Failed to fetch cart data');
      }
    };

    fetchCartData();
  }, [product.productId]); // Depend only on the product ID

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.productId }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setAddToCart(result.cart?.products?.find((prod) => prod.productId === product.productId)?.quantity || 0);
      } else {
        setError('Failed to add item to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.productId }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setAddToCart(result.cart?.products?.find((prod) => prod.productId === product.productId)?.quantity || 0);
      } else {
        setError('Failed to remove item from cart');
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
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
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>By Artisan {product.artistId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">₹{product.price}</p>
        <div className="flex space-x-2">
          <Button className="flex-1">Buy Now</Button>
          {addToCart > 0 ? (
            <CartButton
              handleMinus={handleRemoveFromCart}
              handlePlus={handleAddToCart}
              count={addToCart}
              disabled={isLoading}
            />
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}

export default ProductCard;
