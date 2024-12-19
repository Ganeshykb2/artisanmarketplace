'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useUser } from './UserProvider'
import Products from '@/components/ui/Products'
import { Calendar, MapPin } from 'lucide-react'

export default function Home() {
  const { userName } = useUser();
  const [artistOfTheMonth, setArtistOfTheMonth] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Fetch Artist of the Month
    const fetchArtistOfTheMonth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/artists/artist-of-the-month');
        const data = await response.json();
        if (data.artist) {
          setArtistOfTheMonth(data.artist);
        }
      } catch (error) {
        console.error('Error fetching artist of the month:', error);
      }
    };

    // Fetch Upcoming Events
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events/upcoming');
        const data = await response.json();
        if (data.events) {
          setUpcomingEvents(data.events);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    // Fetch the data when the component is mounted
    fetchArtistOfTheMonth();
    fetchUpcomingEvents();
  }, []);

  const handleRegister = async (eventId) => {
    if (!eventId) {
      alert('Invalid event ID');
      return;
    }
  
    try {
      // Send a POST request to your Next.js API route for registration
      const response = await fetch('/events/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }), // Send the event ID in the body
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
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="space-y-12">
        {/* Welcome Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {userName ? `Welcome ${userName?.value} to Artisan Marketplace` : `Welcome to Artisan Marketplace`}
          </h1>
          <p className="text-xl mb-8">Discover and support the incredible artisans of Varanasi</p>
          <Button asChild>
            <Link href="/exploreproducts">
              Explore Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        {/* Featured Products Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">Featured Products</h2>
            <Products productType={'Featured Products'}></Products>
        </section>

        {/* Artist of the Month Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">Artist of the Month</h2>
          {artistOfTheMonth ? (
            <Card>
              <div className="md:flex">
                <Image
                  src={artistOfTheMonth.profileImage || '/placeholder.svg'}
                  alt={`Artist of the Month - ${artistOfTheMonth.name}`}
                  width={300}
                  height={300}
                  className="w-full md:w-1/3 object-cover"
                />
                <div className="p-6">
                  <CardTitle className="text-2xl mb-2">{artistOfTheMonth.name}</CardTitle>
                  <CardDescription className="mb-4">
                    Specializing in {artistOfTheMonth.specialization?.join(', ') || 'Craftsmanship'}
                  </CardDescription>
                  <p className="mb-4">
                    {artistOfTheMonth.AboutHimself ||
                      'An exceptional artist creating unique and high-quality products.'}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <p>No artist of the month available</p>
          )}
        </section>

        {/* Upcoming Events Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.eventId} className="flex flex-row">
                  <div className="w-1/1">
                    <Image
                      src={event.images[0]}
                      alt={`Event ${event.name}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-1">{event.name}</CardTitle>
                      <CardDescription className="text-base mb-3">{event.eventType}</CardDescription>
                      
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" /> 
                          {new Date(event.dateOfEvent).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 opacity-70" /> {event.location}
                        </p>
                        <p className="mt-2 opacity-70">{event.description}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" onClick={() => handleRegister(event.eventId)}>Register for Event</Button>
                  </div>
                </Card>
              ))
            ) : (
              <p>No upcoming events available</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
