// backend/controllers/adminController.js
import Artists from '../models/Artists.js';
import Products from '../models/Products.js';
import Orders from '../models/Orders.js';
import Events from '../models/Events.js';
import Admins from '../models/Admins.js';
import { unverifiedArtistsWithOrders } from '../utils/unverifiedArtistsWithOrders.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';


export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artists.find({});
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to fetch all unverified artists with 5 or more than 5 orders.
export const getAllUnverifiedArtistsWithOrders = async (req, res) => {
  try {
    const unverifiedArtists = await unverifiedArtistsWithOrders();

    if (!unverifiedArtists) {
      return res
        .status(200)
        .json({ message: "No unverified artists with 5 or more orders found." });
    }

    res.status(200).json(unverifiedArtists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Events.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update all Unverified Artists with Orders 5 or more to Verified.
export const updateAllUnverifiedArtisans = async (req, res) => {
  try {
    // Get all Unverified Artists with Order 5 or more.
    const unverifiedArtists = await unverifiedArtistsWithOrders(); // Await the function if it's asynchronous

    // Ensure the result is an array
    if (!Array.isArray(unverifiedArtists)) {
      throw new Error("unverifiedArtistsWithOrders did not return an array.");
    }

    const artisanIds = unverifiedArtists.map(artisan => artisan.id);

    const result = await Artists.updateMany(
      { id: { $in: artisanIds } },
      { $set: { verified: true } }
    );

    res.status(200).json({ message: `${result.modifiedCount} artisans updated to verified.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update particular Unverified Artist with Orders 5 or more to Verified.
export const updateParticularUnverifiedArtist  = async (req, res) => {
  try{
    // Get all Unverified Artists with Order 5 or more.
    const artistId = req.params.id;
    const result = await Artists.updateOne(
      { id: artistId, verified: false }, // Match the artisan by ID and ensure it's currently unverified
      { $set: { verified: true } } // Update the `verified` field to true
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: `Artisan with ID ${artistId} has been updated to verified.` });
    } else {
      res.status(400).json({ message:`No artisan found with ID ${artistId} or already verified.` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteArtist = async (req, res) => {
  try {
    const artistId = req.params.id;

    // Find and delete the artist by the custom 'id' field (UUID)
    const artist = await Artists.findOneAndDelete({ id: artistId });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Admin Registration (Only allows two admins)
export const adminRegister = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if there are already 2 admins in the database
    const adminCount = await Admins.countDocuments();

    if (adminCount >= 2) {
      return res.status(400).json({ message: 'Only two admins are allowed for this application.' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new admin document
    const newAdmin = new Admins({
      id: uuidv4(), // Generate a unique ID for the admin
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admins.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Password' });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        userType: 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArtistsWithProducts = async (req, res) => {
  try {
    // Fetch only specific artist fields
    const artists = await Artists.find({}, 'id name verified').lean();

    // Check if artists is null or undefined
    if (!artists || artists.length === 0) {
      return res.status(404).json({ message: "No artists found" });
    }

    // Fetch products for each artist and attach them
    const artistsWithProducts = await Promise.all(
      artists.map(async (artist) => {
        // Ensure artist.id exists before querying
        if (!artist.id) {
          console.warn('Artist missing ID:', artist);
          return { ...artist, products: [] };
        }

        try {
          const products = await Products.find({ 
            artistId: artist.id 
          }, 'productId name price quantity description category status').lean(); // Fetch comprehensive product details

          return { 
            ...artist, 
            products: products || [] 
          };
        } catch (productFetchError) {
          console.error(`Error fetching products for artist ${artist.id}:`, productFetchError);
          return { 
            ...artist, 
            products: [],
            productFetchError: productFetchError.message 
          };
        }
      })
    );

    // Ensure we always return a valid response
    res.status(200).json({
      message: "Artists and products fetched successfully",
      data: artistsWithProducts,
      total: artistsWithProducts.length
    });

  } catch (error) {
    console.error("Error in getArtistsWithProducts:", error);
    res.status(500).json({
      message: "Error fetching artists and products",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// http://localhost:5000/api/admins/register  --> POST request



