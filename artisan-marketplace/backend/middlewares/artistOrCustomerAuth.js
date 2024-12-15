import Artists from "../models/Artists.js";
import Customers from "../models/Customers.js";
import jwt from 'jsonwebtoken';

export default async function artistOrCustomerAuth(req, res, next) {
     const token = req.headers['authorization']?.split(' ')[1]; // Get the token from Authorization header
    
      if (!token) {
        return res.status(403).json({ message: 'No token provided' });
      }
    
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded?.artistId){
          const artist = await Artists.findOne({ id: decoded.artistId });
          req.userType = 'artist';
          req.user = artist;
          next();
        }
        else if(decoded?.customerId){
          const customer = await Customers.findOne({ id: decoded.customerId });
          req.userType = 'customer';
          req.user = customer;
          next();
        }
        else{
          return res.status(404).json({ message: 'User not found' });
        }
        
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

}