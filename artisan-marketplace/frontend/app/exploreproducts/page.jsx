'use client';

import React from 'react';

import Products from '@/components/ui/Products';

export default function ProductsPage() {

  return (
    <section className="my-12 px-6"> {/* Add margin above and below */}
      <h2 className="text-3xl font-semibold mb-6 text-center">All Products</h2> {/* Center the title */}
      <Products productType={'All Products'}></Products>
    </section>
  );
}
