'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
export default function EventsList() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/admin-dashboard/events/api')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        setEvents(data.data)
      } catch (err) {
        setError('An error occurred while fetching events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return <div className="text-center p-4">Loading events...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Events List</h1>
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.eventId} className="bg-white shadow-md rounded-lg overflow-hidden flex">
            <div className="w-1/3">
              <Image 
                src={event.images[0] || '/placeholder.svg?height=200&width=200'} 
                alt={event.name} 
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
            </div>
            <div className="w-2/3 p-4">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Type:</span> {event.eventType}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Date:</span> {format(new Date(event.dateOfEvent), 'PPP')}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Location:</span> {event.location}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Artist ID:</span> {event.artistId}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Event ID:</span> {event.eventId}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Description:</span> {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}