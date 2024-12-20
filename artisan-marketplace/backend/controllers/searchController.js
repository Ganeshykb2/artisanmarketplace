// pages/api/search.js
import mongoose from 'mongoose';
import Products from '../models/Products.js';
import Artists from '../models/Artists.js';
import Events from '../models/Events.js';

export const search = async(req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.params;
  
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const searchRegex = new RegExp(query, 'i');

    // Search products
    const products = await Products.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ],
      status: 'available' // Only show available products
    })
    .select('productId name description price images category averageRating salesCount')
    .limit(10);

    // Search artists
    const artists = await Artists.find({
      $or: [
        { name: searchRegex },
        { businessName: searchRegex },
        { AboutHimself: searchRegex },
        { specialization: searchRegex }
      ],
      verified: true // Only show verified artists
    })
    .select('id name businessName specialization rating profileImage verified')
    .limit(10);

    // Search events
    const events = await Events.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { eventType: searchRegex },
        { location: searchRegex }
      ],
      dateOfEvent: { $gte: new Date() } // Only show upcoming events
    })
    .select('eventId name eventType dateOfEvent location description images')
    .limit(10);

    // Format results
    const formattedResults = [
      ...products.map(p => ({ ...p.toObject(), type: 'product' })),
      ...artists.map(a => ({ ...a.toObject(), type: 'artist' })),
      ...events.map(e => ({ ...e.toObject(), type: 'event' }))
    ];

    return res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Internal server error 232' });
  }
}