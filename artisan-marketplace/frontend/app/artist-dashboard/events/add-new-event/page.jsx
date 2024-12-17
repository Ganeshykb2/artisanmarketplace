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
import { message } from 'antd';

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
  const [messageData, setMessageData] = useState({ type: '', content: '' });

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
    setMessageData({ type: '', content: '' });

    const eventData = {
      ...data,
      images: images,
      dateOfEvent: new Date(data.dateOfEvent).toISOString(),
    };

    try {
      const response = await fetch('/artist-dashboard/events/add-new-event/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessageData({ type: 'error', content: result?.message || 'Failed to create event' });
        throw new Error('Failed to create event');
      }

      setMessageData({ type: 'success', content: result?.message || 'Event created successfully!' });
      router.push('/artist-dashboard/events');
    } catch (error) {
      console.error('Error creating event:', error);
      setMessageData({ type: 'error', content: 'Failed to create event. Please try again.' });
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
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Event Type */}
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

            {/* Date of Event */}
            <div className="space-y-2">
              <Label htmlFor="dateOfEvent">Date of Event</Label>
              <Input id="dateOfEvent" type="datetime-local" {...register("dateOfEvent", { required: "Date is required" })} />
              {errors.dateOfEvent && <p className="text-red-500 text-sm">{errors.dateOfEvent.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location", { required: "Location is required" })} />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description", { required: "Description is required" })} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Images (Upload up to 5)</Label>
              <Input type="file" id="images" accept="image/*" multiple onChange={handleImageChange} className="mt-1 block w-full" />
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

        {/* Display message */}
        {messageData.content && (
          <div className={`mt-4 p-4 ${messageData.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {messageData.content}
          </div>
        )}
      </Card>
    </div>
  );
}
