import React, { useState } from 'react';
import CartButton from './cartButton';

function ShoppingCartList({ item, updateCart }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.productId }),
      });

      const result = await response?.json();

      if (!response.ok) {
        setError('Failed to add item to the cart');
      } else if (result?.success) {
        const updatedItem = result.cart.products.find(
          (prod) => prod.productId === item.productId
        );
        setQuantity(updatedItem?.quantity || 0);
        updateCart(item.productId, updatedItem?.quantity || 0);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to add item to the cart');
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
        body: JSON.stringify({ productId: item.productId }),
      });

      const result = await response?.json();

      if (!response.ok) {
        setError('Failed to remove item from the cart');
      } else if (result?.success) {
        const updatedItem = result.cart.products.find(
          (prod) => prod.productId === item.productId
        );
        setQuantity(updatedItem?.quantity || 0);
        updateCart(item.productId, updatedItem?.quantity || 0);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to remove item from the cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="py-4 flex justify-between">
      <div>
        <p className="font-medium">{item?.productName}</p>
        <p className="text-sm text-gray-500">Quantity: {quantity}</p>
      </div>
      <div>
        <p>₹{(item.productPrice * quantity).toFixed(2)}</p>
        <CartButton
          count={quantity}
          handlePlus={handleAddToCart}
          handleMinus={handleRemoveFromCart}
          buttonSize="h-3 w-3"
          textSize="text-xs"
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </li>
  );
}

export default ShoppingCartList;
