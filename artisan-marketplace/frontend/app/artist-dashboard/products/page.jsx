'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export default function ProductsPage() {
  const [products, setProducts] = useState([
    {
      name: 'Handcrafted Vase',
      description: 'Beautiful handmade ceramic vase',
      price: 49.99,
      imageUrl: '/placeholder.svg?height=200&width=300',
      quantity: 10,
      category: 'Home Decor',
      status: 'available',
      averageRating: 4.5,
      salesCount: 25,
      discount: 0,
    },
    {
      name: 'Woven Basket',
      description: 'Traditional woven basket',
      price: 29.99,
      imageUrl: '/placeholder.svg?height=200&width=300',
      quantity: 15,
      category: 'Home Decor',
      status: 'available',
      averageRating: 4.2,
      salesCount: 18,
      discount: 5,
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Products</h1>

      <a href="/artist-dashboard/products/add-new-product" className="mb-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add New Product
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.name}>
            <Image src={product.imageUrl} alt={product.name} width={300} height={200} className="w-full object-cover" />
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription> {product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Category: {product.category}</p>
              <p className="text-sm text-gray-600">Average Rating: {product.averageRating}</p>
              <p className="text-2xl font-bold mb-4">₹{product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
              <p className="text-sm text-gray-600">Status: {product.status}</p>
              <p className="text-sm text-gray-600">Sales Count: {product.salesCount}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Edit Product</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}