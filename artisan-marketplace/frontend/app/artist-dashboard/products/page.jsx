'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react';

const useImageCarousel = (images) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return { currentImageIndex, nextImage, prevImage };
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/artistsproducts',
            {
                method: 'GET',
                headers: {
                //   'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the JWT token
                },
              }
        ) ;
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Products</h1>

      <a href="/artist-dashboard/products/add-new-product" className="mb-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add New Product
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const { currentImageIndex, nextImage, prevImage } = useImageCarousel(product.images);

  return (
    <Card>
      <div className="relative">
        <img 
          src={product.images[currentImageIndex] || '/placeholder.svg?height=200&width=300'} 
          alt={product.name} 
          width={300} 
          height={200} 
          className="w-full h-48 object-cover"
        />
        {product.images.length > 1 && (
          <>
            <Button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1"
              onClick={prevImage}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1"
              onClick={nextImage}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}
      </div>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Category: {product.category}</p>
        <p className="text-sm text-gray-600">Average Rating: {product.averageRating}</p>
        <p className="text-2xl font-bold mb-4">₹{product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
        <p className="text-sm text-gray-600">Status: {product.status}</p>
        <p className="text-sm text-gray-600">Sales Count: {product.salesCount}</p>
        {product.discount > 0 && (
          <p className="text-sm text-green-600">Discount: {product.discount}%</p>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">Edit Product</Button>
      </CardFooter>
    </Card>
  );
}

