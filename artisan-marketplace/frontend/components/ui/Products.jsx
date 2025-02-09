import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

function Products({ productType, filterFunction }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/products/all-products`);
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

    // Fetch Featured Products
    const fetchFeaturedProducts = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/products/featured-products`);
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('An error occurred while fetching products. Please try again later.');
      } finally {
        setIsLoading(false); // Stop loading once the API call is done
      }
    };

    if (productType === 'Featured Products') {
      fetchFeaturedProducts();
    }
    if (productType === 'All Products') {
      fetchProducts();
    }
  }, [productType]);

  // Render loading state
  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // Apply filtering logic
  const filteredProducts = filterFunction ? filterFunction(products) : products;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default Products;
