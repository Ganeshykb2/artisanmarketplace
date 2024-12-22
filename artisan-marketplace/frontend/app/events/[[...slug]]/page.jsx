// app/events/[[...slug]]/page.js
'use client';
import React from 'react';
import EventsAndExhibitions from '@/components/EventsAndExhibitions';  // Adjust import path as needed

export default function Page({ params }) {
  return <EventsAndExhibitions />;
}