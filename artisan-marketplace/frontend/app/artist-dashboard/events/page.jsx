'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function EventsPage({ initialEvents, error }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [loading, setLoading] = useState(!initialEvents && !error);

  useEffect(() => {
    if (!initialEvents && !error) {
      const fetchEvents = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/events/getevents',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the JWT token
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          const data = await response.json();
          setEvents(data.events);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Events</h1>
      <a href="/artist-dashboard/events/add-new-event" className="mb-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add New Event
      </a>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.eventType}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Location: {event.location}</p>
        <p className="text-sm text-gray-600">Description: {event.description}</p>
        <p className="text-sm text-gray-600">Participants: {event.participants.length}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Edit Event</Button>
      </CardFooter>
    </Card>
  );
}

