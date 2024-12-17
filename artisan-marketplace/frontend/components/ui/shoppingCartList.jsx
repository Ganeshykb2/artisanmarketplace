import React, { useState } from 'react'
import CartButton from './cartButton'

function ShoppingCartList({item,setCart}) {

    const [error, setError] = useState(null);
    const [addToCart, setAddToCart] = useState("");

    const handleAddToCart = async () => {
        try{
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({productId: item.productId}),
            });

            const result = await response?.json();

            if(!response.ok){
                setError("Failed to add item to the card");
            }
            if(result?.success){
                console.log(result);
                const prod = result?.cart?.products?.map(prod => {
                    if(prod.productId == item.productId){
                        return prod.quantity;
                    }
                });
                setAddToCart(prod);
                setCart(prod);
            }
        }catch(err){
            console.log(err);
            setError("Failed to add item to the card");
        }
    }

    const handleRemoveFromCart =  async ()=> {
        try{
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({productId: item.productId}),
            });

            const result = await response?.json();

            if(!response.ok){
                setError("Failed to add item to the card");
            }
            if(result?.success){
                console.log(result);
                const prod = result?.cart?.products?.map(prod => {
                    if(prod.productId == item.productId){
                        return prod.quantity;
                    }
                });
                setAddToCart(prod);
                setCart(prod);
            }
        }catch(err){
            console.log(err);
        }
    }
  return (
    <li className="py-4 flex justify-between">
        <div>
        <p className="font-medium">{item?.productName}</p>
        <p className="text-sm text-gray-500">Quantity: {item?.quantity}</p>
        </div>
        <div>
        <p>₹{(item.productPrice * item.quantity).toFixed(2)}</p>
        <CartButton count={addToCart?addToCart:item.quantity} handlePlus={handleAddToCart} handleMinus={handleRemoveFromCart} buttonSize={"h-3 w-3"} textSize={"text-xs"}/>
        </div>
    </li>
  )
}

export default ShoppingCartList