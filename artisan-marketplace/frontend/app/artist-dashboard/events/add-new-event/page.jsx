'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Component for displaying image previews
const ImagePreview = ({ image, onRemove, index }) => (
  <div className="relative inline-block mr-2 mb-2">
    <img src={image} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
    >
      X
    </button>
  </div>
);

export default function AddNewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [images, setImages] = useState([]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + newImages.length >= 5) break;
      const base64 = await convertToBase64(files[i]);
      newImages.push(base64);
    }

    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  useEffect(() => {
    setValue('images', images);
  }, [images, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //   'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the JWT token
        },
        body: JSON.stringify({
          ...data,
          dateOfEvent: new Date(data.dateOfEvent).toISOString(),
          images: images,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const result = await response.json();
      toast({
        title: "Event Created",
        description: "Your new event has been successfully created.",
      });
      router.push('/artist-dashboard/events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Add New Event</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select onValueChange={(value) => setValue("eventType", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
              {errors.eventType && <p className="text-red-500 text-sm">{errors.eventType.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfEvent">Date of Event</Label>
              <Input
                id="dateOfEvent"
                type="datetime-local"
                {...register("dateOfEvent", { required: "Date is required" })}
              />
              {errors.dateOfEvent && <p className="text-red-500 text-sm">{errors.dateOfEvent.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Images (Upload up to 5)</Label>
              <Input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
              <div className="mt-2">
                {images.map((image, index) => (
                  <ImagePreview key={index} image={image} onRemove={removeImage} index={index} />
                ))}
              </div>
              {images.length > 0 && <p className="mt-1 text-sm text-gray-600">{images.length} image(s) selected</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
