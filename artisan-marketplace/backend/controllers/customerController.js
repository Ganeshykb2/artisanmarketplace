// backend/controllers/customerController.js
import Customer from '../models/Customers.js';
import Product from '../models/Products.js';
import Event from '../models/Events.js';
import Order from '../models/Orders.js';
import Artists from '../models/Artists.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Customer registration
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, city, state, pincode } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      city,
      state,
      pincode,
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully', customer: newCustomer });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering customer', error: error.toString() });
  }
};

// Customer login
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { customerId: customer.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in customer', error: error.toString() });
  }
};


// Fetch customer orders
export const getCustomerOrders = async (req, res) => {
  try {
// Assuming customerId from JWT is a string (UUID)
const customerId = req.user.id; // This is a string (UUID)
const customer = await Customer.findOne({ id: customerId }).populate('purchaseHistory'); // Using 'id' instead of '_id'


    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.purchaseHistory || customer.purchaseHistory.length === 0) {
      return res.status(200).json({ message: 'No orders found for this customer', orders: [] });
    }

    res.json({ message: 'Orders retrieved successfully', orders: customer.purchaseHistory });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.toString() });
  }
};

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { productId, quantity, totalPrice, shippingAddress } = req.body;
    // In placeOrder method
    const customerId = req.user.id;



    // Find the product the customer is ordering
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Create the new order
    const newOrder = new Order({
      customerId,
      productId,
      quantity,
      totalPrice,
      shippingAddress,
      status: 'pending', // You can add more statuses as needed
    });

    await newOrder.save();

    // Update the product stock
    product.quantity -= quantity;
    await product.save();

    // Add the order to the customer's purchaseHistory
    const customer = await Customer.findById(customerId);
    customer.purchaseHistory.push(newOrder._id);
    await customer.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error: error.toString() });
  }
};

// Fetch all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ views: -1 }); // Sorting by popularity (views)
    res.json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.toString() });
  }
};

// Get event details
export const getEventByName = async (req, res) => {
  try {
    const eventName = req.params.eventName;

    // Find the event by its name (case insensitive search)
    const event = await Event.findOne({ name: { $regex: new RegExp(eventName, 'i') } });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event details retrieved successfully', event });
  } catch (error) {
    console.error('Error fetching event by name:', error);
    res.status(500).json({ message: 'Error fetching event details', error: error.toString() });
  }
};

// join event by ID
export const joinEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId; // Event ID from URL parameter
    const customerId = req.user.id;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if customer has already joined
    if (event.participants.includes(customerId)) {
      return res.status(400).json({ message: 'You are already joined in this event' });
    }

    // Add the customer to the event participants
    event.participants.push(customerId);
    await event.save();

    res.json({ message: 'Successfully joined the event', event });
  } catch (error) {
    console.error('Error joining event by ID:', error);
    res.status(500).json({ message: 'Error joining event', error: error.toString() });
  }
};
// join event by name
export const joinEventByName = async (req, res) => {
  try {
    const eventName = req.params.eventName; // Event name from URL parameter
    const customerId = req.user.id;

    // Find the event by name (case insensitive search)
    const event = await Event.findOne({ name: { $regex: new RegExp(eventName, 'i') } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if customer has already joined
    if (event.participants.includes(customerId)) {
      return res.status(400).json({ message: 'You are already joined in this event' });
    }

    // Add the customer to the event participants
    event.participants.push(customerId);
    await event.save();

    res.json({ message: 'Successfully joined the event', event });
  } catch (error) {
    console.error('Error joining event by name:', error);
    res.status(500).json({ message: 'Error joining event', error: error.toString() });
  }
};

// Get artist profile by artistId
export const getArtistProfile = async (req, res) => {
  try {
    const artistId = req.params.artistId;

    // Find the artist by artistId
    const artist = await Artists.findOne({ artistId });
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Increment profile views
    artist.profileViews += 1;
    await artist.save();

    res.json({
      message: 'Artist profile retrieved successfully',
      artist: {
        name: artist.name,
        bio: artist.bio,
        profileImage: artist.profileImage,
        profileViews: artist.profileViews,
      }
    });
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    res.status(500).json({ message: 'Error fetching artist profile', error: error.toString() });
  }
};
// Get a list of all artists
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();

    if (!artists || artists.length === 0) {
      return res.status(404).json({ message: 'No artists found' });
    }

    res.json({
      message: 'Artists retrieved successfully',
      artists: artists.map(artist => ({
        artistId: artist.artistId,
        name: artist.name,
        profileImage: artist.profileImage,
        profileViews: artist.profileViews,
      }))
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ message: 'Error fetching artists', error: error.toString() });
  }
};





