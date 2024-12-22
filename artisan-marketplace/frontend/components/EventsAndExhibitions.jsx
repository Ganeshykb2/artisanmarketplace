'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search } from 'lucide-react';
import {  usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

export default function EventsAndExhibitions() {
  const pathname = usePathname();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('all');
  const [events, setEvents] = useState([]);

  // Fetch events data
  useEffect(() => {
    async function fetchEvents() {
      const response = await fetch('/events/api/');
      const data = await response.json();
      if (data.data) {
        setEvents(data.data);
      }
    }
    fetchEvents();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const pathParts = pathname.split('/');
    const filteredParts = pathParts.filter(part => part && part !== 'events');
    if (filteredParts.length > 0) {
      const decodedSearchTerm = decodeURIComponent(filteredParts[0]);
      setSearchTerm(decodedSearchTerm);
    }
  }, [pathname]);

  // Modified search handler to update URL
  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (eventType === 'all' || event.eventType === eventType)
  );

  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(`events/api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventId),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for event');
      }
  
      alert(data.message || 'Successfully registered for the event!');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'An error occurred while registering');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Events and Exhibitions</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events"
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="meetup">Meetup</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
            <SelectItem value="government">Government</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.eventId} className="flex flex-row">
            <div className="w-1/1">
              {event.images && event.images.length > 0 ? (
                <Image
                  src={event.images[0]}
                  alt={`Event ${event.name}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="w-2/3 p-6 flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-2xl mb-1">{event.name}</CardTitle>
                  <CardDescription className="text-base mb-3">{event.eventType}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                    {new Date(event.dateOfEvent).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 opacity-70" /> {event.location}
                  </p>
                  <p className="mt-2 opacity-70">{event.description}</p>
                </CardContent>
              </div>
              <CardFooter>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleRegister(event.eventId)}
                >
                  Register for Event
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}