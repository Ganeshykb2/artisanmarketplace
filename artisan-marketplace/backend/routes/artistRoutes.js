//./routes/artistRoutes.js
import express from 'express';
import { createArtist,dashBoard, getAllArtists,getArtistsDetails, updateArtist, deleteArtist, loginArtist, getArtistOfTheMonth, joinEvent,} from '../controllers/artistController.js';
import artistAuth from '../middlewares/artistAuth.js'; // Import Artist Authorization middleware

const router = express.Router();

// Artist registration (no auth required)
router.post('/register', createArtist);

// Artist login (no auth required)
router.post('/login', loginArtist);

// Get all artists (public route, no auth required)
router.get('/', getAllArtists);


router.get('/dashboard',artistAuth, dashBoard);

router.put('/update', artistAuth, updateArtist );

//to get details of the artist
router.get('/getartistdetails',artistAuth,getArtistsDetails);

// Delete artist account (only accessible by the artist after login)
router.delete('/delete/:id', artistAuth, async (req, res) => {
  const artistId = req.params.id;

  // Ensure the logged-in artist can only delete their own account
  if (req.user.id !== artistId) {
    return res.status(403).json({ message: 'You can only delete your own account.' });
  }
  deleteArtist(req, res);  // Proceed with the delete
});
router.get('/artist-of-the-month', getArtistOfTheMonth);
router.post('/join-event', artistAuth, joinEvent);
export default router;
