// artisan-marketplace\backend\controllers\artistController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Artists from '../models/Artists.js';  

// Create new artist (open)
export const createArtist = async (req, res) => {
  const { name, email, password, businessName, specialization, DOB, AboutHimself, phoneNumber, address, city, state, pincode, aadhar } = req.body;
  
  console.log("Console log",req.body);
  try {
    // Check if the artist exists
    const existingArtist = await Artists.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ message: 'Artist already exists' });
    }

    // Hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new artist instance with hashed password
    const newArtist = new Artists({
      name,
      email,
      password: hashedPassword,
      businessName,
      specialization,
      DOB,
      AboutHimself,
      phoneNumber,
      address,
      city,
      state,
      pincode,
      aadhar,
    });

    // Save the new artist to the database
    await newArtist.save();
    res.status(201).json({ message: "Artist created successfully", artist: newArtist });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// Get all artists (open to everyone, no authorization required)
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artists.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update artist details
export const updateArtist = async (req, res) => {
  const { name, email, businessName, specialization, AboutHimself, address, city, state, pincode } = req.body;

  try {
    const updatedArtist = await Artists.findOneAndUpdate(
      { id: req.user.id },
      {
        name,
        email,
        businessName,
        specialization,
        AboutHimself,
        address,
        city,
        state,
        pincode,
      },
      { new: true } // Return the updated document
    );

    res.json({ message: 'Artist updated successfully', artist: updatedArtist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete artist (accessible by the artist or admin)
export const deleteArtist = async (req, res) => {
  const { id } = req.params;

  try {
    // logged-in artist can only delete their own account, or admin can delete any artist
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }

    const deletedArtist = await Artists.findOneAndDelete({ id });
    if (!deletedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json({ message: 'Artist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Artist login function (for login)
export const loginArtist = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the artist by email
    const artist = await Artists.findOne({ email });
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, artist.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for the artist
    const token = jwt.sign(
      { artistId: artist.id, role: artist.role || 'artist' },  // Include the artist's role in the token
      process.env.JWT_SECRET,  // Ensure you have JWT_SECRET in your .env file
      { expiresIn: '1d' }  // Token expiry set to 1 day (adjust as needed)
    );

    // Respond with the token and artist data
    res.json({
      message: 'Login successful',
      token,
      artist: {
        id: artist.id,
        name: artist.name,
        email: artist.email,
        businessName: artist.businessName,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in artist',
      error: error.message,
    });
  }
};



// http://localhost:5000/api/artists/register POST
// {
//   "name": "John Doe",
//   "email": "john.doe@example.com",
//   "password": "securepassword",
//   "businessName": "John's Art Studio",
//   "specialization": ["Painting", "Sculpture"],
//   "DOB": "1985-05-15",
//   "AboutHimself": "An experienced artist specializing in modern art.",
//   "contact": {
//     "value": "1234567890",
//     "verify": false
//   },
//   "address": "123 Art Street",
//   "city": "Artville",
//   "state": "Creativia",
//   "pincode": "123456",
//   "aadhar": "1234-5678-9012"
// }

// http://localhost:5000/api/artists/login  POST
// {
//   "email": "john.doe@example.com",
//   "password": "securepassword"
// }
//http://localhost:5000/api/artists GET 
// http://localhost:5000/api/artists/:id -->put
// http://localhost:5000/api/artists/<artist_id> -->delete
