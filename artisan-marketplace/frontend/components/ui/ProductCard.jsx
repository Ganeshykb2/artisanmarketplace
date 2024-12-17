import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Minus } from 'lucide-react'
import CartButton from './cartButton'

function ProductCard({product}) {
    const [error, setError] = useState(null);
    const [addToCart, setAddToCart] = useState("");
    const [item, setItem] = useState(null);

    useEffect(()=>{
        const getCart = async () => {
            const response = await fetch('/api/cart');
            const result = await response?.json();
            if(response.ok){
                const prod = result?.cart?.products?.map(prod => {
                    if(prod.productId == product.productId){
                        return prod.quantity;
                    }
                });
                setAddToCart(prod);
            }
          }
          getCart();
    },[item]);

    const handleAddToCart = async () => {
        setItem("");
        try{
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({productId: product.productId}),
            });

            const result = await response?.json();

            if(!response.ok){
                setError("Failed to add item to the card");
            }
            if(result?.success){
                console.log(result);
                const prod = result?.cart?.products?.map(prod => {
                    if(prod.productId == product.productId){
                        return prod.quantity;
                    }
                });
                setAddToCart(prod);
            }
        }catch(err){
            console.log(err);
            setError("Failed to add item to the card");
        }
    }

    const handleRemoveFromCart =  async ()=> {
        setItem("");
        try{
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({productId: product.productId}),
            });

            const result = await response?.json();

            if(!response.ok){
                setError("Failed to add item to the card");
            }
            if(result?.success){
                console.log(result);
                const prod = result?.cart?.products?.map(prod => {
                    if(prod.productId == product.productId){
                        return prod.quantity;
                    }
                });
                setAddToCart(prod);
            }
        }catch(err){
            console.log(err);
        }
    }

  return (
    <Card>
        <div className="w-full h-60 overflow-hidden">
                <Image
                    src={product.images[0]}
                    alt={`Featured product ${product.name}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover top"
                    style={{
                        objectPosition: 'top' // Focus on the upper part of the image
                    }}
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
            {parseInt(addToCart) > 0?<CartButton handleMinus={handleRemoveFromCart} handlePlus={handleAddToCart} count={addToCart}/>: 
            <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>}
        </div>
        </CardContent>
    </Card>
  )
}

export default ProductCard