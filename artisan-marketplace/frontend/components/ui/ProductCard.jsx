import React, { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function ProductCard({product}) {
    const [error, setError] = useState(null);
    const [addToCart, setAddToCart] = useState("Add to Cart");

    const handleAddToCart = async () => {
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

  return (
    <Card>
        <Image
        src={product.images[0]}
        alt={`Featured product ${product.name}`}
        width={300}
        height={200}
        className="w-full object-cover"
        />
        <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>By Artisan {product.artistId}</CardDescription>
        </CardHeader>
        <CardContent>
        <p className="text-2xl font-bold mb-4">₹{product.price}</p>
        <div className="flex space-x-2">
            <Button className="flex-1">Buy Now</Button>
            <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addToCart}
            </Button>
        </div>
        </CardContent>
    </Card>
  )
}

export default ProductCard