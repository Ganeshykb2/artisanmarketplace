// artisan-marketplace\backend\controllers\customerController.js
import Customers from '../models/Customers.js';
import Products from '../models/Products.js';
import Events from '../models/Events.js';
import Orders from '../models/Orders.js';
import Artists from '../models/Artists.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Reviews from '../models/Reviews.js';

// Customer registration
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, city, state, pincode } = req.body;
    // Check if customer already exists
    const existingCustomer = await Customers.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customers({
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

    const customer = await Customers.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { customerId: customer.id }, // Use custom UUID field 'id'
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        userType: 'customer'
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
    const customerId = req.user.id; // Use custom UUID field 'id'

    const customer = await Customers.findOne({ id: customerId }).populate('purchaseHistory');
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
    const customerId = req.user.id; // Use custom UUID field 'id'

    // Find the product the customer is ordering
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    

    // Create the new order
    const newOrder = new Orders({
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
    const customer = await Customers.findOne({ id: customerId });
    customer.purchaseHistory.push(newOrder.id);
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
    const products = await Products.find().sort({ views: -1 }); // Sorting by popularity (views)
    res.json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.toString() });
  }
};

// Get event details by name
export const getEventByName = async (req, res) => {
  try {
    const eventName = req.params.eventName;

    const event = await Events.findOne({ name: { $regex: new RegExp(eventName, 'i') } })
      .populate('artistId', 'name bio') // Populate artist data
      .populate('participants.participantId', 'name email'); // Optionally populate participant info

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event details retrieved successfully', event });
  } catch (error) {
    console.error('Error fetching event by name:', error);
    res.status(500).json({ message: 'Error fetching event details', error: error.toString() });
  }
};

export const joinEvent = async (req, res) => {
  const { customerId, eventId } = req.body;

  try {
    // Find the customer by ID
    const customer = await Customers.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Find the event by ID
    const event = await Events.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the customer has already joined the event
    if (customer.joinedEvents.includes(eventId)) {
      return res.status(400).json({ message: 'Customer already joined the event' });
    }

    // Add the event to the customer's joined events
    customer.joinedEvents.push(eventId);
    await customer.save();

    res.status(200).json({ message: 'Event joined successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get artist profile by artistId
export const getArtistProfile = async (req, res) => {
  try {
    const artistId = req.params.artistId;

    // Find the artist by artistId
    const artist = await Artists.findById(artistId);
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
    const artists = await Artists.find();

    if (!artists || artists.length === 0) {
      return res.status(404).json({ message: 'No artists found' });
    }

    res.json({ message: 'Artists retrieved successfully', artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ message: 'Error fetching artists', error: error.toString() });
  }
};
// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Events.find().populate('artistId', 'name bio'); // Populate artist data
    res.status(200).json({ message: 'Events retrieved successfully', events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error: error.toString() });
  }
};


// Get product by ID
export const getProductById = async (req, res) => {
  const { productId } = req.params; // Extract productId from route parameters
  try {
    const product = await Product.findOne({ productId }); // Find product by its unique ID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product retrieved successfully', product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.toString() });
  }
};
export const getCustomerAddressDetails = async (req, res) => {
  try {
    const customerId = req.user.id; // Assuming `req.user.id` contains the authenticated customer's custom UUID field

    // Find the customer by their custom UUID (id)
    const customer = await Customers.findOne({ id: customerId }, 'address pincode state country city'); // Only fetch the required fields

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer address details retrieved successfully',
      addressDetails: {
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        country: customer.country || 'India', // Default to 'India' if not explicitly stored
      },
    });
  } catch (error) {
    console.error('Error fetching customer address details:', error);
    res.status(500).json({
      message: 'Error fetching customer address details',
      error: error.toString(),
    });
  }
};

export const makePayment = async (req, res) => {
  try {
    const { orderId, artisanId, amount, paymentMethod, transactionId } = req.body;
    const customerId = req.user.id; // Use custom UUID field 'id'

    // Validate order
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate customer
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate artisan
    const artisan = await Artists.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    // Create a new payment record
    const newPayment = new Payment({
      paymentId: uuidv4(),
      orderId,
      customerId: customer._id,
      artisanId,
      amount,
      paymentMethod,
      status: 'pending',
      transactionId,
    });

    await newPayment.save();

    res.status(201).json({ message: 'Payment initiated successfully', payment: newPayment });
  } catch (error) {
    console.error('Error making payment:', error);
    res.status(500).json({ message: 'Error making payment', error: error.toString() });
  }
};
export const getProductReviews = async (req, res) => {
  const { productId } = req.params; // Extract productId from route parameters
  
  try {
    // Find product to ensure it exists
    const product = await Products.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get reviews for the product
    const reviews = await Reviews.find({ productId }).populate('customerId', 'name'); // Populate customer details like name

    res.status(200).json({
      message: 'Product reviews fetched successfully',
      reviews: reviews
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      message: 'Error fetching product reviews',
      error: error.toString()
    });
  }
};

// Submit a product review
export const submitProductReview = async (req, res) => {
  const { productId } = req.params;  // Get the productId from route params
  const { rating, comment } = req.body;  // Get rating and comment from request body

  // Ensure the rating is within the range of 1-5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Find the product by its custom `productId` (which is the UUID, not MongoDB's default _id)
    const product = await Products.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a new review for the product
    const review = new Reviews({
      customerId: req.user.id, // Use the custom `id` from the Customer model (UUID)
      productId: product.productId, // Use productId here (UUID)
      artistId: product.artistId,  // Assuming artistId is part of the product schema
      rating,
      comment,
    });

    // Save the review to the database
    await review.save();

    // Optionally, update the product's average rating
    product.averageRating = await Reviews.aggregate([
      { $match: { productId: product.productId } }, // Match by custom productId
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]).then(result => result[0]?.avgRating || 0);

    await product.save();

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      message: 'Error submitting review',
      error: error.toString(),
    });
  }
};

// http://localhost:5000/api/customers/register --> POST
// {
//   "name": "Customer1",
//   "email": "cus@example.com",
//   "password": "securepassword",
//   "phoneNumber": "9880001988",
//   "address": "123 Main St",
//   "city": "Cityname",
//   "state": "Statename",
//   "pincode": "123456"
// }
// http://localhost:5000/api/customers/login --> POST
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcklkIjoiZmE4MTViN2QtMjhkMS00OTQ2LTk4M2MtNmFiNWQ4OWFmYjdiIiwiaWF0IjoxNzMzMzM2NTYwLCJleHAiOjE3MzM0MjI5NjB9.YkHhHF6I5qc76N-30rX-1HgBuU6IAS4R0C_rnBf-qDA
// http://localhost:5000/api/customers/orders --> GET (private)
// http://localhost:5000/api/customers/products --> GET (public)
