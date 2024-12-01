// controllers/adminController.js
import Artists from '../models/Artists.js';
import Products from '../models/Product.js';
import Orders from '../models/Orders.js';
import Events from '../models/Events.js';
import Admins from '../models/Admins.js';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the admin exists by username
    const admin = await Admins.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token expires in 1 hour
    );

    // Send token and admin details in the response
    res.json({ 
      message: 'Login successful', 
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in admin', error: error.toString() });
  }
};


// Admin can view all artists
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artists.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin can view all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin can view all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find().populate('artisanId').populate('productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin can view all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Events.find().populate('artistId');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
