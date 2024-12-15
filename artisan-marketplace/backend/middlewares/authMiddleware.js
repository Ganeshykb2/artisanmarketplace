import jwt from 'jsonwebtoken';
import Customer from '../models/Customers.js';

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or improperly formatted' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token generated in loginCustomer
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the customer using the custom 'id' field instead of findById
    const customer = await Customer.findOne({ id: decoded.customerId });
    if (!customer) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach customer info to the request
    req.userType = 'customer';
    req.user = customer;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};