'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Products from '@/components/ui/Products';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname } from 'next/navigation';

export default function ProductsPage() {
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Effect to handle URL parameters
  useEffect(() => {
    const pathParts = pathname.split('/');
    const filteredParts = pathParts.filter(part => part && part !== 'exploreproducts');

    if (filteredParts.length > 0) {
      const decodedProductName = decodeURIComponent(filteredParts[0]);
      setSearchTerm(decodedProductName);
    }
  }, [pathname]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []); // Empty dependency array

  const handleCategoryChange = useCallback((value) => {
    setCategoryFilter(value);
  }, []);

  const handlePriceRangeChange = useCallback((value) => {
    setPriceRange(value);
  }, []);

  const filterProducts = useCallback((products) => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesPriceRange = (() => {
        if (priceRange === 'all') return true;
        const price = parseFloat(product.price);
        switch (priceRange) {
          case 'under1000':
            return price < 1000;
          case '1000to5000':
            return price >= 1000 && price <= 5000;
          case '5000plus':
            return price > 5000;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesPriceRange;
    });
  }, [searchTerm, categoryFilter, priceRange]);

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-4xl font-semibold mb-6 text-center">All Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products"
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="handicraft">Handicraft</SelectItem>
            <SelectItem value="textiles">Textiles</SelectItem>
            <SelectItem value="pottery">Pottery</SelectItem>
            <SelectItem value="jewelry">Jewelry</SelectItem>
            <SelectItem value="woodwork">Woodwork</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={handlePriceRangeChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under1000">Under ₹1,000</SelectItem>
            <SelectItem value="1000to5000">₹1,000 - ₹5,000</SelectItem>
            <SelectItem value="5000plus">Above ₹5,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Products productType="All Products" filterFunction={filterProducts} />
    </div>
  );
}
