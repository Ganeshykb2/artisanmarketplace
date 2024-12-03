//./routes/artistRoutes.js
import express from 'express';
import { createArtist, getAllArtists, updateArtist, deleteArtist, loginArtist } from '../controllers/artistController.js';
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
  if (req.user._id.toString() !== artistId) {
    return res.status(403).json({ message: 'You can only update your own details.' });
  }

  updateArtist(req, res);  // Proceed with the update
});

// Delete artist account (only accessible by the artist after login)
router.delete('/:id', artistAuth, async (req, res) => {
  const artistId = req.params.id;

  // Ensure the logged-in artist can only delete their own account
  if (req.user._id.toString() !== artistId) {
    return res.status(403).json({ message: 'You can only delete your own account.' });
  }

  deleteArtist(req, res);  // Proceed with the delete
});

export default router;
