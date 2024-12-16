'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]); // Initialize products state as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/all-products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []); // Set products if data exists
      } catch (err) {
        setError('An error occurred while fetching products. Please try again later.');
      } finally {
        setIsLoading(false); // Stop loading once the API call is done
      }
    };

    fetchProducts();
  }, []);

  // Render loading state
  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // Render products
  return (
    <section className="my-12 px-6"> {/* Add margin above and below */}
      <h2 className="text-3xl font-semibold mb-6 text-center">All Products</h2> {/* Center the title */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.productId}>
              <Image
                src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} // Fallback to placeholder
                alt={`Product: ${product.name}`}
                width={300}
                height={200}
                className="w-full object-cover"
              />
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>By Artisan {product.artistId || 'Unknown'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">₹{product.price}</p>
                <div className="flex space-x-2">
                  <Button className="flex-1">Buy Now</Button>
                  <Button variant="outline" className="flex-1">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </section>
  );
}
