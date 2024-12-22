// app/artisans/[[...slug]]/page.js
'use client';
import React from 'react';
import ArtisansPage from '@/components/ArtisansPage';  // Adjust import path as needed

export default function Page({ params }) {
  return <ArtisansPage />;
}