import jwt from 'jsonwebtoken';
import Artists from '../models/Artists.js';

const artistAuth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const artist = await Artists.findOne({ id: decoded.artistId }); // Get the artist from DB using the decoded artistId

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    req.user = artist; // Attach the artist details to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default artistAuth;
