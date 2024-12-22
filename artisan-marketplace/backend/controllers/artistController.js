// artisan-marketplace\backend\controllers\artistController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Artists from '../models/Artists.js';  
import Events from '../models/Events.js';
import Orders from '../models/Orders.js'
import Products from '../models/Products.js';

// Create new artist (open)
export const createArtist = async (req, res) => {
  const { name, email, password, businessName, specialization, DOB, AboutHimself, phoneNumber, address, city, state, pincode, aadhar, image } = req.body;
  
  console.log("Console log",req.body);
  try {
    // Check if the artist exists
    const existingArtist = await Artists.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ message: 'Artist already exists' });
    }

    // Hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new artist instance with hashed password
    const newArtist = new Artists({
      name,
      email,
      password: hashedPassword,
      businessName,
      specialization,
      DOB,
      AboutHimself,
      phoneNumber,
      address,
      city,
      state,
      pincode,
      aadhar,
      profileImage : image,
    });

    // Save the new artist to the database
    await newArtist.save();
    res.status(201).json({ message: "Artist created successfully", artist: newArtist });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// Get all artists (open to everyone, no authorization required)
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artists.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//functions to get the product data 
// Function to get product distribution based on order counts
async function getProductDistribution(artistId) {
  try {
    // First get all orders that contain products from this artist
    const orders = await Orders.find({
      artistIds: artistId,
      status: { $ne: 'cancelled' } // Exclude cancelled orders
    });

    // Create a map to store product order counts
    const productOrderCounts = {};

    // Go through each order and count products
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productOrderCounts[item.name]) {
          productOrderCounts[item.name] = {
            count: 0,
            totalQuantity: 0
          };
        }
        productOrderCounts[item.name].count += 1;
        productOrderCounts[item.name].totalQuantity += item.quantity;
      });
    });

    // Format the data for the pie chart
    const formattedProductData = Object.entries(productOrderCounts).map(([name, data]) => ({
      name,
      value: data.totalQuantity // Using total quantity ordered as the value
    }));

    // Sort by value in descending order
    formattedProductData.sort((a, b) => b.value - a.value);

    // If you want to limit to top N products, uncomment and modify this line
    // return formattedProductData.slice(0, 5);

    return formattedProductData;
  } catch (error) {
    console.error('Error getting product distribution:', error);
    throw error;
  }
}

