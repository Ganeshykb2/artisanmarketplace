// backend/controllers/customerController.js
import Customer from '../models/Customers.js';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
//customer registration (accessible by anyone public route)
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
    res.status(500).json({ 
      message: 'Error registering customer', 
      error: error.toString() 
    });
  }
};
//login customers accessible by anyone
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

    // Ensure JWT_SECRET is set in your .env file
    const token = jwt.sign(
      { customerId: customer._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Login successful', 
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in customer', 
      error: error.toString() 
    });
  }
};

// Fetch customer orders
export const getCustomerOrders = async (req, res) => {
  try {
    // The authenticated user's ID is available in req.user._id
    const customerId = req.user._id;

    // Fetch the customer by their MongoDB _id and populate their purchaseHistory
    const customer = await Customer.findById(customerId).populate('purchaseHistory');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if the customer has any orders in their purchaseHistory
    if (!customer.purchaseHistory || customer.purchaseHistory.length === 0) {
      return res.status(200).json({ message: 'No orders found for this customer', orders: [] });
    }

    // If orders exist, return the populated purchaseHistory
    res.json({ 
      message: 'Orders retrieved successfully', 
      orders: customer.purchaseHistory 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error.toString() 
    });
  }
};



// localhost:5000/api/customers/register POST
// {
//   "name": "John Doe",
//   "email": "john.doe@example.com",
//   "password": "Password123!",
//   "phoneNumber": "1234567890",
//   "address": "123 Main St",
//   "city": "Anytown",
//   "state": "Anystate",
//   "pincode": "123456"
// }
//purchase history and profile image also available while registration

// localhost:5000/api/customers/login POST
// {
//   "email": "john.doe@example.com",
//   "password": "Password123!"
// }
// {
//   "message": "Login successful",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcklkIjoiNjc0YjRiMjQ4Y2UxMTc4MzNlNGQzM2NiIiwiaWF0IjoxNzMyOTg4MzcwLCJleHAiOjE3MzI5OTE5NzB9.nrxsW8Pl2gsaVJM0-gmnZ_tLp5N6-vLyR7W_cxloWv8"
// }

