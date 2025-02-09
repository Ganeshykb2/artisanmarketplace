'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
export default function ArtistProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artist, setArtist] = useState({
    id: '',
    name: '',
    email: '',
    businessName: '',
    specialization: ["handmade", "potter"],
    DOB: "2024-12-17T00:00:00.000Z",
    AboutHimself: '',
    phoneNumber: '', 
    address: '',
    city: '',
    state: '',
    pincode: '',
    rating: 0,
    aadhar: '',
    profileImage: '/placeholder.svg?height=100&width=100',
    profileViews: 0,
    verified: false,
    createdAt: null
  });

  // Fetch artist profile
  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/artist-dashboard/profile/api', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        // Use the first artist from the array if it exists
        const artistData = data.artist[0] || {};

        // Update artist state with fetched data
        setArtist(prevArtist => ({
          ...prevArtist,
          ...artistData,
          specialization: artistData.specialization || prevArtist.specialization,
          DOB: artistData.DOB || prevArtist.DOB
        }));
        
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setArtist(prevArtist => ({
      ...prevArtist,
      [name]: value
    }));
  };

  // Handle specialization changes
  const handleSpecializationChange = (event) => {
    const { value, checked } = event.target;
    setArtist(prevArtist => {
      const currentSpecializations = prevArtist.specialization || [];
      
      if (checked) {
        // Add specialization if not already present
        return {
          ...prevArtist,
          specialization: [...currentSpecializations, value]
        };
      } else {
        // Remove specialization
        return {
          ...prevArtist,
          specialization: currentSpecializations.filter(spec => spec !== value)
        };
      }
    });
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtist(prevArtist => ({
          ...prevArtist,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Prepare data for submission
      const submissionData = {
        ...artist,
      };
      
      const response = await fetch('/artist-dashboard/profile/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update artist state with response data
      const updatedArtist = data.artist[0] || data.artist;
      setArtist({
        ...updatedArtist,
      });
      
      // Exit editing mode
      setIsEditing(false);
      
      // Show success toast
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(prevState => !prevState);
  };

  // Render loading state
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Error: {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Artist Profile</h1>
        <button 
          onClick={toggleEditing} 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="relative">
            <Image
              src={artist.profileImage}
              alt={artist.name}
              className="w-full rounded-lg shadow-lg mb-4"
              width={400}
              height={400}
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <label className="text-white cursor-pointer">
                  Upload Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
              </div>
            )}
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{artist.name}</h2>
            <p className="text-gray-600 mb-2">{artist.businessName}</p>
            <p className="mb-2">Rating: {artist.rating} / 5</p>
            <p className="mb-2">Profile Views: {artist.profileViews}</p>
            <p className="mb-2">Verified: {artist.verified ? 'Yes' : 'No'}</p>
            <p>Member since: {artist.createdAt ? new Date(artist.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'N/A'}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={artist.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="DOB"
                value={artist.DOB ? new Date(artist.DOB).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={artist.businessName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <div className="mt-1 flex space-x-4">
                {['handmade', 'potter', 'sculpture', 'painting'].map(spec => (
                  <label key={spec} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="specialization"
                      value={spec}
                      checked={artist.specialization?.includes(spec)}
                      onChange={handleSpecializationChange}
                      disabled={!isEditing}
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 capitalize">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={artist.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                name="AboutHimself"
                value={artist.AboutHimself}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={artist.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adhaar Number</label>
              <input
                type="text"
                name="aadhar"
                value={artist.aadhar}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={artist.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={artist.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={artist.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
              
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={artist.pincode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            {isEditing && (
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}