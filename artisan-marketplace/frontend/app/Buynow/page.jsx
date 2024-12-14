import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardTitle, CardDescription, CardFooter } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Alert } from '@components/ui/alert';

const BuyNow = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details from the backend or static data (e.g., based on productId)
    const fetchedProduct = {
      id: productId,
      name: `Product ${productId}`,
      price: `$${productId * 100}`,
      description: `Description of Product ${productId}`,
    };
    setProduct(fetchedProduct);
  }, [productId]);

  const handlePurchase = () => {
    alert('Purchase completed successfully!');
  };

  return (
    <div className="buy-now py-8">
      {product ? (
        <Card className="max-w-lg mx-auto shadow-lg">
          <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
          <CardDescription className="text-gray-600">{product.description}</CardDescription>
          <CardDescription className="text-lg font-bold mt-2">{product.price}</CardDescription>
          <CardFooter className="mt-4">
            <Button onClick={handlePurchase} className="bg-green-600 text-white hover:bg-green-700">
              Complete Purchase
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Alert className="bg-red-500 text-white p-4">
          <strong>Loading product details...</strong>
        </Alert>
      )}
    </div>
  );
};

export default BuyNow;
