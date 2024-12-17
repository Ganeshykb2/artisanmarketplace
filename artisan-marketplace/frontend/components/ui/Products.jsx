import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

function Products({productType}) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

        // Fetch Featured Products
        const fetchFeaturedProducts = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/products/featured-products');
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
        if(productType == 'Featured Products'){
            fetchFeaturedProducts();
        }
        if(productType == 'All Products'){
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => {
                return(
                  <ProductCard key={product.productId} product={product}/>
                );
              }  
              )
            ) : (
              <p>No featured products available</p>
            )}
          </div>
  )
}

export default Products