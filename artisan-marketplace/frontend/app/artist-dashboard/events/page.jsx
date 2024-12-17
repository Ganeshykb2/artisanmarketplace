'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const useImageCarousel = (images) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return { currentImageIndex, nextImage, prevImage };
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/artist-dashboard/events/api');
        const data = await response.json();
        if (!response.ok) {
          setError(data?.message || "Failed to fetch events");
          return;
        }
        setEvents(data?.events || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Events</h1>
     
      <a href="/artist-dashboard/events/add-new-event" className="mb-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add New Event
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading events...</div>  
        ) : error ? (
          <div>Error: {error}</div>  
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))
        ) : (
          <div>No events found.</div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const { currentImageIndex, nextImage, prevImage } = useImageCarousel(event.images || []);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  return (
    <Card>
      {event.images && event.images.length > 0 ? (
        <div className="relative">
          <img 
            src={event.images[currentImageIndex] || '/placeholder.svg?height=200&width=300'} 
            alt={event.name} 
            width={300} 
            height={200} 
            className="w-full h-48 object-cover"
          />
          {event.images.length > 1 && (
            <>
              <Button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1" onClick={prevImage}>
                <ChevronLeft size={20} />
              </Button>
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1" onClick={nextImage}>
                <ChevronRight size={20} />
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.eventType}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Location: {event.location}</p>
        <p className="text-sm text-gray-600">Description: {event.description}</p>
        
        <div className="mt-4 relative">
          <button 
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md transition-colors"
          >
            <Users className="mr-2 h-4 w-4" />
            Participants ({event.participants.length})
          </button>

          {isParticipantsOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {event.participants.length > 0 ? (
                event.participants.map((participant) => (
                  <div 
                    key={participant.participantId} 
                    className="px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{participant.name}</span>
                      <span className="text-xs text-gray-500">{participant.type}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-center">
                  No participants
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Edit Event</Button>
      </CardFooter>
    </Card>
  );
}