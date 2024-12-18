'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function UnverifiedArtists() {
  const [modal, setIsModalOpen] = useState(false);
  const [unverifiedArtists, setUnverifiedArtists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Calculate total item count in the cart

  const fetchUnverifiedArtists = async () => {
    setIsModalOpen(true);
    setLoading(true)
    try {
      const response = await fetch('/admin-dashboard/allartists/updateall/api', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
  
      if (!response.ok) throw new Error('Failed to fetch unverified artists')
      const { data } = await response.json() // Destructure data from the response
    console.log(data);
      setUnverifiedArtists(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error fetching unverified artists')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateUnverifiedArtists = async () => {
    setLoading(true)
    try {
      const response = await fetch('/admin-dashboard/allartists/updateall/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to update artists')
      const data = await response.json()
      fetchUnverifiedArtists();
    } catch (err) {
      setError('Error updating artists')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Close the cart modal
  const closeModel = () => setIsModalOpen(false);

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button onClick={fetchUnverifiedArtists} disabled={loading}>
                Fetch Unverified Artists with 5+ Orders
            </Button>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <Dialog open={modal} onOpenChange={closeModel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Unverified Artists</DialogTitle>
                </DialogHeader>
                {unverifiedArtists.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                    {unverifiedArtists.map((artist) => (
                        <li key={artist.id} className="py-4 flex justify-between">
                            <div>
                                <p className="font-medium">{artist.name}</p>
                                <p className="text-sm text-gray-500">Orders: {artist.orderCount}</p>
                            </div>
                        </li>
                    ))}
                    </ul>
                ):<p>No Unverified Artist with 5+ Orders found.</p>}
                
                <div className="mt-4 flex justify-end">
                {unverifiedArtists.length > 0 && <Button onClick={updateUnverifiedArtists} disabled={loading}>
                Update Unverified Artists
                </Button>}
                </div>
            </DialogContent>
        </Dialog>
      </div>
      
    </>
  );
}
