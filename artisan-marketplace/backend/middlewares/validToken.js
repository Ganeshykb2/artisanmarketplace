import jwt from 'jsonwebtoken';
import Customer from '../models/Customers.js';
import Artists from '../models/Artists.js';
import Admins from '../models/Admins.js';

export const validToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or improperly formatted' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token generated in loginCustomer
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the customer using the custom 'id' field instead of findById
    // if(decoded?.exp){
    //     return res.status(401).json({ message: 'Token expired' });
    // }
    if(decoded?.artistId){
        const artist = await Artists.findOne({ id: decoded.artistId });
        req.user = artist;
        artist ? res.status(200).json({ message: 'Token is valid', artist:  {
            id: artist.id,
            name: artist.name,
            email: artist.email
          }
        }) : res.status(401).json({ message: 'User not found' })
    }else if(decoded?.adminId){
        const admin = await Admins.findOne({ id: decoded.adminId });
        req.user = admin;
        admin ? res.status(200).json({ message: 'Token is valid', admin: {
            id: admin.id,
            name: admin.name,
            username: admin.username
          }
        }) : res.status(401).json({ message: 'User not found' })
    }
    else if(decoded?.customerId){
        const customer = await Customer.findOne({ id: decoded.customerId });
        req.user = customer;
        customer ? res.status(200).json({ message: 'Token is valid', customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email
          }
        }) : res.status(401).json({ message: 'User not found' })
    }else{
        return res.status(400).json({ message: 'Invalid Token' });
    }

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};