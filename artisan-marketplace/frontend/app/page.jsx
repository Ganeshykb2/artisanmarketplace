'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from './UserProvider'
import Products from '@/components/ui/Products'

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
          console.log(data.events)
          setUpcomingEvents(data.events);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };
    fetchArtistOfTheMonth();
    fetchUpcomingEvents();
  }, []);

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
                  <Button>View Profile</Button>
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
              <Card key={event.eventId} className="flex flex-col md:flex-row">
                <div className="w-full h-60 overflow-hidden">
                  <Image
                    src={event.images[0]}
                    alt={`Product ${event.name}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-2/3 flex flex-col">
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      {new Date(event.dateOfEvent).toLocaleDateString()} • {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{event.description}</p>
                    <Button className="mt-4">Learn More</Button>
                  </CardContent>
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
