'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { UnverifiedArtists } from '@/components/ui/unverifiedArtist'

export default function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllArtists()
  }, [])

  const fetchAllArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/admin-dashboard/allartists/api');

      if (!response.ok) throw new Error('Failed to fetch artists');
      const { data } = await response.json();
      console.log(data);
      setArtists(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const verifyArtist = async (artistId) => {
    setLoading(true)
    try {
      const response = await fetch('/admin-dashboard/allartists/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artistId }),
      })

      if (!response.ok) throw new Error('Failed to verify artist')
      const data = await response.json()
      alert(data.message)
      fetchAllArtists() // Refresh the list after verification
    } catch (err) {
      setError('Error verifying artist')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Artists Management</h1>
      
      <div className="flex space-x-4 mb-4">
        <UnverifiedArtists></UnverifiedArtists>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>All Artists</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artists.map((artist) => (
                <Card key={artist.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={artist.profileImage} alt={artist.name} />
                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {!artist.verified && (
                        <Button 
                          onClick={() => verifyArtist(artist.id)}
                          className="absolute top-2 right-2"
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{artist.name}</h3>
                    <p className="text-sm text-gray-500">{artist.email}</p>
                    <p className="text-sm">{artist.businessName}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {artist.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                    <p className="mt-2"><strong>Phone:</strong> {artist.phoneNumber}</p>
                    <p><strong>DOB:</strong> {new Date(artist.DOB).toLocaleDateString()}</p>
                    <p><strong>Address:</strong> {artist.address}, {artist.city}, {artist.state}, {artist.pincode}</p>
                    <p><strong>Rating:</strong> {artist.rating.toFixed(1)}/5</p>
                    <p><strong>Profile Views:</strong> {artist.profileViews}</p>
                    <p><strong>Joined:</strong> {new Date(artist.createdAt).toLocaleDateString()}</p>
                    <p><strong>Orders:</strong> {artist.orderCount}</p>
                    <div className="flex items-center mt-2">
                      {artist.verified ? (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Badge variant={artist.verified ? "success" : "destructive"} className="ml-2">
                        {artist.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    
                    <Accordion type="single" collapsible className="mt-4">
                      <AccordionItem value="additional-info">
                        <AccordionTrigger>Additional Information</AccordionTrigger>
                        <AccordionContent>
                          <p><strong>About:</strong> {artist.AboutHimself}</p>
                          <p><strong>Aadhar:</strong> {artist.aadhar}</p>
                          {artist.secondaryAddresses?.length > 0 && (
                            <div>
                              <p className="font-semibold mt-2">Secondary Addresses:</p>
                              <ul>
                                {artist.secondaryAddresses.map((addr, index) => (
                                  <li key={index} className="mt-1">
                                    {addr.address}, {addr.city}, {addr.state}, {addr.country}, {addr.pincode}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
