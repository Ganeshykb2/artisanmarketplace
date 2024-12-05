// backend\controllers\adminController.js
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
  try{
    const unverifiedArtists = unverifiedArtistsWithOrders();
    res.status(200).json(unverifiedArtists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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

    const artisanIds = unverifiedArtists.map(artisan => artisan._id);

    const result = await Artists.updateMany(
      { _id: { $in: artisanIds } },
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
      { _id: artistId, verified: false }, // Match the artisan by ID and ensure it's currently unverified
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
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

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
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// http://localhost:5000/api/admins/register  --> POST request
// {
//   "name": "Admin Name",
//   "username": "admin_username",
//   "email": "admin@example.com",
//   "password": "securepassword"
// }
// http://localhost:5000/api/admins/login --> POST request
//{
// "username": "admin_username",
// "password": "securepassword"
// }
// http://localhost:5000/api/admins/artists -->get request
// http://localhost:5000/api/admins/unverified-artists -->get Request
// http://localhost:5000/api/admins/products -->get request
// http://localhost:5000/api/admins/orders --> get request
// http://localhost:5000/api/admins/events -->get request
// 


