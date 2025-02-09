'use client'

import React, { useState } from 'react';
import Image from 'next/image'
export default function ArtistProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [artist, setArtist] = useState({
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    businessName: 'Jane Doe Artistry',
    specialization: ['Handloom', 'Embroidery'],
    DOB: new Date('1985-05-15'),
    AboutHimself: 'Passionate artisan specializing in traditional handloom techniques.',
    contact: {
      value: '+91 9876543210',
      verify: true
    },
    address: '123 Craft Street',
    city: 'Artisan City',
    state: 'Craftland',
    pincode: '123456',
    rating: 4.8,
    aadhar: 'XXXX-XXXX-XXXX',
    profileImage: '/placeholder.svg?height=100&width=100',
    profileViews: 1234,
    verified: true,
    createdAt: new Date('2020-01-01')
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setArtist(prevArtist => ({
      ...prevArtist,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real application, you would send this data to your backend
    console.log(artist);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const toggleEditing = () => {
    setIsEditing(prevState => !prevState);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Artist Profile</h1>
        <button onClick={toggleEditing} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Image
            src={artist.profileImage}
            alt={artist.name}
            className="w-full rounded-lg shadow-lg mb-4"
          />
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{artist.name}</h2>
            <p className="text-gray-600 mb-2">{artist.businessName}</p>
            <p className="mb-2">Rating: {artist.rating} / 5</p>
            <p className="mb-2">Profile Views: {artist.profileViews}</p>
            <p className="mb-2">Verified: {artist.verified ? 'Yes' : 'No'}</p>
            <p>Member since: {artist.createdAt.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
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
                name="contact.value"
                value={artist.contact.value}
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