// Alternative method using aggregation pipeline for better performance
async function getProductDistributionAggregated(artistId) {
  try {
    const productDistribution = await Orders.aggregate([
      // Match orders for this artist that aren't cancelled
      {
        $match: {
          artistIds: artistId,
          status: { $ne: 'cancelled' }
        }
      },
      // Unwind the items array to process each item separately
      {
        $unwind: '$items'
      },
      // Group by product name and sum quantities
      {
        $group: {
          _id: '$items.name',
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      // Format the output to match the required structure
      {
        $project: {
          name: '$_id',
          value: '$totalQuantity',
          _id: 0
        }
      },
      // Sort by value in descending order
      {
        $sort: { value: -1 }
      }
    ]);

    return productDistribution;
  } catch (error) {
    console.error('Error getting product distribution:', error);
    throw error;
  }
}

//get artist details for artist dashboard
export const dashBoard = async (req, res) => {
  try {
    // Get artist details from token (assuming you have middleware to decode JWT)
    const artistId = req.user.id; // Replace with actual JWT decode logic

    // Get artist details
    const artist = await Artists.findOne({ id: artistId });
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Get sales data for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await Orders.find({
      artistIds: artistId,
      createdAt: { $gte: sixMonthsAgo }
    });

    // Calculate monthly sales
    const salesData = Array(6).fill(0).map((_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - index);
      const month = date.toLocaleString('default', { month: 'short' });
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === date.getMonth() &&
               orderDate.getFullYear() === date.getFullYear();
      });
      return {
        month,
        sales: monthOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      };
    }).reverse();

    // Get product distribution using the aggregation method
    const productData = await getProductDistributionAggregated(artistId);

    // Calculate key metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const rating = artist.rating || 0;

    return res.status(200).json({
      artist: {
        name: artist.name,
        businessName: artist.businessName,
        profileImage: artist.profileImage,
        specialization: artist.specialization,
        city: artist.city,
        state: artist.state
      },
      salesData,
      productData,
      metrics: {
        totalRevenue,
        completedOrders,
        rating
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};



//Get artist complete details
export const getArtistsDetails = async (req, res) => {
  try {
    const artist = await Artists.find({id: req.user.id});
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json({ message: 'Artist fetched successfully', artist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update artist details
export const updateArtist = async (req, res) => {
  const { name, email, businessName, specialization,profileImage,phoneNumber,
    DOB, AboutHimself,aadhar, address, city, state, pincode } = req.body;

  try {
    const updatedArtist = await Artists.findOneAndUpdate(
      { id: req.user.id },
      {
        name,
        email,
        businessName,
        specialization,
        phoneNumber,
        profileImage,
        DOB,
        AboutHimself,
        aadhar,
        address,
        city,
        state,
        pincode,
      },
      { new: true } // Return the updated document
    );

    res.json({ message: 'Artist updated successfully', artist: updatedArtist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete artist (accessible by the artist or admin)
export const deleteArtist = async (req, res) => {
  const { id } = req.params;

  try {
    // logged-in artist can only delete their own account, or admin can delete any artist
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }

    const deletedArtist = await Artists.findOneAndDelete({ id });
    if (!deletedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json({ message: 'Artist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Artist login function (for login)
export const loginArtist = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the artist by email
    const artist = await Artists.findOne({ email });
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, artist.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for the artist
    const token = jwt.sign(
      { artistId: artist.id, role: artist.role || 'artist' },  // Include the admin's role in the token
      process.env.JWT_SECRET,  // Ensure you have JWT_SECRET in your .env file
      { expiresIn: '1d' }  // Token expiry set to 1 day (adjust as needed)
    );

    // Respond with the token and artist data
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: artist.id,
        name: artist.name,
        email: artist.email,
        userType: 'artist',
        businessName: artist.businessName,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in artist',
      error: error.message,
    });
  }
};
export const joinEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    // Find the artist by ID
    const artist = await Artists.findById(req.user.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Find the event by ID
    const event = await Events.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the artist has already joined the event
    if (artist.joinedEvents.includes(eventId)) {
      return res.status(400).json({ message: 'Artist already joined the event' });
    }

    // Add the event to the artist's joined events
    artist.joinedEvents.push(eventId);
    await artist.save();

    res.status(200).json({ message: 'Event joined successfully', artist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// http://localhost:5000/api/artists/register POST
// {
//   "name": "John Doe",
//   "email": "john.doe@example.com",
//   "password": "securepassword",
//   "businessName": "John's Art Studio",
//   "specialization": ["Painting", "Sculpture"],
//   "DOB": "1985-05-15",
//   "AboutHimself": "An experienced artist specializing in modern art.",
//   "contact": {
//     "value": "1234567890",
//     "verify": false
//   },
//   "address": "123 Art Street",
//   "city": "Artville",
//   "state": "Creativia",
//   "pincode": "123456",
//   "aadhar": "1234-5678-9012"
// }

// http://localhost:5000/api/artists/login  POST
// {
//   "email": "john.doe@example.com",
//   "password": "securepassword"
// }
//http://localhost:5000/api/artists GET 
// http://localhost:5000/api/artists/:id -->put
// http://localhost:5000/api/artists/<artist_id> -->delete
// Get artist of the month based on highest sales

export const getArtistOfTheMonth = async (req, res) => {
  try {
    // Find the artist with the highest sales
    const artistOfTheMonth = await Artists.findOne().sort({ totalSales: -1 }).limit(1);
    if (!artistOfTheMonth) {
      return res.status(404).json({ message: 'No artists found' });
    }
    res.status(200).json({
      message: 'Artist of the month fetched successfully',
      artist: artistOfTheMonth,
    });
  } catch (error) {
    console.error('Error fetching artist of the month:', error);
    res.status(500).json({
      message: 'Error fetching artist of the month',
      error: error.message,
    });
  }
};


