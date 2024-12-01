import express from 'express';
import { createArtist, getAllArtists, updateArtist, deleteArtist, loginArtist } from '../controllers/artistController.js';
import adminAuth from '../middlewares/adminAuth.js'; // Import Admin Authorization middleware
import artistAuth from '../middlewares/artistAuth.js'; // Import Artist Authorization middleware

const router = express.Router();

// Artist registration (no auth required)
router.post('/register', createArtist);

// Artist login (no auth required)
router.post('/login', loginArtist);

// Get all artists (public route, no auth required)
router.get('/', getAllArtists);

// Update artist details (only accessible by the artist after login)
router.put('/:id', artistAuth, async (req, res) => {
  const artistId = req.params.id;

  // Ensure the logged-in artist can only update their own details
  if (req.user._id.toString() !== artistId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can only update your own details.' });
  }

  updateArtist(req, res);  // Proceed with the update
});

// Delete artist account (only accessible by the artist after login)
router.delete('/:id', artistAuth, async (req, res) => {
  const artistId = req.params.id;

  // Ensure the logged-in artist can only delete their own account
  if (req.user._id.toString() !== artistId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can only delete your own account.' });
  }

  deleteArtist(req, res);  // Proceed with the delete
});

// Admin-only routes
router.use(adminAuth);  // All routes below will require admin authorization

// Route to get all artists (only accessible by the admin)
router.get('/admin/artists', getAllArtists);

// Route to update artist details (admin can update any artist)
router.put('/admin/artists/:id', updateArtist);

// Route to delete artist account (admin can delete any artist)
router.delete('/admin/artists/:id', deleteArtist);

export default router;
