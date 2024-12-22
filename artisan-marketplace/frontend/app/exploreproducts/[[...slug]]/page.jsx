// app/exploreproducts/[[...slug]]/page.js
'use client';
import React from 'react';
import ProductsPage from '@/components/ProductsPage';  // Adjust this import based on your file structure

export default function Page({ params }) {
  return <ProductsPage />;
}