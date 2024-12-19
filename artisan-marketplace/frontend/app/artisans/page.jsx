//  frontend\app\artisans\page.jsx
'use client'
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/artisans/api");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setArtisans(data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching artisans:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Our Artisans</h1>
      <Link href={`/artistsandproducts/`} passHref>
        <Button className="my-4">View Artists & Products</Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artisans.map((artisan) => (
          <Card key={artisan.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={artisan.profileImage || "/placeholder.svg"}
                    alt={artisan.name}
                  />
                  <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {!artisan.verified && (
                  <Button className="absolute top-2 right-2">
                    Verify
                  </Button>
                )}
              </div>
              <h3 className="text-lg font-semibold">{artisan.name}</h3>
              <p className="text-sm text-gray-500">{artisan.email}</p>
              <p className="text-sm">{artisan.businessName}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {artisan.specialization.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
              <p className="mt-2"><strong>Phone:</strong> {artisan.phoneNumber}</p>
              <p><strong>Address:</strong> {artisan.address}, {artisan.city}, {artisan.state}, {artisan.pincode}</p>
              <p><strong>Rating:</strong> {artisan.rating.toFixed(1)}/5</p>
             
              <p><strong>Joined:</strong> {new Date(artisan.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center mt-2">
                {artisan.verified ? (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={artisan.verified ? "success" : "destructive"} className="ml-2">
                  {artisan.verified ? "Verified" : "Unverified"}
                </Badge>
              </div>

              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="additional-info">
                  <AccordionTrigger>Additional Information</AccordionTrigger>
                  <AccordionContent>
                    <p><strong>About:</strong> {artisan.AboutHimself}</p>
                   
                    {artisan.secondaryAddresses?.length > 0 && (
                      <div>
                        <p className="font-semibold mt-2">Secondary Addresses:</p>
                        <ul>
                          {artisan.secondaryAddresses.map((addr, index) => (
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
    </div>
  );
}
