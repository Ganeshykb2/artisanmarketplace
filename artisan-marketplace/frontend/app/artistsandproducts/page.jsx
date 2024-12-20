'use client'
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ArtistsAndProductsPage() {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/artistsandproducts/api");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data?.data?.data);
        if (Array.isArray(data?.data?.data)) {
          setArtists(data?.data?.data);
        } else {
          throw new Error('Unexpected data format');
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching artists and products:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Artists and Their Products</h1>
      {artists.map((artist) => (
        <Card key={artist.id} className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                {artist.name}
                {artist.verified ? (
                  <CheckCircle className="ml-2 h-5 w-5 text-blue-500" />
                ) : (
                  <AlertCircle className="ml-2 h-5 w-5 text-red-500" />
                )}
              </div>
              <span className="text-sm text-gray-500">ID: {artist.id}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {artist.productFetchError ? (
              <p className="text-red-600">{artist.productFetchError}</p>
            ) : artist.products.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artist.products.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.status}</TableCell>
                      <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
